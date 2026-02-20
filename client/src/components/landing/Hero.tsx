"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, X, Sparkles, MapPin, Star, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { Navbar } from "./Navbar";

export const Hero = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans bg-slate-50">

            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    src="/assets/hero-video.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                {/* Light overlay — enough for readability, video clearly visible */}
                <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/25 to-white/50" />
                <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/40 to-transparent" />
            </div>

            <Navbar />

            <main className="relative z-10 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen flex flex-col justify-center pt-28 pb-16">

                {/* Main Content */}
                <div className="max-w-4xl">

                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-indigo/8 border border-electric-indigo/20 backdrop-blur-md mb-8 shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vibrant-orange opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-vibrant-orange"></span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-electric-indigo" />
                        <span className="text-xs font-bold text-electric-indigo tracking-wider uppercase">Powering Smart Cities Across India</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-7xl lg:text-[90px] font-black text-slate-900 leading-[1.0] mb-6 tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-vibrant-orange via-[#F59E0B] to-electric-indigo">Fix</span> Your
                        <br />
                        City.{" "}
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-electric-indigo to-cyan-500">One Tap.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.8 }}
                        className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl"
                    >
                        Report broken roads, failed streetlights, and civic issues in seconds. Watch your complaint get resolved — transparently, in real-time.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-wrap items-center gap-4 mb-16"
                    >
                        <button className="group relative h-14 px-8 rounded-full bg-linear-to-r from-vibrant-orange to-[#F59E0B] text-white font-bold text-base shadow-xl shadow-vibrant-orange/25 hover:shadow-vibrant-orange/40 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 overflow-hidden">
                            <MapPin className="w-5 h-5 shrink-0" />
                            Report an Issue Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            {/* Shimmer */}
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-linear-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                        </button>

                        <button
                            onClick={() => setIsVideoOpen(true)}
                            className="group flex items-center gap-3 h-14 px-6 rounded-full border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-800 font-medium hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer text-base shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-full bg-electric-indigo/10 flex items-center justify-center group-hover:bg-electric-indigo/15 transition-colors">
                                <Play className="w-4 h-4 fill-electric-indigo text-electric-indigo ml-0.5" />
                            </div>
                            Watch How It Works
                        </button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5">
                                {[
                                    "from-orange-300 to-orange-400",
                                    "from-indigo-300 to-indigo-400",
                                    "from-emerald-300 to-emerald-400",
                                    "from-pink-300 to-pink-400",
                                    "from-amber-300 to-amber-400",
                                ].map((g, i) => (
                                    <div key={i} className={`w-9 h-9 rounded-full bg-linear-to-br ${g} border-2 border-white flex items-center justify-center shadow-sm`}>
                                        <Users className="w-4 h-4 text-white" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-slate-500">
                                <strong className="text-slate-900 block text-base">50,000+</strong>Active Citizens
                            </div>
                        </div>

                        <div className="w-px h-10 bg-slate-200" />

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="flex gap-0.5 text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <strong className="text-slate-900 text-base">4.8</strong>
                            <span>from 12k+ reviews</span>
                        </div>

                        <div className="w-px h-10 bg-slate-200" />

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <TrendingUp className="w-5 h-5 text-success-emerald" />
                            <div>
                                <strong className="text-slate-900 text-base block">94%</strong>Resolve rate
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Stat Cards — right side (desktop only) */}
                <div className="hidden lg:block">
                    {/* Card 1 — Resolved */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: 40 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
                        className="absolute bottom-32 right-16 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-64"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6 text-success-emerald" />
                        </div>
                        <div>
                            <div className="text-slate-900 font-bold text-base">Issue Resolved!</div>
                            <div className="text-slate-400 text-xs mt-0.5">Pothole on MG Road — 2h ago</div>
                        </div>
                    </motion.div>

                    {/* Card 2 — In Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: 40 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
                        className="absolute bottom-60 right-32 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-60"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 text-electric-indigo" />
                        </div>
                        <div>
                            <div className="text-slate-900 font-bold text-base">In Progress</div>
                            <div className="text-slate-400 text-xs mt-0.5">Street light — Ward 7</div>
                        </div>
                    </motion.div>
                </div>

            </main>

            {/* Video Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <video
                                src="/assets/hero-video.mp4"
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                playsInline
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
