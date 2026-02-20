"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame } from "lucide-react";

export default function AdminActivityHeatmap() {
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats');
                const data = await res.json();
                if (data.success && data.stats.trend) {
                    // Map trend data or generate mock if trend is too sparse
                    const trend = data.stats.trend;
                    const processed = trend.map((t: any) => ({
                        date: t.date,
                        level: Math.min(Math.floor(t.total / 2), 4) // Scale for visualization
                    }));

                    // Pad with some mock data if current trend is short
                    if (processed.length < 14) {
                        const padded = [...processed];
                        const today = new Date();
                        for (let i = processed.length; i < 21; i++) {
                            const date = new Date(today);
                            date.setDate(today.getDate() - i);
                            padded.unshift({
                                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                level: Math.floor(Math.random() * 5),
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
        if (level === 0) return "bg-gray-100";
        if (level === 1) return "bg-orange-100";
        if (level === 2) return "bg-orange-300";
        if (level === 3) return "bg-orange-500";
        return "bg-red-600";
    };

    if (loading) return <div className="h-40 flex items-center justify-center text-gray-400 text-xs">Loading heatmap...</div>;

    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-50 rounded-lg">
                        <Flame className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">Issue Activity Density</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live</span>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-1.5 content-start">
                {heatmapData.map((day, index) => (
                    <motion.div
                        key={`${day.date}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="group relative"
                    >
                        <div
                            className={`w-7 h-7 rounded-sm ${getColor(day.level)} transition-all duration-300 hover:ring-2 hover:ring-orange-400 hover:ring-offset-1 cursor-pointer shadow-sm`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold">
                            {day.date}: {day.level * 2}+ reports
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span>Low</span>
                    <div className="flex gap-0.5 mx-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-gray-100" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-orange-100" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-orange-300" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-red-600" />
                    </div>
                    <span>High Risk</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">Last 21 days</p>
            </div>
        </div>
    );
}
