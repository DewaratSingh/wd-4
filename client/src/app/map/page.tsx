'use client';

import React, { useEffect, useState, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Shield, ChevronRight, MapPin, Loader2, RefreshCw } from 'lucide-react';

interface Complaint {
    id: string;
    latitude: number;
    longitude: number;
    notes: string;
    image_url: string;
    progress: string;
    created_at: string;
}

interface PublicMapProps {
    complaints: Complaint[];
    center: { lat: number; lng: number };
}

// Dynamically import Leaflet map to avoid SSR issues
const PublicMapComponent = dynamic<PublicMapProps>(
    () => import('../../components/PublicMapComponent') as Promise<{ default: ComponentType<PublicMapProps> }>,
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-gray-950 text-gray-400">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                Loading Map...
            </div>
        )
    }
);

export default function PublicMapPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        // Get geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setCenter({ lat: 28.6139, lng: 77.2090 })
            );
        } else {
            setCenter({ lat: 28.6139, lng: 77.2090 });
        }
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/all-complaints');
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } catch (err) {
            console.error('Error fetching complaints:', err);
        } finally {
            setLoading(false);
        }
    };

    const statusCounts = {
        Pending: complaints.filter(c => !c.progress || c.progress === 'Pending').length,
        'Work in Progress': complaints.filter(c => c.progress === 'Work in Progress').length,
        Resolved: complaints.filter(c => c.progress === 'Resolved').length,
        Closed: complaints.filter(c => c.progress === 'Closed').length,
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-950">
            {/* Top Navbar */}
            <div className="absolute top-0 left-0 right-0 z-[500] flex items-center justify-between px-5 py-3 backdrop-blur-md bg-gray-950/80 border-b border-white/10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Shield className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
                    <span className="text-white font-bold text-lg tracking-tight">NagarSeva</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-orange-400 bg-orange-400/10 rounded-full border border-orange-400/20">BETA</span>
                </Link>

                {/* Center title */}
                <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-sm hidden sm:block">Live Complaint Map</span>
                </div>

                {/* Right CTAs */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchComplaints}
                        disabled={loading}
                        title="Refresh"
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        href="/user/login"
                        className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 rounded-full transition-all duration-200 shadow-lg shadow-orange-500/25"
                    >
                        Report an Issue
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Map — full screen */}
            <div className="absolute inset-0 pt-[56px]">
                {center ? (
                    <PublicMapComponent complaints={complaints} center={center} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin w-6 h-6 mr-2" />
                        Locating...
                    </div>
                )}
            </div>

            {/* Bottom Status Legend */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md bg-gray-950/80 border border-white/10 shadow-xl">
                {[
                    { label: 'Pending', color: '#dc2626', count: statusCounts['Pending'] },
                    { label: 'In Progress', color: '#ca8a04', count: statusCounts['Work in Progress'] },
                    { label: 'Resolved', color: '#16a34a', count: statusCounts['Resolved'] },
                    { label: 'Closed', color: '#4b5563', count: statusCounts['Closed'] },
                ].map(({ label, color, count }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border-2 border-white/30 flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs text-gray-300 font-medium">{label}</span>
                        <span className="text-xs text-white font-bold bg-white/10 px-1.5 py-0.5 rounded-full">{count}</span>
                    </div>
                ))}
            </div>

            {/* Total badge - top right of map */}
            <div className="absolute top-[68px] right-4 z-[500] px-4 py-2 rounded-xl backdrop-blur-md bg-gray-950/80 border border-white/10 text-white text-sm font-semibold shadow-lg">
                <span className="text-orange-400 font-bold text-lg">{complaints.length}</span>
                <span className="text-gray-400 ml-1 text-xs">complaints</span>
                {lastUpdated && (
                    <div className="text-[10px] text-gray-500 mt-0.5">Updated {lastUpdated}</div>
                )}
            </div>

            {/* Mobile report button */}
            <Link
                href="/user/login"
                className="sm:hidden absolute bottom-20 right-4 z-[500] flex items-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-white bg-orange-500 shadow-xl shadow-orange-500/30"
            >
                <MapPin className="w-4 h-4" />
                Report
            </Link>
        </div>
    );
}
