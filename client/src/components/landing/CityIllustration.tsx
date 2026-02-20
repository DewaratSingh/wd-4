"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, TrendingUp, Bell } from "lucide-react";

export const CityIllustration = () => {
    return (
        <div className="relative w-full h-[600px] perspective-1000">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-t from-electric-indigo/5 via-transparent to-transparent opacity-50 blur-3xl rounded-full" />

            {/* Isometric City Grid Container */}
            <div
                className="absolute inset-0 flex items-center justify-center transform preserve-3d"
                style={{
                    transform: "rotateX(60deg) rotateZ(45deg) scale(0.9)",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* City Base Grid */}
                <div className="w-[600px] h-[600px] grid grid-cols-6 grid-rows-6 gap-8 relative">
                    {/* Render Buildings */}
                    {Array.from({ length: 18 }).map((_, i) => {
                        const height = Math.random() * 100 + 40; // Random building heights
                        const delay = Math.random() * 2;
                        const x = Math.floor(i / 6);
                        const y = i % 6;

                        return (
                            <motion.div
                                key={i}
                                initial={{ scaleZ: 0, opacity: 0 }}
                                animate={{ scaleZ: 1, opacity: 1 }}
                                transition={{
                                    duration: 1.5,
                                    delay: delay * 0.2,
                                    type: "spring",
                                    damping: 12,
                                }}
                                className={`relative w-16 h-16 bg-white border border-slate-200 shadow-xl group hover:border-vibrant-orange/50 transition-colors duration-300`}
                                style={{
                                    transformStyle: "preserve-3d",
                                    transform: `translateZ(0px)`,
                                }}
                            >
                                {/* Building styling: Walls */}
                                <div
                                    className="absolute inset-0 bg-slate-50 border border-slate-200"
                                    style={{
                                        transform: `translateZ(${height}px)`,
                                    }}
                                />
                                <div
                                    className="absolute inset-0 bg-linear-to-t from-slate-200/50 to-transparent"
                                    style={{
                                        transform: `translateZ(${height / 2}px) rotateX(-90deg) translateY(50%)`,
                                        height: `${height}px`,
                                        width: "100%",
                                        top: `-${height / 2}px`,
                                    }}
                                />
                                <div
                                    className="absolute inset-0 bg-linear-to-t from-slate-300/50 to-transparent"
                                    style={{
                                        transform: `translateZ(${height / 2}px) rotateY(90deg) translateX(50%)`,
                                        height: `${height}px`,
                                        width: "100%",
                                        right: `-${height / 2}px`,
                                    }}
                                />

                                {/* Windows (Dots) */}
                                <div className="absolute inset-x-2 top-2 bottom-2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-300 via-transparent to-transparent bg-size-[4px_4px]"
                                    style={{ transform: `translateZ(${height}px)` }}
                                />

                                {/* Floating Markers */}
                                {i % 5 === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, y: 0 }}
                                        animate={{ opacity: 1, scale: 1, y: -20 }}
                                        transition={{ delay: delay + 1, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-vibrant-orange flex items-center justify-center shadow-lg shadow-vibrant-orange/30 z-20"
                                        style={{ transform: `translateZ(${height + 30}px) rotateX(-60deg) rotateZ(-45deg)` }} // Counter-rotate to face camera
                                    >
                                        <Bell className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}
                                {i % 7 === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: delay + 1.5, duration: 0.5 }}
                                        className="absolute top-0 right-0 w-5 h-5 rounded-full bg-success-emerald flex items-center justify-center shadow-lg shadow-success-emerald/30 z-20"
                                        style={{ transform: `translateZ(${height + 20}px) rotateX(-60deg) rotateZ(-45deg)` }}
                                    >
                                        <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}

                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Floating UI Cards (Overlaying the scene) */}
            {/* Top Left - Issue Resolved */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute top-20 left-0 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 w-64 shadow-xl z-30"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-success-emerald/10 flex items-center justify-center border border-success-emerald/20">
                        <Check className="w-4 h-4 text-success-emerald" />
                    </div>
                    <div>
                        <h3 className="text-light-text-heading font-semibold text-sm">Issue Resolved!</h3>
                        <p className="text-xs text-light-text-body">Pothole on MG Road fixed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-success-emerald font-medium">
                    <div className="w-2 h-2 rounded-full bg-success-emerald animate-pulse" />
                    2.4 days resolution time
                </div>
            </motion.div>

            {/* Bottom Right - Live Stats */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-20 right-0 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 w-56 shadow-xl z-30"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-light-text-body font-medium">Live Stats</span>
                    <span className="text-xs text-electric-indigo bg-electric-indigo/10 px-2 py-0.5 rounded-full">+12%</span>
                </div>
                <div className="text-2xl font-bold text-light-text-heading mb-1">342</div>
                <div className="text-xs text-light-text-body flex items-center gap-1">
                    Issues resolved this month
                    <TrendingUp className="w-3 h-3 text-success-emerald" />
                </div>
            </motion.div>

            {/* Top Right - Notification */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute top-10 right-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg p-3 flex items-center gap-3 shadow-2xl z-30 max-w-[250px]"
            >
                <div className="relative">
                    <Bell className="w-5 h-5 text-vibrant-orange" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
                </div>
                <div>
                    <div className="text-xs font-semibold text-light-text-heading">New Report</div>
                    <div className="text-[10px] text-light-text-body">Street light out — Ward 7</div>
                </div>
            </motion.div>

            {/* Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-electric-indigo/50 rounded-full"
                    initial={{ opacity: 0, y: "100%", x: Math.random() * 100 + "%" }}
                    animate={{ opacity: [0, 1, 0], y: "0%" }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                />
            ))}

        </div>
    );
};
