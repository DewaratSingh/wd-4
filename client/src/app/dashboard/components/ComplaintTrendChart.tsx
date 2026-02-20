"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    ReferenceDot,
} from "recharts";

const data = [
    { date: "Jan 1", resolved: 28, total: 42, spike: null },
    { date: "Jan 5", resolved: 35, total: 50, spike: null },
    { date: "Jan 10", resolved: 40, total: 58, spike: null },
    { date: "Jan 15", resolved: 45, total: 62, spike: 62 },
    { date: "Jan 20", resolved: 50, total: 68, spike: null },
    { date: "Jan 25", resolved: 58, total: 75, spike: 75 },
    { date: "Jan 30", resolved: 65, total: 82, spike: null },
];

type Period = "Day" | "Week" | "Month";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl"
            >
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="capitalize">{p.name}:</span>
                        <span className="font-bold">{p.value}</span>
                    </div>
                ))}
            </motion.div>
        );
    }
    return null;
};

const SpikeDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.spike) return null;
    return (
        <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.8 }}
        >
            <circle cx={cx} cy={cy} r={7} fill="#f97316" stroke="white" strokeWidth={2} />
        </motion.g>
    );
};

export default function ComplaintTrendChart({ trendData }: { trendData: any[] }) {
    const [period, setPeriod] = useState<Period>("Month");

    // Use passed data or fallback to empty array to prevent crash
    const chartData = trendData || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm h-full"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-gray-900 font-bold text-base">Complaint Trend</h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                        Overview of incoming vs resolved complaints (Last 7 Days)
                    </p>
                </div>
                {/* Period selector - hidden for now as backend only returns 7 days */}
                {/* <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">...</div> */}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-8 h-0.5 bg-gray-300 border-t-2 border-dashed border-gray-300" />
                    <span>Resolved</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-6 h-0.5 bg-[#2d3a8c]" />
                    <span>Total Complaints</span>
                </div>
            </div>

            {/* Chart */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={period}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                >
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2d3a8c" stopOpacity={0.12} />
                                    <stop offset="95%" stopColor="#2d3a8c" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="resolved"
                                name="Resolved"
                                stroke="#10b981"
                                strokeWidth={2}
                                strokeDasharray="5 4"
                                fill="url(#resolvedGrad)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                name="Total"
                                stroke="#2d3a8c"
                                strokeWidth={2.5}
                                fill="url(#totalGrad)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: "#2d3a8c" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
