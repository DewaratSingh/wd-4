"use client";

import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HeroBanner from "./components/HeroBanner";
import QuickActions from "./components/QuickActions";
import StatsBar from "./components/StatsBar";
import ActiveComplaints from "./components/ActiveComplaints";
import WardMap from "./components/WardMap";
import MonthlyOverview from "./components/MonthlyOverview";
import EmergencySection from "./components/EmergencySection";
import QuickServices from "./components/QuickServices";
import IssuesNearYou from "./components/IssuesNearYou";
import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";

export default function CitizenDashboard() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    interface User {
        id?: number;
        name?: string;
        username?: string;
        email?: string;
        municipal_name?: string;
        latitude?: number;
        longitude?: number;
        radius?: number;
    }

    useEffect(() => {
        const municipalUser = localStorage.getItem('municipalUser');
        const currentUser = localStorage.getItem('currentUser');

        let activeUser: User | null = null;
        let userLocation: { latitude: number; longitude: number; radius: number } | null = null;

        const fetchComplaintsWithLoc = async (loc: { latitude: number; longitude: number; radius: number }, u: User) => {
            try {
                let url = 'http://localhost:3000/api/my-complaints';
                let method = 'POST';
                let body: string | undefined = JSON.stringify(loc);

                if (view === 'my-complaints' && u.id) {
                    url = `http://localhost:3000/api/user-complaints/${u.id}`;
                    method = 'GET';
                    body = undefined;
                }

                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: body
                });
                const data = await res.json();
                if (data.success) {
                    setComplaints(data.complaints);
                }
            } catch (error) {
                console.error("Failed to fetch complaints:", error);
            } finally {
                setLoading(false);
            }
        };

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
                    name: parsedUser.username // Map username to name for UI consistency
                };

                // Initial default (Mumbai)
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
                            // Update user state with live location
                            setUser((prev: User | null) => prev ? ({ ...prev, ...liveLocation, municipal_name: 'Current Location' }) : null);

                            // Trigger complaint fetch with new location
                            if (activeUser) {
                                fetchComplaintsWithLoc(liveLocation, activeUser);
                            }
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                        }
                    );
                }
            }
        }

        if (activeUser && userLocation) {
            const initialUser = { ...activeUser, ...userLocation };
            setUser(initialUser);
            fetchComplaintsWithLoc(userLocation, activeUser);
        } else {
            setLoading(false);
        }
    }, [view]);

    // Calculate Stats
    const stats = {
        resolved: complaints.filter(c => c.progress === 'Resolved').length,
        inProgress: complaints.filter(c => c.progress !== 'Resolved' && c.progress !== 'Pending').length,
        newToday: complaints.filter(c => {
            const today = new Date().toDateString();
            const created = new Date(c.created_at).toDateString();
            return today === created;
        }).length
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="max-w-[1600px] mx-auto flex pt-4">
                <Sidebar />

                <main className="flex-1 px-4 lg:px-8 pb-12 overflow-x-hidden">
                    <div className="space-y-6">

                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <HeroBanner user={user} />
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <QuickActions />
                        </motion.div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Left Column (Stats + Complaints) */}
                            <div className="xl:col-span-2 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <StatsBar stats={stats} />
                                </motion.div>



                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <ActiveComplaints complaints={complaints} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.35 }}
                                >
                                    <IssuesNearYou complaints={complaints} radius={user?.radius} />
                                </motion.div>
                            </div>

                            {/* Right Column (Map + Analytics) */}
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="h-[300px]"
                                >
                                    <WardMap complaints={complaints} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="h-[300px]"
                                >
                                    <MonthlyOverview />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <QuickServices />
                                </motion.div>
                            </div>

                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <EmergencySection />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
