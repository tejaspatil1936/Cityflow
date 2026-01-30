import { useState } from 'react';
import { EMERGENCY_ROUTES, getEmergencyRoute } from '../../utils/emergency';

export default function EmergencyPage({ onActivate }) {
    const [selected, setSelected] = useState(null);
    const [active, setActive] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [timeSaved, setTimeSaved] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleActivate() {
        if (!selected) return;
        setLoading(true);
        const route = EMERGENCY_ROUTES[selected];
        try {
            const geometry = await getEmergencyRoute(route.origin, route.destination);
            onActivate(geometry, route.junctions_on_route, route);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        setActive(true);
        setTimeSaved(route.time_saved);

        // Start countdown
        let count = 9;
        setCountdown(count);
        const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(timer);
                setCountdown(0);
            }
        }, 1000);
    }

    function handleClear() {
        setActive(false);
        setSelected(null);
        setCountdown(null);
        setTimeSaved('');
        onActivate(null, [], null);
    }

    return (
        <div className="emergency-page">
            <div className="page-header">
                <h2 className="page-title">Emergency Mode</h2>
                <p className="page-subtitle">Activate priority routing for emergency vehicles</p>
            </div>

            {active ? (
                <div className="emergency-active-panel">
                    <div className="emergency-active-header">
                        <span className="emergency-active-dot" />
                        <span className="emergency-active-label">Emergency Route Active</span>
                    </div>

                    {countdown !== null && countdown > 0 && (
                        <p className="emergency-countdown">
                            Clearing route in <strong>{countdown}s</strong>
                        </p>
                    )}
                    {countdown === 0 && (
                        <p className="emergency-cleared">Route cleared</p>
                    )}

                    <div className="emergency-saved">
                        Estimated time saved: <strong>{timeSaved}</strong>
                    </div>

                    <button className="btn btn-outline" onClick={handleClear}>
                        Deactivate
                    </button>
                </div>
            ) : (
                <div className="emergency-select-panel">
                    <p className="emergency-instructions">
                        Select an emergency scenario to activate priority routing:
                    </p>

                    <div className="emergency-options">
                        {EMERGENCY_ROUTES.map((route, i) => (
                            <div
                                key={i}
                                className={`emergency-option ${selected === i ? 'emergency-option-selected' : ''}`}
                                onClick={() => setSelected(i)}
                            >
                                <div className="emergency-option-label">{route.label}</div>
                                <div className="emergency-option-save">Saves ~{route.time_saved}</div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-danger"
                        onClick={handleActivate}
                        disabled={selected === null || loading}
                    >
                        {loading ? 'Activating...' : 'Activate Emergency Route'}
                    </button>
                </div>
            )}

            <div className="emergency-info-box">
                <strong>How it works:</strong> Activating emergency mode sends a priority signal
                to traffic signals along the route. Signals turn green, reducing travel time
                for the emergency vehicle.
            </div>
        </div>
    );
}
