import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getColor } from '../../utils/congestion';
import HeatmapLayer from './HeatmapLayer';
import EmergencyRoute from './EmergencyRoute';
import JunctionPopup from './JunctionPopup';

const SOLAPUR_CENTER = { longitude: 75.9073, latitude: 17.6868, zoom: 13 };

export default function CityMap({ junctions, showHeatmap, emergencyRoute, emergencyJunctions }) {
    const [selected, setSelected] = useState(null);

    const pinColor = (junction) => {
        if (emergencyJunctions && emergencyJunctions.includes(junction.id)) {
            return '#22C55E'; // green when on emergency route
        }
        return getColor(junction.congestion_score);
    };

    return (
        <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            initialViewState={SOLAPUR_CENTER}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
        >
            {junctions.map(j => (
                <Marker key={j.id} longitude={j.lng} latitude={j.lat} anchor="center">
                    <div
                        onClick={() => setSelected(j)}
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: pinColor(j),
                            border: '2px solid white',
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                            transition: 'transform 0.2s',
                        }}
                        title={j.name}
                    />
                </Marker>
            ))}

            {selected && (
                <Popup
                    longitude={selected.lng}
                    latitude={selected.lat}
                    onClose={() => setSelected(null)}
                    closeButton={false}
                    offset={12}
                    maxWidth="320px"
                >
                    <JunctionPopup junction={selected} onClose={() => setSelected(null)} />
                </Popup>
            )}

            {showHeatmap && <HeatmapLayer junctions={junctions} />}
            {emergencyRoute && <EmergencyRoute geometry={emergencyRoute} />}
        </Map>
    );
}
