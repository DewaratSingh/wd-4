"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Camera, Copy, ThumbsUp, ArrowRight, Bell, Clock, AlertTriangle, MessageSquare, Map as MapIcon, BarChart3, Users, Zap, Check, Lock, Smartphone } from "lucide-react";

export const Features = () => {
    return (
        <section id="features" className="relative py-24 text-slate-900 overflow-hidden" style={{
            backgroundColor: '#f9fbff',
            backgroundImage: `
                linear-gradient(to right, #dde6f5 1px, transparent 1px),
                linear-gradient(to bottom, #dde6f5 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
        }}>
            {/* Top fade — blends with how-it-works above */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white to-transparent z-10" />
            {/* Bottom fade — blends with next section */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white to-transparent z-10" />
            {/* Radial accent — top-right orange glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-orange-100/50 blur-[120px] z-0" />
            {/* Radial accent — bottom-left indigo glow */}
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-indigo-100/60 blur-[100px] z-0" />
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-20">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900"
                    >
                        Everything Your City Needs
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Built for citizens. Optimized for municipalities. Powered by real-time technology.
                    </motion.p>
                </div>

                {/* Feature Block 1: Citizens (Left Text, Right Visual) */}
                <FeatureBlock
                    align="left"
                    category="FOR CITIZENS"
                    categoryColor="text-vibrant-orange"
                    title="Report Any Issue, Anywhere in the City"
                    description="From broken roads to failed street lights — NagarSeva covers 6 issue categories with intelligent geo-tagging that pinpoints exactly where the problem is."
                    features={[
                        "GPS auto-detection with manual pin option",
                        "Photo evidence upload (up to 2 images)",
                        "Duplicate issue detection — no double complaints",
                        "Community upvoting — louder voice together"
                    ]}
                    buttonText="Start Reporting"
                    buttonColor="bg-vibrant-orange hover:bg-orange-600 shadow-lg shadow-orange-200"
                >
                    {/* Visual: Phone Mockup */}
                    <div className="relative w-full h-[500px] bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent opacity-50" />

                        {/* iPhone Frame */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-[280px] h-[480px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20" />

                            {/* Screen Content - Light Mode App */}
                            <div className="w-full h-full bg-slate-50 relative">
                                {/* Map */}
                                <div className="absolute inset-0 bg-slate-200 opacity-50">
                                    <div className="w-full h-full opacity-30"
                                        style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0, y: -50 }}
                                    whileInView={{ scale: 1, y: 0 }}
                                    transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-8 h-8 bg-vibrant-orange rounded-full flex items-center justify-center shadow-lg shadow-vibrant-orange/50 z-10"
                                >
                                    <div className="w-3 h-3 bg-white rounded-full animate-ping absolute" />
                                    <MapPin className="w-4 h-4 text-white relative z-10" />
                                </motion.div>

                                {/* Bottom Sheet */}
                                <motion.div
                                    initial={{ y: "100%" }}
                                    whileInView={{ y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]"
                                >
                                    <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                                    <div className="h-6 w-3/4 bg-slate-100 rounded mb-3" />
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-xl border border-slate-100" />)}
                                    </div>
                                    <div className="h-12 w-full bg-vibrant-orange rounded-xl shadow-md shadow-orange-200" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </FeatureBlock>

                {/* Feature Block 2: Tracking (Right Text, Left Visual) */}
                <FeatureBlock
                    align="right"
                    category="REAL-TIME TRACKING"
                    categoryColor="text-electric-indigo"
                    title="Never Wonder 'What Happened to My Report?'"
                    description="Full transparency from submission to resolution. Watch every status update live with official remarks from municipal officers."
                    features={[
                        "Socket.io live notifications",
                        "Complete status timeline with timestamps",
                        "Priority scoring — urgent issues fast-tracked",
                        "Direct admin remarks visible to citizen"
                    ]}
                >
                    {/* Visual: Status Timeline */}
                    <div className="relative w-full h-[500px] bg-white rounded-2xl border border-slate-200 overflow-hidden p-8 flex flex-col justify-center shadow-sm">
                        <div className="absolute inset-0 bg-linear-to-bl from-indigo-50 to-transparent opacity-50" />

                        <div className="relative z-10 space-y-6 max-w-sm mx-auto">
                            <TimelineItem
                                icon={<Check className="w-4 h-4 text-white" />}
                                title="Submitted"
                                time="10:42 AM"
                                status="completed"
                                delay={0.2}
                            />
                            <TimelineItem
                                icon={<Users className="w-4 h-4 text-white" />}
                                title="Assigned to Ward 4 Team"
                                time="11:15 AM"
                                status="completed"
                                delay={0.8}
                            />
                            <TimelineItem
                                icon={<Clock className="w-4 h-4 text-electric-indigo" />}
                                title="In Progress"
                                time="Work started"
                                status="active"
                                delay={1.4}
                            />

                            {/* Floating Notification Toast */}
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 2 }}
                                className="absolute -right-4 top-10 bg-white border border-slate-100 p-3 rounded-lg shadow-xl flex items-center gap-3 w-64 z-20"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Status Updated</div>
                                    <div className="text-[10px] text-slate-500">Your issue is now In Progress</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </FeatureBlock>

                {/* Feature Block 3: Municipalities (Left Text, Right Visual) */}
                <FeatureBlock
                    align="left"
                    category="FOR MUNICIPALITIES"
                    categoryColor="text-success-emerald"
                    title="Command Your City With Data"
                    description="Admins get a full command center with live maps, heatmaps, priority queues and analytics to make faster, smarter decisions."
                    features={[
                        "Leaflet.js live complaint map + heatmap",
                        "Priority score auto-ranking",
                        "Ward-wise performance analytics",
                        "One-click status updates with audit trail"
                    ]}
                >
                    {/* Visual: Admin Dashboard Mockup */}
                    <div className="relative w-full h-[500px] bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-end justify-center p-4 pb-0 shadow-sm">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-50 to-transparent opacity-50" />

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-[90%] bg-white rounded-t-xl border-t border-x border-slate-200 shadow-2xl overflow-hidden flex"
                        >
                            {/* Sidebar */}
                            <div className="w-16 h-full bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-4">
                                <div className="w-8 h-8 bg-slate-200 rounded-md" />
                                <div className="w-8 h-8 bg-slate-200 rounded-md" />
                                <div className="w-8 h-8 bg-emerald-100 rounded-md border border-emerald-200" />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-4 bg-slate-50/50">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1 h-24 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-full mb-2" />
                                        <div className="w-16 h-2 bg-slate-100 rounded" />
                                    </div>
                                    <div className="flex-1 h-24 bg-white rounded-lg border border-slate-200 shadow-sm" />
                                    <div className="flex-1 h-24 bg-white rounded-lg border border-slate-200 shadow-sm" />
                                </div>
                                <div className="w-full h-full bg-white rounded-lg border border-slate-200 relative overflow-hidden shadow-sm">
                                    {/* Fake Heatmap */}
                                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-400/20 blur-xl rounded-full" />
                                    <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-orange-400/20 blur-xl rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </FeatureBlock>

                {/* Bento Grid - Secondary Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                    <BentoCard
                        icon={<MapIcon className="text-orange-500" />}
                        title="Hotspot Heatmap"
                        desc="Visualize cluster maps to identify problem zones instantly."
                    />
                    <BentoCard
                        icon={<Zap className="text-yellow-500" />}
                        title="Real-Time Updates"
                        desc="Socket.io powered updates without needing to refresh."
                    />
                    <BentoCard
                        icon={<Lock className="text-green-600" />}
                        title="Secure JWT Auth"
                        desc="Role-based access control for Citizens and Admins."
                    />
                    <BentoCard
                        icon={<BarChart3 className="text-blue-500" />}
                        title="Smart Analytics"
                        desc="Resolution trend charts and ward-wise insights."
                    />
                    <BentoCard
                        icon={<MapPin className="text-electric-indigo" />}
                        title="Ward Management"
                        desc="Geographic zone accountability and filtering."
                    />
                    <BentoCard
                        icon={<Smartphone className="text-purple-500" />}
                        title="Mobile First"
                        desc="Responsive design that works seamlessly on any device."
                    />
                </div>

            </div>
        </section>
    );
};

// Reusable Components

const FeatureBlock = ({ align, category, categoryColor, title, description, features, buttonText, buttonColor, children }: any) => {
    return (
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            {/* Text Side */}
            <motion.div
                initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1"
            >
                <span className={`text-sm font-bold tracking-wider uppercase mb-4 block ${categoryColor}`}>{category}</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-slate-900">{title}</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-4 mb-8">
                    {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
                {buttonText && (
                    <button className={`px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105 flex items-center gap-2 ${buttonColor}`}>
                        {buttonText} <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </motion.div>

            {/* Visual Side */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
            >
                {children}
            </motion.div>
        </div>
    );
};

const TimelineItem = ({ icon, title, time, status, delay }: any) => {
    const isCompleted = status === "completed";
    const isActive = status === "active";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex gap-4"
        >
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm z-10 ${isCompleted ? 'bg-indigo-600 border-indigo-600' : isActive ? 'bg-white border-indigo-600' : 'bg-white border-slate-200'}`}>
                    {icon}
                </div>
                <div className={`flex-1 w-0.5 my-2 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            </div>
            <div className="pb-8">
                <h4 className={`font-bold ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{title}</h4>
                <p className="text-sm text-slate-500">{time}</p>
            </div>
        </motion.div>
    )
}

const BentoCard = ({ icon, title, desc }: any) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group"
        >
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-xl font-bold mb-2 text-slate-900">{title}</h4>
            <p className="text-slate-500 text-sm">{desc}</p>
        </motion.div>
    )
}
