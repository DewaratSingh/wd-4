'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('../../../components/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-500">Loading Map...</div>
});

export default function MapPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('municipalUser');
        if (!storedUser) {
            router.push('/signin');
            return;
        }

        // Get user location for map center
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.error("Loc error", err);
                    // Default fallback (e.g., city center)
                    setUserLocation({ lat: 28.6139, lng: 77.2090 });
                }
            );
        } else {
            setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }

        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            // Reusing existing API (assuming it aligns with what we need or fetching all)
            // Ideally we should have an endpoint for all complaints if not restricted by radius
            // For now, let's try fetching from the same dashboard endpoint logic or a new one
            // Since dashboard uses local state filtring, we might need to fetch all relevant to admin

            // Re-using the logic from dashboard: fetch all by admin's municipality match
            // But since we don't have a direct 'get all' api for the user, let's use the same one
            // Actually dashboard uses `POST /api/my-complaints` with coordinates. 
            // Let's use that one with the current location.

            // Fetch all complaints for the map
            const res = await fetch('http://localhost:3000/api/all-complaints');
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            }

        } catch (err) {
            console.error("Error fetching complaints:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0 ml-[230px]">
                <DashboardHeader title="Live Complaint Map" />
                <main className="flex-1 relative">
                    {/* Map */}
                    {userLocation ? (
                        <MapComponent complaints={complaints} center={userLocation} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 h-full">
                            <Loader className="animate-spin" />
                            <span className="ml-2">Locating...</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 z-[400] bg-white text-black px-4 py-2 rounded shadow-lg text-sm font-bold border border-gray-200">
                        {complaints.length} Complaints Found
                    </div>
                </main>
            </div>
        </div>
    );
}
