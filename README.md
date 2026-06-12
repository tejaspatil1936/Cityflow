# CityFlow SMC

A real-time traffic, parking, and emergency-routing dashboard built for Solapur Municipal Corporation.

## Overview

CityFlow SMC is a single-page dashboard that visualizes city traffic conditions on an interactive map, tracks parking zone occupancy, and lets an operator activate priority routing for emergency vehicles. It was built as a hackathon prototype (see version 1.0.0 commit history) targeting Solapur, India, with all sample data — junction names, coordinates, and events like the Siddheshwar Yatra festival — modeled on that city.

The app reads live data from Firestore when it is configured, and transparently falls back to bundled mock data whenever Firestore is empty, unreachable, or not set up. This lets the dashboard run and demo correctly with zero backend configuration.

## Features

- **Interactive city map** (Mapbox GL via `react-map-gl`) with color-coded junction markers (green/amber/red) based on live congestion score.
- **Congestion heatmap** overlay toggle, rendered as a Mapbox GL heatmap layer weighted by each junction's congestion score.
- **Junction detail popups** showing a 24-hour traffic pattern chart (Recharts area chart), current vs. recommended signal green-light duration, suggested alternate routes, and illegal-parking flags.
- **Signal optimizer** — a simulated analysis pass that recommends new green-light timings for junctions above a congestion threshold and projects the resulting congestion drop.
- **Parking zone dashboard** with occupancy bars, "Almost Full" thresholds, and illegal-vehicle counts per zone.
- **Emergency routing mode** — pick a predefined ambulance/fire/police scenario, fetch a real driving route from the Mapbox Directions API, highlight the junctions along that route on the map, and log the activation to Firestore.
- **Live alerts feed** combining system messages, simulated citizen reports, and emergency activations, with auto-scroll to the latest entry.
- **Simulated live activity**: congestion scores, parking occupancy, and a running CO2-saved counter all update on client-side timers to emulate a live city feed.

## Tech Stack

**Frontend**
- React 18 with Vite 5 (dev server, build tooling)
- `react-map-gl` + `mapbox-gl` for the map, markers, heatmap and route layers
- Recharts for the traffic pattern area chart
- Hand-written CSS (no UI framework)

**Database / Cloud**
- Firebase Firestore as the live data store (`junctions`, `parking`, `logs` collections), accessed directly from the client via the Firebase JS SDK
- Mapbox Directions API for real driving-route geometry between emergency origin/destination points

## Architecture

CityFlow SMC is a client-only single-page app — there is no custom backend server. All persistence and routing calls go straight from the browser to Firebase and Mapbox.

- `App.jsx` owns top-level state (active tab, alerts, CO2 counter, emergency route) and four `setInterval`-based simulators that mimic a live city feed (CO2 accumulation, random citizen alerts, parking occupancy drift, junction congestion drift).
- `hooks/useJunctions.js` and `hooks/useParking.js` each subscribe to a Firestore collection with `onSnapshot`. If the collection is empty or the subscription errors (e.g. no Firebase project configured), the hook falls back to the bundled data in `src/data/`, so the UI never breaks due to missing credentials.
- `utils/congestion.js` centralizes the congestion-score-to-color/label/severity mapping and the signal-optimizer logic, so the map markers, popups, and optimizer panel all agree on thresholds (>70 = high/red, >40 = moderate/amber, else low/green).
- `utils/emergency.js` holds the three predefined emergency scenarios and calls the Mapbox Directions API for route geometry, falling back to a straight line between origin and destination if the API call fails.
- `seed.js` exports a `seedDatabase()` helper that writes the local mock junctions/parking data into Firestore. It is not wired into the UI — it is meant to be run manually (e.g. from a console/script) to populate a fresh Firestore project.

## Project Structure

```
Cityflow/
├── index.html                     Vite entry HTML
├── vite.config.js                 Vite + React plugin config
├── .env.example                   Required environment variables template
└── src/
    ├── main.jsx                   React root
    ├── App.jsx                    Top-level state, tabs, live-data simulators
    ├── firebase.js                Firebase app + Firestore initialization
    ├── seed.js                    One-off script to seed Firestore from local data
    ├── index.css                  Global styles
    ├── data/
    │   ├── junctions.js           Mock junction dataset (10 Solapur junctions)
    │   └── parking.js             Mock parking zone dataset (5 zones)
    ├── hooks/
    │   ├── useJunctions.js        Firestore subscription + local fallback for junctions
    │   └── useParking.js          Firestore subscription + local fallback for parking
    ├── utils/
    │   ├── congestion.js          Severity/color helpers + signal optimizer logic
    │   └── emergency.js           Emergency route definitions + Mapbox Directions call
    └── components/
        ├── Map/                   CityMap, HeatmapLayer, EmergencyRoute, JunctionPopup
        ├── Dashboard/             StatsBar, AlertsFeed
        ├── Signal/                OptimizerPanel
        ├── Parking/               ParkingCards
        └── Emergency/             EmergencyPage
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Mapbox access token (for the map and Directions API)
- A Firebase project with Firestore enabled (optional — the app works with mock data if this is skipped)

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
|---|---|
| `VITE_MAPBOX_TOKEN` | Mapbox public access token used by the map and the Directions API call |
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

Without a Mapbox token the map will not render. Without Firebase credentials, junction and parking data fall back to the bundled mock datasets and Firestore writes (parking/congestion simulators, emergency logs) silently no-op.

### Run locally

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Usage

The dashboard opens on the **Map** tab, showing all junctions as colored pins (click a pin for its traffic pattern, signal timing, and alternate route). Toggle **Show Heatmap** for a citywide congestion overlay, and use **Run Optimizer** in the side panel to generate signal-timing recommendations for the most congested junctions.

The **Parking** tab lists each parking zone with live occupancy and illegal-parking counts. The **Emergency** tab lets you select a predefined ambulance/fire/police route and activate priority routing, which draws the route on the map, highlights the junctions it passes through, and posts an alert to the live feed.

## Design Decisions

- **Graceful degradation over hard dependency on Firebase.** Every Firestore read (`useJunctions`, `useParking`) and write (parking/congestion simulators, emergency log) is wrapped so a missing or misconfigured Firebase project never breaks the UI — it silently falls back to local mock data or no-ops. This lets the app be cloned and demoed without any backend setup.
- **Single source of truth for congestion thresholds.** `getSeverity`, `getColor`, `getLabel`, and `runOptimizer` all live in one file (`utils/congestion.js`) so the map pins, popups, and optimizer panel can't drift out of sync on what counts as "high" congestion.
- **Real routing with a safety net.** The emergency-route feature calls the live Mapbox Directions API for realistic road geometry, but falls back to a straight line between origin and destination if the request fails, so the feature degrades instead of breaking.

## Future Improvements

- Wire `seed.js` into an authenticated admin action (or a documented CLI script) instead of leaving it as an unused export.
- Add Firestore security rules and move writes (congestion/parking simulators, emergency logs) behind a backend or authenticated context, since the client currently writes to Firestore directly with no access control shown in the repo.
- Replace the `setInterval`-based congestion and parking simulators with real sensor/API data feeds.
- Add automated tests — the repo currently has no test setup.
