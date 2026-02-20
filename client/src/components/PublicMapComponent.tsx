'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function PublicMapComponent({ complaints, center }: PublicMapComponentProps) {
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

            {complaints
                .filter(c => c.latitude && c.longitude)
                .map((complaint) => (
                    <CircleMarker
                        key={complaint.id}
                        center={[Number(complaint.latitude), Number(complaint.longitude)]}
                        radius={10}
                        pathOptions={{
                            color: 'white',
                            weight: 2,
                            fillColor: getColor(complaint.progress),
                            fillOpacity: 1
                        }}
                    >
                        <Popup>
                            <div className="text-sm min-w-[180px]">
                                {complaint.image_url && (
                                    <img
                                        src={complaint.image_url}
                                        alt="Complaint"
                                        className="w-full h-28 object-cover rounded mb-2"
                                    />
                                )}
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span
                                        className="inline-block w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: getColor(complaint.progress) }}
                                    />
                                    <span className="font-semibold text-gray-800">
                                        {getStatusLabel(complaint.progress)}
                                    </span>
                                </div>
                                {complaint.notes && (
                                    <p className="text-gray-600 text-xs mt-1 line-clamp-3">{complaint.notes}</p>
                                )}
                                <p className="text-gray-400 text-[10px] mt-1">
                                    {new Date(complaint.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
        </MapContainer>
    );
}
