import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import Link from 'next/link';

interface Complaint {
    id: string;
    latitude: number;
    longitude: number;
    notes: string;
    image_url: string;
    progress: string;
    created_at: string;
}

interface PublicMapComponentProps {
    complaints: Complaint[];
    center: { lat: number; lng: number };
}

// Custom Heatmap Layer component
function HeatmapLayer({ complaints }: { complaints: Complaint[] }) {
    const map = useMap();

    useEffect(() => {
        if (!map || complaints.length === 0) return;

        const points: [number, number, number][] = complaints.map(c => [
            Number(c.latitude),
            Number(c.longitude),
            0.5 // intensity
        ]);

        // @ts-ignore - leaflet.heat is not in @types/leaflet
        const heatLayer = L.heatLayer(points, {
            radius: 40,
            blur: 25,
            maxZoom: 17,
            gradient: {
                0.4: 'orange',
                0.8: 'orangered',
                1.0: 'red'
            }
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, complaints]);

    return null;
}

export default function PublicMapComponent({ complaints, center }: PublicMapComponentProps) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const mu = localStorage.getItem('municipalUser');
        if (mu) setIsAdmin(true);
    }, []);

    const getColor = (status: string) => {
        switch (status) {
            case 'Work in Progress': return '#ca8a04';
            case 'Resolved': return '#16a34a';
            case 'Closed': return '#4b5563';
            default: return '#dc2626'; // Pending
        }
    };

    const getStatusLabel = (status: string) => status || 'Pending';

    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {isAdmin && <HeatmapLayer complaints={complaints} />}

            {complaints
                .filter(c => c.latitude && c.longitude)
                .map((complaint) => (
                    <CircleMarker
                        key={complaint.id}
                        center={[Number(complaint.latitude), Number(complaint.longitude)]}
                        radius={isAdmin ? 6 : 10}
                        pathOptions={{
                            color: 'white',
                            weight: 2,
                            fillColor: getColor(complaint.progress),
                            fillOpacity: 1
                        }}
                    >
                        <Popup>
                            <div className="text-sm min-w-[200px] p-1">
                                {complaint.image_url && (
                                    <img
                                        src={complaint.image_url}
                                        alt="Complaint"
                                        className="w-full h-28 object-cover rounded mb-2 shadow-sm border border-gray-100"
                                    />
                                )}
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="inline-block w-3 h-3 rounded-full shadow-sm"
                                        style={{ backgroundColor: getColor(complaint.progress) }}
                                    />
                                    <span className="font-bold text-gray-900">
                                        {getStatusLabel(complaint.progress)}
                                    </span>
                                </div>
                                {complaint.notes && (
                                    <p className="text-gray-600 text-xs mt-1 mb-3 line-clamp-3 leading-relaxed">{complaint.notes}</p>
                                )}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-medium">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </span>
                                    {isAdmin && (
                                        <Link
                                            href={`/dashboard/complaint/${complaint.id}`}
                                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg transition-colors border border-indigo-100"
                                        >
                                            View in Dashboard →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
        </MapContainer>
    );
}
