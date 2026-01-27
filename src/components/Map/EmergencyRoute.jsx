import { Source, Layer } from 'react-map-gl';

export default function EmergencyRoute({ geometry }) {
    if (!geometry) return null;
    return (
        <Source type="geojson" data={{ type: 'Feature', geometry }}>
            <Layer
                type="line"
                paint={{
                    'line-color': '#EF4444',
                    'line-width': 5,
                    'line-dasharray': [2, 1]
                }}
                layout={{
                    'line-join': 'round',
                    'line-cap': 'round'
                }}
            />
        </Source>
    );
}
