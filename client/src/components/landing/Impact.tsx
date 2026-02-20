"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Star, CheckCircle2, BadgeCheck, Building2, ArrowLeft, ArrowRight, MapPin } from "lucide-react";

export const Impact = () => {
    return (
        <section id="impact" className="bg-light-bg text-slate-900 py-24 overflow-hidden relative">

            {/* Subtle grid bg like hero */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: `40px 40px`
                }}
            />

            {/* Soft radial blobs */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-electric-indigo/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-vibrant-orange/5 rounded-full blur-[100px] translate-y-1/4 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

                {/* SECTION LABEL */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-indigo/10 border border-electric-indigo/20 mb-6"
                    >
                        <span className="text-xs font-bold text-electric-indigo tracking-wide uppercase">Impact & Proof</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-light-text-heading tracking-tight"
                    >
                        Cities Are Already Changing
                    </motion.h2>
                </div>

                {/* 1. STAT BLOCKS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    <StatBlock end={124000} suffix="+" label="Issues Reported" subLabel="Across India" />
                    <StatBlock end={89} suffix="%" label="Citizen" subLabel="Satisfaction" />
                    <StatBlock end={4.2} suffix=" Days" label="Avg Resolution" subLabel="Time" isDecimal />
                    <StatBlock end={47} suffix="" label="Cities" subLabel="Onboarded" />
                </div>

                {/* 2. BEFORE / AFTER */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <span className="text-vibrant-orange text-sm font-bold tracking-wider uppercase mb-3 block">Real Results</span>
                        <h3 className="text-3xl md:text-4xl font-bold text-light-text-heading">Real Issues. Real Fixes.</h3>
                        <p className="text-light-text-body mt-3 max-w-xl mx-auto">Hover each card to reveal the resolution.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ComparisonCard title="Pothole" location="Ward 14, Mumbai" time="Fixed in 3 days" beforeIcon="" afterIcon=""
                            beforeBg="from-red-950 to-stone-900" afterBg="from-green-950 to-emerald-900"
                            beforeImage="/assets/impact/pothole-before.svg" afterImage="/assets/impact/pothole-after.svg" />
                        <ComparisonCard title="Street Light" location="Ward 7, Pune" time="Fixed in 2 days" beforeIcon="" afterIcon=""
                            beforeBg="from-slate-900 to-zinc-900" afterBg="from-amber-950 to-yellow-900"
                            beforeImage="/assets/impact/street-light-before.svg" afterImage="/assets/impact/street-light-after.svg" />
                        <ComparisonCard title="Garbage Pickup" location="Ward 3, Delhi" time="Fixed in 1 day" beforeIcon="" afterIcon=""
                            beforeBg="from-stone-900 to-neutral-900" afterBg="from-teal-950 to-green-900"
                            beforeImage="/assets/impact/garbage-before.svg" afterImage="/assets/impact/garbage-after.svg" />
                    </div>
                </div>

                {/* 3. TESTIMONIALS */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <span className="text-electric-indigo text-sm font-bold tracking-wider uppercase mb-3 block">Citizen Stories</span>
                        <h3 className="text-3xl md:text-4xl font-bold text-light-text-heading">Heard From the Community</h3>
                    </div>
                    <TestimonialCarousel />
                </div>

                {/* 4. CITY LOGOS */}
                <div className="border-t border-light-border pt-16">
                    <p className="text-center text-slate-400 mb-10 text-sm uppercase tracking-widest font-medium">
                        Trusted by municipalities across India
                    </p>
                    <div className="w-full overflow-hidden relative">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-light-bg to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-light-bg to-transparent z-10" />
                        <div className="flex gap-4 animate-marquee whitespace-nowrap">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    {["MUMBAI", "PUNE", "DELHI", "BENGALURU", "CHENNAI", "HYDERABAD", "JAIPUR", "AHMEDABAD", "INDORE", "SURAT"].map(city => (
                                        <CityLogo key={city} name={city} />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

// --- stat block ---
const StatBlock = ({ end, suffix, label, subLabel, isDecimal = false }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = end / (duration / stepTime);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, stepTime);
        return () => clearInterval(timer);
    }, [isInView, end]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="text-5xl md:text-6xl font-extrabold text-light-text-heading mb-1 relative inline-block">
                {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
                <span className="text-vibrant-orange">{suffix}</span>
                <div className="h-1 w-full bg-gradient-to-r from-vibrant-orange to-electric-indigo absolute -bottom-1 left-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </div>
            <div className="mt-3 text-light-text-heading font-semibold">{label}</div>
            <div className="text-light-text-body text-sm">{subLabel}</div>
        </motion.div>
    );
};

// --- comparison card ---
const ComparisonCard = ({ title, location, time, beforeIcon, afterIcon, beforeBg, afterBg, beforeImage, afterImage }: any) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="bg-white border border-light-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500"
        >
            <div className="h-56 relative flex overflow-hidden">
                {/* Before */}
                <div
                    className={`h-full relative bg-gradient-to-br ${beforeBg} transition-all duration-700 ease-in-out ${hovered ? 'w-0 opacity-0' : 'w-1/2 opacity-100'}`}
                >
                    {beforeImage ? (
                        <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-60">{beforeIcon}</div>
                    )}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">Before</span>
                </div>
                {/* After */}
                <div
                    className={`h-full relative bg-gradient-to-br ${afterBg} transition-all duration-700 ease-in-out ${hovered ? 'w-full' : 'w-1/2'}`}
                >
                    {afterImage ? (
                        <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">{afterIcon}</div>
                    )}
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">After</span>
                </div>
                {/* Divider */}
                <div className={`absolute top-0 bottom-0 w-0.5 bg-white z-10 transition-all duration-700 ${hovered ? 'left-0 opacity-0' : 'left-1/2 opacity-100'}`} />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-light-text-heading text-lg">{title}</h4>
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 border border-green-200 text-xs font-bold px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                </div>
                <p className="text-light-text-body text-sm flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" />{location}</p>
                <p className="text-vibrant-orange font-bold text-sm">{time}</p>
            </div>
        </motion.div>
    );
};

// --- testimonial carousel ---
const TestimonialCarousel = () => {
    const ref = useRef<HTMLDivElement>(null);
    const scroll = (dir: 'left' | 'right') => {
        if (ref.current) ref.current.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });
    };

    return (
        <div className="relative group">
            <button onClick={() => scroll('left')}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-light-border shadow-md flex items-center justify-center text-slate-600 hover:text-vibrant-orange hover:border-vibrant-orange/30 transition-all opacity-0 group-hover:opacity-100">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-light-border shadow-md flex items-center justify-center text-slate-600 hover:text-vibrant-orange hover:border-vibrant-orange/30 transition-all opacity-0 group-hover:opacity-100">
                <ArrowRight className="w-5 h-5" />
            </button>
            <div ref={ref} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-2"
                style={{ scrollbarWidth: 'none' }}>
                <TestCard quote="I reported a broken footpath near my kids' school. Within 4 days, municipal team fixed it completely. NagarSeva actually works!" name="Priya Sharma" city="Mumbai" initial="P" rating={5} />
                <TestCard quote="The real-time updates are incredible. I watched my complaint go from submitted to resolved with every step notified on my phone." name="Rajesh Kumar" city="Pune" initial="R" rating={5} />
                <TestCard quote="As a ward officer, NagarSeva gives me a clear view of what needs urgent attention. The priority scoring is a game changer." name="Suresh Patil" city="Municipal Officer" initial="S" rating={4} role="officer" />
                <TestCard quote="Finally a system that brings transparency. I can actually see where the municipal budget is being spent in my ward." name="Amit Desai" city="Ahmedabad" initial="A" rating={5} />
            </div>
        </div>
    );
};

const TestCard = ({ quote, name, city, initial, rating, role = "citizen" }: any) => (
    <motion.div whileHover={{ y: -4 }}
        className="min-w-[360px] md:min-w-[420px] bg-white border border-light-border rounded-2xl p-8 snap-center shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-100'}`} />
            ))}
        </div>
        <p className="text-light-text-body text-base leading-relaxed mb-6 italic">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${role === 'officer' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'}`}>
                {initial}
            </div>
            <div>
                <div className="font-bold text-light-text-heading flex items-center gap-1.5 text-sm">
                    {name}
                    {role === 'citizen' ? <BadgeCheck className="w-4 h-4 text-blue-500" /> : <Building2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="text-xs text-light-text-body">{city}</div>
            </div>
        </div>
    </motion.div>
);

const CityLogo = ({ name }: { name: string }) => (
    <div className="inline-flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity px-8 cursor-default">
        <Building2 className="w-5 h-5 text-slate-400" />
        <span className="text-lg font-bold tracking-widest text-slate-400">{name}</span>
    </div>
);
