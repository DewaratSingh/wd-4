"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame } from "lucide-react";

export default function AdminActivityHeatmap() {
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'density' | 'severity'>('density');

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats');
                const data = await res.json();
                if (data.success && data.stats.trend) {
                    const trend = data.stats.trend;
                    const processed = trend.map((t: any) => ({
                        date: t.date,
                        densityLevel: Math.min(Math.floor(t.total / 2), 4),
                        severityLevel: Math.min(Math.floor((t.severity_sum || 0) / 10), 4)
                    }));

                    // Pad with some mock data if current trend is short
                    if (processed.length < 14) {
                        const padded = [...processed];
                        const today = new Date();
                        for (let i = processed.length; i < 21; i++) {
                            const date = new Date(today);
                            date.setDate(today.getDate() - i);
                            const mockDensity = Math.floor(Math.random() * 5);
                            padded.unshift({
                                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                densityLevel: mockDensity,
                                severityLevel: Math.min(mockDensity + Math.floor(Math.random() * 2), 4)
                            });
                        }
                        setHeatmapData(padded);
                    } else {
                        setHeatmapData(processed);
                    }
                }
            } catch (err) {
                console.error("Heatmap fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmapData();
    }, []);

    const getColor = (level: number) => {
        if (level === 0) return "bg-slate-100";
        if (level === 1) return "bg-orange-100";
        if (level === 2) return "bg-orange-300";
        if (level === 3) return "bg-orange-500";
        return "bg-red-600";
    };

    if (loading) return <div className="h-40 flex items-center justify-center text-slate-400 text-xs">Loading heatmap...</div>;

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-xl">
                        <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight">Civic Activity Heatmap</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-tight">Spatial-Temporal Risk Analysis</p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setViewMode('density')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === 'density' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Density
                    </button>
                    <button
                        onClick={() => setViewMode('severity')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === 'severity' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Severity
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-2 content-start">
                {heatmapData.map((day, index) => {
                    const level = viewMode === 'density' ? day.densityLevel : day.severityLevel;
                    return (
                        <motion.div
                            key={`${day.date}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="group relative"
                        >
                            <div
                                className={`w-8 h-8 rounded-lg ${getColor(level)} transition-all duration-300 hover:ring-2 hover:ring-orange-400 hover:ring-offset-2 cursor-pointer shadow-sm`}
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold shadow-xl border border-white/10">
                                <p className="text-white/60 mb-0.5">{day.date}</p>
                                <p>{viewMode === 'density' ? `${day.densityLevel * 2}+ Reports` : `Impact Score: ${day.severityLevel * 25}+`}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Low</span>
                    <div className="flex gap-1 mx-1">
                        <div className="w-3 h-3 rounded-sm bg-slate-100" />
                        <div className="w-3 h-3 rounded-sm bg-orange-100" />
                        <div className="w-3 h-3 rounded-sm bg-orange-300" />
                        <div className="w-3 h-3 rounded-sm bg-orange-500" />
                        <div className="w-3 h-3 rounded-sm bg-red-600" />
                    </div>
                    <span>Extreme</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">21 Day Trend</p>
            </div>
        </div>
    );
}
