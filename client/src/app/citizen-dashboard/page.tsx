"use client";

import React, { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import QuickActions from "./components/QuickActions";
import StatsBar from "./components/StatsBar";
import ActiveComplaints from "./components/ActiveComplaints";
import WardMap from "./components/WardMap";
import ActivityHeatmap from "./components/ActivityHeatmap";
import { CategoryDistribution, ResolutionTrend } from "./components/AnalyticsCharts";
import EmergencySection from "./components/EmergencySection";
import QuickServices from "./components/QuickServices";
import IssuesNearYou from "./components/IssuesNearYou";
import CommunityPriority from "./components/CommunityPriority";
import WeatherCard from "./components/WeatherCard";
import { motion } from "framer-motion";
export default function CitizenDashboard() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/all-complaints');
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
        window.addEventListener('refresh-data', fetchComplaints);
        return () => window.removeEventListener('refresh-data', fetchComplaints);
    }, []);

    return (
        <div className="space-y-6">

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <HeroBanner />
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
                        <StatsBar stats={{
                            resolved: complaints.filter(c => c.progress === 'Resolved').length,
                            inProgress: complaints.filter(c => c.progress === 'Work in Progress' || c.progress === 'Accepted').length,
                            newToday: complaints.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length
                        }} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <ActiveComplaints />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                            className="h-[350px]"
                        >
                            <ActivityHeatmap />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="h-[350px]"
                        >
                            <ResolutionTrend />
                        </motion.div>
                    </div>
                </div>

                {/* Right Column (Map + Analytics) */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="h-[420px]"
                    >
                        <WardMap complaints={complaints} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                    >
                        <WeatherCard />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="h-[350px]"
                    >
                        <CategoryDistribution />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                    >
                        <CommunityPriority />
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
                transition={{ duration: 0.4, delay: 0.45 }}
            >
                <IssuesNearYou complaints={complaints} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
            >
                <EmergencySection />
            </motion.div>
        </div>
    );
}
