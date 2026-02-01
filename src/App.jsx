import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { doc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useJunctions } from './hooks/useJunctions';
import { useParking } from './hooks/useParking';
import { runOptimizer } from './utils/congestion';
import CityMap from './components/Map/CityMap';
import StatsBar from './components/Dashboard/StatsBar';
import AlertsFeed from './components/Dashboard/AlertsFeed';
import OptimizerPanel from './components/Signal/OptimizerPanel';
import ParkingCards from './components/Parking/ParkingCards';
import EmergencyPage from './components/Emergency/EmergencyPage';
import './index.css';

const CITIZEN_ALERTS = [
    'Jam reported near Hotgi Naka — auto drivers blocking lane',
    'Illegal parking at Railway Station exit',
    'Pothole near Market Yard causes slowdown',
    'Signal malfunction at Dayanand College Cross',
    'Heavy MSRTC bus traffic at Bus Stand Junction',
];

export default function App() {
    const [tab, setTab] = useState('map');
    const { junctions } = useJunctions();
    const { parking } = useParking();

    const [showHeatmap, setShowHeatmap] = useState(false);
    const [optimizerRunning, setOptimizerRunning] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [alerts, setAlerts] = useState([
        { type: 'info', message: 'CityFlow SMC dashboard started.', time: 'now' },
        { type: 'warning', message: 'Siddheshwar Yatra in 3 days — Traffic Plan Ready', time: 'just now' },
    ]);
    const [co2, setCo2] = useState(142);
    const [emergencyRoute, setEmergencyRoute] = useState(null);
    const [emergencyJunctions, setEmergencyJunctions] = useState([]);

    // CO2 counter — increments every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCo2(prev => +(prev + 0.8).toFixed(1));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Random citizen alert every 45 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const msg = CITIZEN_ALERTS[Math.floor(Math.random() * CITIZEN_ALERTS.length)];
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setAlerts(prev => [...prev, { type: 'citizen', message: msg, time: now }]);
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    // Parking simulator — updates occupied count locally every 10s
    useEffect(() => {
        // We just update UI locally here (Firestore update only if configured)
        const interval = setInterval(async () => {
            try {
                const snap = await getDocs(collection(db, 'parking'));
                if (!snap.empty) {
                    snap.docs.forEach(async (d) => {
                        const data = d.data();
                        const delta = Math.floor(Math.random() * 5) - 2;
                        const newOccupied = Math.max(0, Math.min(data.total, data.occupied + delta));
                        await updateDoc(doc(db, 'parking', d.id), { occupied: newOccupied });
                    });
                }
            } catch (e) {
                // Silent fail if Firestore not configured
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Junction live simulator — updates congestion every 8s
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const snap = await getDocs(collection(db, 'junctions'));
                if (!snap.empty) {
                    snap.docs.forEach(async (d) => {
                        const data = d.data();
                        const delta = Math.floor(Math.random() * 11) - 5;
                        const newScore = Math.max(0, Math.min(100, data.congestion_score + delta));
                        await updateDoc(doc(db, 'junctions', d.id), {
                            congestion_score: newScore,
                            severity: newScore > 70 ? 'high' : newScore > 40 ? 'moderate' : 'low'
                        });
                    });
                }
            } catch (e) {
                // Silent fail
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    function handleRunOptimizer() {
        setOptimizerRunning(true);
        setRecommendations([]);
        setTimeout(() => {
            const results = runOptimizer(junctions);
            setRecommendations(results);
            setOptimizerRunning(false);
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setAlerts(prev => [
                ...prev,
                {
                    type: 'info',
                    message: `Signal optimizer ran — ${results.length} junctions optimized`,
                    time: now
                }
            ]);
        }, 1500);
    }

    async function handleEmergencyActivate(geometry, junctionIds, routeInfo) {
        setEmergencyRoute(geometry);
        setEmergencyJunctions(junctionIds || []);
        if (routeInfo) {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setAlerts(prev => [
                ...prev,
                {
                    type: 'emergency',
                    message: `Emergency route activated: ${routeInfo.label}`,
                    time: now
                }
            ]);
            try {
                await addDoc(collection(db, 'logs'), {
                    type: 'emergency',
                    message: `Emergency route activated — ${routeInfo.label}`,
                    timestamp: new Date(),
                });
            } catch (e) {
                // Silent fail
            }
        }
    }

    return (
        <div className="app">
            {/* Navbar */}
            <nav className="navbar">
                <span className="nav-brand">CityFlow SMC</span>
                <div className="nav-tabs">
                    <button
                        className={`nav-tab ${tab === 'map' ? 'nav-tab-active' : ''}`}
                        onClick={() => setTab('map')}
                    >
                        Map
                    </button>
                    <button
                        className={`nav-tab ${tab === 'parking' ? 'nav-tab-active' : ''}`}
                        onClick={() => setTab('parking')}
                    >
                        Parking
                    </button>
                    <button
                        className={`nav-tab ${tab === 'emergency' ? 'nav-tab-active' : ''}`}
                        onClick={() => setTab('emergency')}
                    >
                        Emergency
                    </button>
                </div>
                <span className="nav-subtitle">Solapur Municipal Corporation</span>
            </nav>

            {/* Stats bar */}
            <StatsBar junctions={junctions} co2={co2} />

            {/* Main content */}
            {tab === 'map' && (
                <div className="map-layout">
                    <div className="map-container">
                        <div className="map-controls">
                            <button
                                className={`btn ${showHeatmap ? 'btn-active' : 'btn-outline'}`}
                                onClick={() => setShowHeatmap(h => !h)}
                            >
                                {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                            </button>
                        </div>
                        <CityMap
                            junctions={junctions}
                            showHeatmap={showHeatmap}
                            emergencyRoute={emergencyRoute}
                            emergencyJunctions={emergencyJunctions}
                        />
                    </div>
                    <div className="side-panel">
                        <OptimizerPanel
                            recommendations={recommendations}
                            onRun={handleRunOptimizer}
                            running={optimizerRunning}
                        />
                        <AlertsFeed alerts={alerts} />
                    </div>
                </div>
            )}

            {tab === 'parking' && (
                <div className="content-page">
                    <ParkingCards parking={parking} />
                </div>
            )}

            {tab === 'emergency' && (
                <div className="content-page">
                    <EmergencyPage onActivate={handleEmergencyActivate} />
                </div>
            )}
        </div>
    );
}
