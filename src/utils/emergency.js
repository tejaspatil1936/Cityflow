const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const EMERGENCY_ROUTES = [
    {
        label: "Ambulance — Bus Stand to Civil Hospital",
        origin: [75.9156, 17.6835],
        destination: [75.9085, 17.6740],
        junctions_on_route: ["junction_04", "junction_01", "junction_09"],
        time_saved: "3 min 20 sec",
        type: "ambulance"
    },
    {
        label: "Fire Engine — Market Yard to Fire Station",
        origin: [75.9220, 17.6810],
        destination: [75.9073, 17.6868],
        junctions_on_route: ["junction_10", "junction_03", "junction_01"],
        time_saved: "2 min 45 sec",
        type: "fire"
    },
    {
        label: "Police — Hotgi Naka to Railway Station",
        origin: [75.9102, 17.6712],
        destination: [75.9201, 17.6801],
        junctions_on_route: ["junction_02", "junction_09", "junction_03"],
        time_saved: "1 min 55 sec",
        type: "police"
    },
];

export async function getEmergencyRoute(origin, destination) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${origin[0]},${origin[1]};${destination[0]},${destination[1]}` +
        `?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry;
        }
    } catch (e) {
        console.error('Error fetching route:', e);
    }

    // Fallback: return a straight line between origin and destination
    return {
        type: 'LineString',
        coordinates: [origin, destination]
    };
}
