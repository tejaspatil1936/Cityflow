import { Source, Layer } from 'react-map-gl';

export default function HeatmapLayer({ junctions }) {
    const geojson = {
        type: 'FeatureCollection',
        features: junctions.map(j => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [j.lng, j.lat] },
            properties: { weight: j.congestion_score / 100 }
        }))
    };

    return (
        <Source type="geojson" data={geojson}>
            <Layer
                type="heatmap"
                paint={{
                    'heatmap-weight': ['get', 'weight'],
                    'heatmap-intensity': 1.5,
                    'heatmap-radius': 45,
                    'heatmap-opacity': 0.7,
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(0,0,0,0)',
                        0.2, 'rgba(0,200,80,0.5)',
                        0.5, 'rgba(255,180,0,0.65)',
                        0.8, 'rgba(255,80,0,0.75)',
                        1, 'rgba(220,0,0,0.9)'
                    ]
                }}
            />
        </Source>
    );
}
