import { useEffect, useRef } from 'react';

export default function AlertsFeed({ alerts }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [alerts]);

    return (
        <div className="panel">
            <div className="panel-header">
                <h3 className="panel-title">Live Alerts</h3>
                <span className="badge-count">{alerts.length}</span>
            </div>
            <div className="alerts-list">
                {alerts.length === 0 && (
                    <p className="panel-empty">No alerts yet.</p>
                )}
                {alerts.map((alert, i) => (
                    <div key={i} className={`alert-item alert-${alert.type}`}>
                        <div className="alert-dot" />
                        <div className="alert-content">
                            <span className="alert-message">{alert.message}</span>
                            <span className="alert-time">{alert.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
