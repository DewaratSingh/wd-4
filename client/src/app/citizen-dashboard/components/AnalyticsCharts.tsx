"use client";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

import { useEffect, useState } from 'react';

export function CategoryDistribution() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/stats/advanced');
            const result = await res.json();
            if (result.success) {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const formatted = result.categoryMetrics.map((c: any, idx: number) => ({
                    name: c.category,
                    value: parseInt(c.volume),
                    color: colors[idx % colors.length]
                }));
                setData(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch category distribution:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('refresh-data', fetchData);
        return () => window.removeEventListener('refresh-data', fetchData);
    }, []);

    if (loading) return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading Categories...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Issue Categories</h3>
            <div className="relative flex-1 min-h-[180px]">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-gray-600 font-semibold truncate">{item.name || 'Other'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ResolutionTrend() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/stats');
            const result = await res.json();
            if (result.success) {
                // API returns { date: 'Mon DD', total, resolved } — NOT day/count
                const trendArr = result.stats?.trend ?? result.trend ?? [];
                const formatted = trendArr.map((d: any) => ({
                    name: d.date,  // backend uses 'date' not 'day'
                    new: parseInt(d.total ?? d.count ?? 0),
                    resolved: parseInt(d.resolved ?? 0)
                })).slice(-7);
                setData(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch resolution trend:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('refresh-data', fetchData);
        return () => window.removeEventListener('refresh-data', fetchData);
    }, []);

    if (loading) return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading Trend...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Resolution Trend</h3>
            <div className="relative flex-1 min-h-[220px]">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                dy={8}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            <Line
                                type="monotone"
                                dataKey="new"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="resolved"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
