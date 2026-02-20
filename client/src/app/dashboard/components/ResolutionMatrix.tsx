"use client";

import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis,
    Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { Clock, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResolutionMatrix() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats/advanced');
                const result = await res.json();
                if (result.success) {
                    // Combine volume data with efficiency data
                    const combined = result.categoryMetrics.map((c: any) => {
                        const efficiency = result.departmentEfficiency.find((e: any) => e.category === c.category);
                        return {
                            category: c.category,
                            volume: parseInt(c.volume),
                            avgResolutionHours: efficiency ? parseFloat(efficiency.avg_resolution_hours.toFixed(1)) : 0,
                            resolutionRate: parseFloat(c.resolution_rate).toFixed(1)
                        };
                    });
                    setData(combined);
                }
            } catch (err) {
                console.error("Failed to fetch advanced stats for matrix:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        window.addEventListener('refresh-data', fetchData);
        return () => window.removeEventListener('refresh-data', fetchData);
    }, []);

    const getQuadrant = (hours: number, volume: number) => {
        const avgVolume = 5; // Simplified thresholds
        const avgHours = 24;
        if (volume >= avgVolume && hours <= avgHours) return { label: 'High Performance', color: '#10b981' };
        if (volume >= avgVolume && hours > avgHours) return { label: 'Needs Resources', color: '#ef4444' };
        if (volume < avgVolume && hours <= avgHours) return { label: 'Efficient', color: '#3b82f6' };
        return { label: 'Investigate', color: '#f59e0b' };
    };

    if (loading) return <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading Efficiency Matrix...</div>;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">Resolution Matrix</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-tight">Time vs. Volume Benchmarking</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="h-[280px] w-full relative">
                    {/* Quadrant Labels Overlay */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-[0.03] p-10">
                        <div className="border-r border-b border-slate-900 bg-blue-500 flex items-center justify-center font-black text-4xl">EFFICIENT</div>
                        <div className="border-b border-slate-900 bg-emerald-500 flex items-center justify-center font-black text-4xl">ELITE</div>
                        <div className="border-r border-slate-900 bg-amber-500 flex items-center justify-center font-black text-4xl">SLOW</div>
                        <div className="bg-red-500 flex items-center justify-center font-black text-4xl">BOTTLENECK</div>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                            <XAxis
                                type="number"
                                dataKey="avgResolutionHours"
                                name="Avg Time"
                                unit="h"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                label={{ value: 'Resolution Time (Hours)', position: 'bottom', fontSize: 10, fill: '#94a3b8' }}
                            />
                            <YAxis
                                type="number"
                                dataKey="volume"
                                name="Volume"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                label={{ value: 'Report Volume', angle: -90, position: 'left', fontSize: 10, fill: '#94a3b8' }}
                            />
                            <ZAxis type="number" range={[100, 400]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            />
                            <ReferenceLine x={24} stroke="#e2e8f0" strokeDasharray="3 3" />
                            <ReferenceLine y={5} stroke="#e2e8f0" strokeDasharray="3 3" />
                            <Scatter data={data}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getQuadrant(entry.avgResolutionHours, entry.volume).color}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend/Summary */}
                <div className="grid grid-cols-2 gap-3 pb-2">
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <Zap size={14} className="text-emerald-600" />
                        <div>
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Fastest</p>
                            <p className="text-sm font-black text-emerald-900">
                                {data.reduce((prev, curr) => (prev.avgResolutionHours < curr.avgResolutionHours && prev.avgResolutionHours > 0 ? prev : curr), data[0] || {}).category || 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100">
                        <AlertCircle size={14} className="text-red-600" />
                        <div>
                            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider">Bottleneck</p>
                            <p className="text-sm font-black text-red-900">
                                {data.reduce((prev, curr) => (prev.avgResolutionHours > curr.avgResolutionHours ? prev : curr), data[0] || {}).category || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
