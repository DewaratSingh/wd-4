"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, MapPin, Zap, Radio, BarChart3, MessageCircle, Star, Image, Repeat } from "lucide-react";

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="relative py-24 overflow-hidden" style={{
            backgroundColor: '#f9fbff',
            backgroundImage: `
                linear-gradient(to right, #dde6f5 1px, transparent 1px),
                linear-gradient(to bottom, #dde6f5 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
        }}>
            {/* Top fade — blends with hero above */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white to-transparent z-10" />
            {/* Bottom fade — blends with next section */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white to-transparent z-10" />
            {/* Radial accent — top-left indigo glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-indigo-100/60 blur-[120px] z-0" />
            {/* Radial accent — bottom-right orange glow */}
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-[100px] z-0" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-4"
                    >
                        <span className="text-sm font-bold text-vibrant-orange tracking-[0.2em] uppercase">Simple as 1-2-3</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900"
                    >
                        <span className="text-slate-900">Report.</span> <span className="text-electric-indigo">Track.</span> <span className="text-success-emerald">Resolved.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        From tap to fix in days, not months.
                    </motion.p>
                </div>

                {/* Steps Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
                    {/* Connecting Arrows (Desktop Only) */}
                    <div className="hidden lg:block absolute top-1/3 left-[28%] w-[10%] h-12 z-0 pointer-events-none">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M0,20 Q50,-20 100,20" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="8 8" />
                            <motion.circle
                                r="4"
                                fill="#FF6B35"
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{ offsetPath: "path('M0,20 Q50,-20 100,20')" }}
                            />
                        </svg>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-xs font-bold text-vibrant-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                            Instant
                        </div>
                    </div>

                    <div className="hidden lg:block absolute top-1/3 right-[28%] w-[10%] h-12 z-0 pointer-events-none">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M0,20 Q50,60 100,20" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="8 8" />
                            <motion.circle
                                r="4"
                                fill="#4F46E5"
                                initial={{ offsetDistance: "0%" }}
                                animate={{ offsetDistance: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                                style={{ offsetPath: "path('M0,20 Q50,60 100,20')" }}
                            />
                        </svg>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-xs font-bold text-electric-indigo bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            Transparent
                        </div>
                    </div>


                    {/* Step 1: Report */}
                    <StepCard
                        number="01"
                        title="Snap. Pin. Submit."
                        description="Open NagarSeva, select your issue category, drop a GPS pin, add a photo and submit in under 60 seconds."
                        chips={["📸 Photo Upload", "🛰️ Auto GPS", "⚡ 60 sec submit"]}
                        color="orange"
                        delay={0.2}
                    >
                        <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            {/* Mockup Content */}
                            <div className="absolute top-4 left-4 right-4 h-8 bg-white rounded-md shadow-xs animate-pulse" />
                            <div className="absolute top-16 left-4 right-4 bottom-24 bg-white rounded-md shadow-xs flex items-center justify-center border border-dashed border-slate-300">
                                <Camera className="w-8 h-8 text-slate-300" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-vibrant-orange rounded-full flex items-center justify-center shadow-lg shadow-vibrant-orange/30 z-10"
                            >
                                <MapPin className="w-6 h-6 text-white" />
                            </motion.div>
                        </div>
                    </StepCard>

                    {/* Step 2: Track */}
                    <StepCard
                        number="02"
                        title="Watch It Move."
                        description="Real-time notifications keep you updated as your complaint moves from Submitted → Assigned → Resolved."
                        chips={["🔴 Live Updates", "📊 Priority Score", "💬 Official Remarks"]}
                        color="indigo"
                        delay={0.4}
                    >
                        <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 p-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.5, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-3 rounded-lg shadow-xs border border-slate-100 flex items-center gap-3"
                                >
                                    <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-blue-500' : 'bg-green-500'}`} />
                                    <div className="h-2 bg-slate-100 rounded w-2/3" />
                                </motion.div>
                            ))}
                            <div className="absolute bottom-4 right-4">
                                <div className="text-[10px] font-bold text-electric-indigo bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                                    <Radio className="w-3 h-3" /> Live Tracking
                                </div>
                            </div>
                        </div>
                    </StepCard>

                    {/* Step 3: Resolved */}
                    <StepCard
                        number="03"
                        title="Your City, Fixed."
                        description="Municipal teams get work done. Rate the resolution, verify with photos, and help improve your city further."
                        chips={["⭐ Rate Resolution", "📸 Before/After", "🔄 Follow Up"]}
                        color="emerald"
                        delay={0.6}
                    >
                        <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.8 }}
                                className="w-16 h-16 rounded-full bg-success-emerald flex items-center justify-center shadow-xl shadow-success-emerald/30 z-10"
                            >
                                <motion.svg
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8 text-white"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 1 }}
                                >
                                    <motion.path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 6L9 17l-5-5"
                                    />
                                </motion.svg>
                            </motion.div>

                            {/* Confetti particles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }}
                                    transition={{ duration: 1, delay: 1.2 + Math.random() * 0.5 }}
                                />
                            ))}
                        </div>
                    </StepCard>

                </div>

                {/* Bottom Stats Bar */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12">
                    <StatItem label="To submit" value="60" suffix=" sec" color="text-vibrant-orange" />
                    <StatItem label="Avg resolve time" value="4.2" suffix=" days" color="text-electric-indigo" />
                    <StatItem label="Resolution rate" value="73" suffix="%" color="text-success-emerald" />
                    <StatItem label="Citizens served" value="50" suffix="k+" color="text-slate-900" />
                </div>

            </div>
        </section>
    );
};

const StepCard = ({ number, title, description, chips, children, color, delay }: any) => {
    const borderColor = color === 'orange' ? 'group-hover:border-vibrant-orange/40' : color === 'indigo' ? 'group-hover:border-electric-indigo/40' : 'group-hover:border-success-emerald/40';
    const numBg = color === 'orange'
        ? 'bg-gradient-to-br from-orange-400 to-orange-500'
        : color === 'indigo'
            ? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
            : 'bg-gradient-to-br from-emerald-400 to-emerald-600';
    const numShadow = color === 'orange' ? 'shadow-orange-200' : color === 'indigo' ? 'shadow-indigo-200' : 'shadow-emerald-200';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className={`group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col ${borderColor}`}
        >
            {/* Step Number Badge */}
            <div className={`absolute top-6 right-6 w-12 h-12 rounded-2xl ${numBg} shadow-lg ${numShadow} flex items-center justify-center select-none z-10`}>
                <span className="text-white font-black text-sm tracking-wider">{number}</span>
            </div>

            {/* Visual Area */}
            <div className="relative h-48 w-full mb-8 z-10">
                {children}
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 pr-10">{title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-1">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {chips.map((chip: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                            {chip}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const StatItem = ({ label, value, suffix, color }: any) => {
    return (
        <div className="text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`text-4xl md:text-5xl font-black mb-2 ${color}`}
            >
                <CountUp end={parseFloat(value)} duration={2} />{suffix}
            </motion.div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{label}</div>
        </div>
    )
}

// Simple CountUp Component
const CountUp = ({ end, duration }: { end: number, duration: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    React.useEffect(() => {
        if (isInView && ref.current) {
            let start = 0;
            const stepTime = Math.abs(Math.floor(duration * 1000 / end));
            const timer = setInterval(() => {
                start += 1; // Simplified for integer increments, logic can be complex for floats like 4.2
                // For float support like 4.2
                if (end % 1 !== 0) {
                    ref.current!.textContent = (start / 10).toFixed(1); // Rough approx for 4.2 -> 42/10
                    if (start / 10 >= end) clearInterval(timer);
                } else {
                    ref.current!.textContent = start.toString();
                    if (start >= end) clearInterval(timer);
                }
            }, stepTime < 10 ? 10 : stepTime); // Cap speed

            // Just set exact value for ease in this generated code without heavy libs
            if (ref.current) ref.current.textContent = end.toString();
        }
    }, [isInView, end, duration]);

    return <span ref={ref}>0</span>
}
