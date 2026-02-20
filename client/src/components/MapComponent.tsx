'use client';

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';

interface Complaint {
    id: string;
    latitude: number;
    longitude: number;
    notes: string;
    image_url: string;
    progress: string;
}

interface MapComponentProps {
    complaints: Complaint[];
    center: { lat: number; lng: number };
}

export default function MapComponent({ complaints, center }: MapComponentProps) {
    const router = useRouter();

    const getColor = (status: string) => {
        switch (status) {
            case 'Work in Progress': return '#ca8a04'; // Yellow-600
            case 'Resolved': return '#16a34a'; // Green-600
            case 'Closed': return '#4b5563'; // Gray-600
            default: return '#dc2626'; // Red-600 (Pending or null)
        }
    };

    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {complaints.map((complaint) => (
                <CircleMarker
                    key={complaint.id}
                    center={[Number(complaint.latitude), Number(complaint.longitude)]}
                    radius={10} // Fixed size marker
                    pathOptions={{
                        color: 'white', // White border for visibility
                        weight: 2,
                        fillColor: getColor(complaint.progress),
                        fillOpacity: 1
                    }}
                    eventHandlers={{
                        click: () => {
                            router.push(`/dashboard/complaint/${complaint.id}`);
                        },
                    }}
                />
            ))}
        </MapContainer>
    );
}
