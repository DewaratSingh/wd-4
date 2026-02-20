'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, FileText, LayoutDashboard, LogOut } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('municipalUser');
        if (!storedUser) {
            router.push('/signin');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchComplaints(parsedUser);
    }, [router]);

    const fetchComplaints = async (currentUser: any) => {
        try {
            const res = await fetch('http://localhost:3000/api/my-complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: currentUser.latitude,
                    longitude: currentUser.longitude,
                    radius: currentUser.radius
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

    const handleLogout = () => {
        localStorage.removeItem('municipalUser');
        router.push('/signin');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <LayoutDashboard size={24} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Municipal Dashboard</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/dashboard/map')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition text-sm font-medium"
                    >
                        <MapPin size={16} /> View Map
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg transition text-sm font-medium border border-red-600/30"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Active Complaints ({complaints.length})</h1>

                {loading ? (
                    <p>Loading complaints...</p>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-lg">No complaints found within your jurisdiction.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {complaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                onClick={() => router.push(`/dashboard/complaint/${complaint.id}`)}
                                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg hover:border-blue-500 cursor-pointer transition"
                            >
                                <div className="h-48 bg-black relative">
                                    <img src={complaint.image_url} alt="Complaint" className="w-full h-full object-contain" />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </div>
                                    <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded backdrop-blur-sm ${complaint.progress === 'Resolved' ? 'bg-green-600' :
                                        complaint.progress === 'Work in Progress' ? 'bg-yellow-600' :
                                            complaint.progress === 'Closed' ? 'bg-gray-600' : 'bg-red-600'
                                        }`}>
                                        {complaint.progress || 'Pending'}
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="flex items-start gap-2 text-gray-300">
                                        <FileText size={18} className="mt-1 flex-shrink-0 text-blue-400" />
                                        <p className="text-sm">{complaint.notes}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Phone size={18} className="text-green-400" />
                                        <a href={`tel:${complaint.phone}`} className="text-sm hover:underline">{complaint.phone}</a>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 text-xs pt-2 border-t border-gray-700">
                                        <MapPin size={14} />
                                        <span>{complaint.latitude}, {complaint.longitude}</span>
                                        <span className="ml-auto text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded">
                                            {complaint.distanceFromMuni?.toFixed(2)} km away
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
