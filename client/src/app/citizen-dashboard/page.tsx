"use client";

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

export default function CitizenDashboard() {
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
                                    <StatsBar />
                                </motion.div>



                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <ActiveComplaints />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.35 }}
                                >
                                    <IssuesNearYou />
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
                                    <WardMap />
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
