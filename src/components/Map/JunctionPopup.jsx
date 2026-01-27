import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getColor, getLabel } from '../../utils/congestion';

export default function JunctionPopup({ junction, onClose }) {
    const dnaData = junction.traffic_dna.map((val, i) => ({
        hour: `${i + 6}h`,
        congestion: val
    }));

    const color = getColor(junction.congestion_score);
    const label = getLabel(junction.congestion_score);

    return (
        <div className="junction-popup">
            <div className="popup-header">
                <div>
                    <h3 className="popup-title">{junction.name}</h3>
                    <span className="popup-badge" style={{ backgroundColor: color }}>
                        {label} — {junction.congestion_score}%
                    </span>
                </div>
                <button className="popup-close" onClick={onClose}>✕</button>
            </div>

            <p className="popup-note">{junction.note}</p>

            <div className="popup-chart-label">Traffic Pattern (6AM – Midnight)</div>
            <div style={{ height: 120, marginBottom: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dnaData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Congestion']} />
                        <Area
                            type="monotone"
                            dataKey="congestion"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.18}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="popup-info-row">
                <div className="popup-info-item">
                    <span className="info-label">Current Signal</span>
                    <span className="info-value">{junction.signal_green_current}s green</span>
                </div>
                <div className="popup-info-item">
                    <span className="info-label">Recommended</span>
                    <span className="info-value" style={{ color: '#16a34a' }}>
                        {junction.recommended_green}s green
                    </span>
                </div>
            </div>

            {junction.alternate_route && (
                <div className="popup-alternate">
                    <span className="popup-alternate-label">Alternate Route</span>
                    <span>{junction.alternate_route}</span>
                </div>
            )}

            {junction.illegal_parking_nearby && (
                <div className="popup-illegal">Illegal parking detected nearby</div>
            )}
        </div>
    );
}
