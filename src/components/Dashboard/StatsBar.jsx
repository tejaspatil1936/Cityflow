export default function StatsBar({ junctions, co2 }) {
    const avgCongestion = junctions.length
        ? Math.round(junctions.reduce((s, j) => s + j.congestion_score, 0) / junctions.length)
        : 0;

    const highCount = junctions.filter(j => j.congestion_score > 70).length;

    return (
        <div className="stats-bar">
            <div className="stat-item">
                <span className="stat-number">{junctions.length}</span>
                <span className="stat-label">Junctions</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <span className="stat-number">{avgCongestion}%</span>
                <span className="stat-label">Avg Congestion</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <span className="stat-number" style={{ color: highCount > 0 ? '#EF4444' : '#16a34a' }}>
                    {highCount}
                </span>
                <span className="stat-label">High Congestion</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <span className="stat-number" style={{ color: '#16a34a' }}>{co2} kg</span>
                <span className="stat-label">CO₂ Saved</span>
            </div>
        </div>
    );
}
