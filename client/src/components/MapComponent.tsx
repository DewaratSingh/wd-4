"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface Complaint {
    id: number;
    latitude: number;
    longitude: number;
    progress: string;
    notes?: string;
    image_url?: string;
    created_at?: string;
}

interface MapComponentProps {
    complaints: Complaint[];
    center?: [number, number];
    zoom?: number;
    height?: string;
}

export default function MapComponent({ 
    complaints, 
    center, 
    zoom = 13,
    height = '100%'
}: MapComponentProps) {
    // Default center (Mumbai)
    const defaultCenter: [number, number] = [19.0760, 72.8777];

    // Determine center based on prop, first complaint, or default
    const mapCenter: [number, number] = center 
        || (complaints.length > 0 ? [complaints[0].latitude, complaints[0].longitude] : defaultCenter);

    // Fix Leaflet default icon issue with Next.js
    useMemo(() => {
        (async () => {
            if (typeof window !== 'undefined') {
                const L = (await import('leaflet')).default;
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });
            }
        })();
    }, []);

    const getMarkerColor = (progress: string) => {
        switch (progress) {
            case 'Resolved':
                return 'green';
            case 'Work in Progress':
            case 'Accepted':
                return 'yellow';
            case 'Closed':
                return 'gray';
            default:
                return 'red';
        }
    };

    return (
        <div style={{ height, width: '100%' }}>
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {complaints.map((complaint) => (
                    <Marker
                        key={complaint.id}
                        position={[complaint.latitude, complaint.longitude]}
                    >
                        <Popup>
                            <div className="text-sm min-w-[200px]">
                                <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${
                                    complaint.progress === 'Resolved' ? 'bg-green-100 text-green-800' :
                                    complaint.progress === 'Work in Progress' ? 'bg-yellow-100 text-yellow-800' :
                                    complaint.progress === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                                    complaint.progress === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {complaint.progress || 'Pending'}
                                </div>
                                <p className="font-bold mb-1">Complaint #{complaint.id}</p>
                                <p className="text-gray-700 mb-2">{complaint.notes || 'No description'}</p>
                                {complaint.created_at && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </p>
                                )}
                                {complaint.image_url && (
                                    <img 
                                        src={complaint.image_url} 
                                        alt="Issue" 
                                        className="w-full h-32 object-cover mt-2 rounded border border-gray-200" 
                                    />
                                )}
                                <a 
                                    href={`/dashboard/complaint/${complaint.id}`}
                                    className="block mt-2 text-blue-600 hover:underline text-xs font-medium"
                                >
                                    View Details →
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
