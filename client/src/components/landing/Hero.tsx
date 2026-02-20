"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { CityIllustration } from "./CityIllustration";

export const Hero = () => {
    return (
        <div className="relative min-h-screen w-full bg-light-bg overflow-hidden font-sans selection:bg-vibrant-orange/30 selection:text-electric-indigo">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Subtle grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`
                    }}
                />

                {/* Radial Gradients */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-electric-indigo/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-vibrant-orange/5 rounded-full blur-[100px] translate-y-1/4 pointer-events-none" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left: Text Content */}
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-electric-indigo/10 to-transparent border border-electric-indigo/20 mb-8"
                        >
                            <span className="text-xs font-bold text-electric-indigo tracking-wide uppercase">✨ Powering Smart Cities Across India</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-extrabold text-light-text-heading leading-[1.1] mb-6 tracking-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-vibrant-orange to-electric-indigo">Fix</span> Your City.
                            <br />
                            <span className="relative">
                                One Tap at a Time.
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-electric-indigo opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-light-text-body mb-10 leading-relaxed max-w-lg"
                        >
                            Report civic issues, track resolutions in real-time, and watch your neighborhood transform. Because your city deserves better.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="flex flex-wrap items-center gap-4 mb-16"
                        >
                            <Link href="/complaint" className="group relative h-14 px-8 rounded-full bg-linear-to-r from-vibrant-orange to-[#F59E0B] text-white font-bold text-lg shadow-lg shadow-vibrant-orange/25 hover:shadow-vibrant-orange/40 hover:scale-[1.02] transition-all duration-300 flex items-center">
                                <span className="flex items-center gap-2">
                                    📍 Report an Issue Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all pointer-events-none" />
                            </Link>

                            <Link href="#how-it-works" className="group flex items-center gap-3 h-14 px-8 rounded-full border border-slate-200 text-light-text-heading font-medium hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-electric-indigo/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-4 h-4 fill-electric-indigo text-electric-indigo" />
                                </div>
                                Watch How It Works
                            </Link>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="flex items-center gap-6 md:gap-8 pt-8 border-t border-slate-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white relative overflow-hidden ring-1 ring-slate-100">
                                            {/* Placeholder avatars */}
                                            <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-light-text-body">
                                    <strong className="text-light-text-heading block">50,000+</strong> Citizens
                                </div>
                            </div>

                            <div className="w-px h-10 bg-slate-200" />

                            <div className="text-sm text-light-text-body">
                                <strong className="text-light-text-heading flex items-center gap-1">4.8 <span className="text-yellow-400">★★★★★</span></strong> Rating
                            </div>

                            <div className="w-px h-10 bg-slate-200" />

                            <div className="text-sm text-light-text-body">
                                <strong className="text-light-text-heading block">47</strong> Municipal Corps
                            </div>
                        </motion.div>

                    </div>

                    {/* Right: Visual */}
                    <div className="hidden lg:block relative h-full min-h-[600px] w-full">
                        <CityIllustration />
                    </div>

                </div>
            </main>
        </div>
    );
};
