import { Expand } from "lucide-react";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
}

interface WardMapProps {
    complaints: Complaint[];
}

export default function WardMap({ complaints }: WardMapProps) {
    const router = useRouter();

    // Default center (Mumbai)
    const defaultCenter: [number, number] = [19.0760, 72.8777];

    // Determine center based on first complaint or default
    const mapCenter: [number, number] = complaints.length > 0
        ? [complaints[0].latitude, complaints[0].longitude]
        : defaultCenter;

    // We need to fix the default icon issue in Leaflet with Next.js
    const iconFix = useMemo(() => {
        return (async () => {
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

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Ward Map ({complaints.length} issues)</h3>
                <button
                    onClick={() => router.push('/map')}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                    Expand <Expand className="w-3 h-3" />
                </button>
            </div>

            {/* Map container — overflow-hidden clips the legend badge inside card bounds */}
            <div className="relative flex-1 rounded-xl overflow-hidden" style={{ isolation: 'isolate' }}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
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
                                <div className="text-sm">
                                    <p className="font-bold mb-1">Status: {complaint.progress}</p>
                                    <p>{complaint.notes}</p>
                                    {complaint.image_url && (
                                        <img src={complaint.image_url} alt="Issue" className="w-full h-20 object-cover mt-2 rounded" />
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend — positioned inside overflow-hidden so it stays clipped within card */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 pointer-events-none" style={{ zIndex: 400 }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span className="text-slate-700">Active Issue</span>
                </div>
            </div>
        </div>
    );
}
