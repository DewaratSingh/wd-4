'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet.heat';

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

            <HeatmapLayer complaints={complaints} />

            {complaints.map((complaint) => (
                <CircleMarker
                    key={complaint.id}
                    center={[Number(complaint.latitude), Number(complaint.longitude)]}
                    radius={6} // Smaller markers to let heatmap show
                    pathOptions={{
                        color: 'white',
                        weight: 1,
                        fillColor: getColor(complaint.progress),
                        fillOpacity: 0.8
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
