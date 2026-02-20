"use client";

import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, BarChart2, CheckCircle } from 'lucide-react';

export default function CivicPriorityIndex() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats/advanced');
                const result = await res.json();
                if (result.success) {
                    const metrics = result.categoryMetrics.map((c: any) => {
                        const volume = parseInt(c.volume);
                        const avgUpvotes = parseFloat(c.avg_upvotes);
                        const resolutionRate = parseFloat(c.resolution_rate);
                        // Priority Score formula: Engagement * Volume * (1 - ResolutionRate/100)
                        const priorityScore = (avgUpvotes * volume) * (1 - resolutionRate / 100) + 1;
                        return {
                            category: c.category,
                            volume,
                            avgUpvotes: parseFloat(avgUpvotes.toFixed(1)),
                            resolutionRate: parseFloat(resolutionRate.toFixed(1)),
                            priorityScore: parseFloat(priorityScore.toFixed(1))
                        };
                    });
                    setData(metrics.sort((a: any, b: any) => b.priorityScore - a.priorityScore));
                }
            } catch (err) {
                console.error("Failed to fetch advanced stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading Priority Index...</div>;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">Civic Priority Index</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-tight">Community Engagement vs. Delivery Rate</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-8">
                {/* Bubble Chart */}
                <div className="h-[280px] w-full bg-slate-50/30 rounded-2xl border border-slate-100/50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                            <XAxis
                                type="number"
                                dataKey="volume"
                                name="Volume"
                                label={{ value: 'Report Volume', position: 'bottom', fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="avgUpvotes"
                                name="Avg Upvotes"
                                label={{ value: 'Citizen Support', angle: -90, position: 'left', fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                            />
                            <ZAxis type="number" dataKey="priorityScore" range={[100, 1000]} name="Priority Score" />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            />
                            <Scatter data={data} fill="#6366f1">
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`hsl(${Math.max(0, entry.resolutionRate * 1.2)}, 70%, 50%)`}
                                        opacity={0.8}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Ranking Table */}
                <div className="overflow-hidden border border-slate-100 rounded-2xl flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rank</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Priority Score</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Urgency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((item, idx) => (
                                <motion.tr
                                    key={item.category}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={idx < 3 ? 'bg-orange-50/10' : ''}
                                >
                                    <td className="px-4 py-3">
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-red-100 text-red-600' :
                                                idx === 1 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            #{idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-700 text-sm">{item.category}</td>
                                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 text-sm">{item.priorityScore}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.priorityScore > 50 ? 'bg-red-500' : item.priorityScore > 20 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(item.priorityScore, 100)}%` }}
                                                />
                                            </div>
                                            {idx < 2 && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
