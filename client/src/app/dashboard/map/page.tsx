"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MapComponent from "../../../components/MapComponent";

export default function MapPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const municipalUser = localStorage.getItem('municipalUser');
        const currentUser = localStorage.getItem('currentUser');

        let activeUser = null;
        let userLocation = null;

        if (municipalUser) {
            const parsed = JSON.parse(municipalUser);
            if (parsed) {
                activeUser = parsed;
                userLocation = {
                    latitude: parsed.latitude || 19.0760,
                    longitude: parsed.longitude || 72.8777,
                    radius: parsed.radius || 10
                };
            }
        } else if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            if (parsedUser) {
                activeUser = {
                    ...parsedUser,
                    name: parsedUser.username
                };

                // Default location (Mumbai)
                userLocation = {
                    latitude: 19.0760,
                    longitude: 72.8777,
                    radius: 10
                };

                // Try to get live location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const liveLocation = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                radius: 10
                            };
                            setUser((prev: any) => prev ? ({ ...prev, ...liveLocation }) : null);
                            fetchComplaints(liveLocation);
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                        }
                    );
                }
            }
        }

        if (activeUser && userLocation) {
            setUser({ ...activeUser, ...userLocation });
            fetchComplaints(userLocation);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchComplaints = async (location: any) => {
        try {
            const res = await fetch('http://localhost:3000/api/my-complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: location.radius
                })
            });
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Complaints Map</h1>
                        <p className="text-sm text-gray-400">
                            {loading ? 'Loading...' : `${complaints.length} complaints in your area`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="h-[calc(100vh-80px)]">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading complaints...</p>
                        </div>
                    </div>
                ) : (
                    <MapComponent
                        complaints={complaints}
                        center={user ? [user.latitude, user.longitude] : [19.0760, 72.8777]}
                    />
                )}
            </div>
        </div>
    );
}
