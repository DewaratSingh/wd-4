"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import ComplaintTrendChart from "./components/ComplaintTrendChart";
import StatusDonutChart from "./components/StatusDonutChart";
import CategoryPanel from "./components/CategoryPanel";
import NeedsAttentionPanel from "./components/NeedsAttentionPanel";
import WardPerformancePanel from "./components/WardPerformancePanel";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 ml-[230px]">
                {/* Header */}
                <DashboardHeader />

                {/* Scrollable body */}
                <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Row 1 — Stats Cards */}
                    <StatsCards stats={stats} />

                    {/* Row 2 — Complaint Trend + Donut Chart */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <ComplaintTrendChart trendData={stats?.trend} />
                        </div>
                        <div>
                            <StatusDonutChart statusCounts={stats?.statusCounts} />
                        </div>
                    </div>

                    {/* Row 3 — By Category | Needs Attention | Ward Performance */}
                    <div className="grid grid-cols-3 gap-4 pb-6">
                        <CategoryPanel />
                        <NeedsAttentionPanel />
                        <WardPerformancePanel />
                    </div>

                </main>
            </div>
        </div>
    );
}
