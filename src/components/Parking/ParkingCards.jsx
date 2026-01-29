export default function ParkingCards({ parking }) {
    return (
        <div className="parking-page">
            <div className="page-header">
                <h2 className="page-title">Parking Zones</h2>
                <p className="page-subtitle">Live availability across Solapur city</p>
            </div>

            <div className="festival-banner">
                Siddheshwar Yatra approaching — expect high demand near Mandir Road parking
            </div>

            <div className="parking-grid">
                {parking.map(zone => {
                    const available = zone.total - zone.occupied;
                    const pct = Math.round((zone.occupied / zone.total) * 100);
                    const isFull = pct >= 90;
                    const isAlmost = pct >= 70 && pct < 90;

                    return (
                        <div key={zone.id} className="parking-card">
                            <div className="parking-card-header">
                                <h3 className="parking-name">{zone.name}</h3>
                                <span className={`zone-tag zone-tag-${zone.zone_type}`}>
                                    {zone.zone_type}
                                </span>
                            </div>

                            <div className="parking-bar-wrap">
                                <div
                                    className="parking-bar"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: isFull ? '#EF4444' : isAlmost ? '#F59E0B' : '#22C55E'
                                    }}
                                />
                            </div>

                            <div className="parking-counts">
                                <span className={`available-text ${isFull ? 'text-red' : ''}`}>
                                    {isFull ? 'Almost Full' : `${available} slots free`}
                                </span>
                                <span className="total-text">{zone.occupied} / {zone.total} occupied</span>
                            </div>

                            {zone.illegal_count > 0 && (
                                <div className="illegal-badge">
                                    {zone.illegal_count} illegal vehicles detected
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
