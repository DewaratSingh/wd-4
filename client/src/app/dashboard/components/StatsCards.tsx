"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
} from "lucide-react";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { label: string; positive: boolean } | null;
    badge?: string | null;
    badgeColor?: string;
    accentBg: string;
    accentText: string;
    icon: React.ReactNode;
    iconBg: string;
    extra?: React.ReactNode;
    index: number;
    accentBar: string;
}

function StatCard({
    title,
    value,
    subtitle,
    trend,
    badge,
    badgeColor,
    accentText,
    accentBar,
    icon,
    iconBg,
    extra,
    index,
}: StatCardProps) {
    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
            className="bg-white rounded-xl p-5 flex flex-col gap-3 border border-gray-100 relative overflow-hidden cursor-pointer"
        >
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar} rounded-l-xl`} />

            <div className="flex items-start justify-between pl-1">
                <div>
                    <p className={`text-xs font-semibold tracking-wide uppercase ${accentText}`}>
                        {title}
                    </p>
                    <motion.h2
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        className="text-3xl font-bold text-gray-900 mt-1 leading-none"
                    >
                        {value}
                    </motion.h2>
                    {trend && (
                        <div
                            className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend.positive ? "text-green-500" : "text-red-500"
                                }`}
                        >
                            {trend.positive ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {trend.label}
                        </div>
                    )}
                    {badge && (
                        <span
                            className={`inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}
                        >
                            {badge}
                        </span>
                    )}
                    {subtitle && <p className="text-gray-400 text-[11px] mt-1">{subtitle}</p>}
                </div>
                <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}
                >
                    {icon}
                </motion.div>
            </div>

            {extra && <div className="pl-1">{extra}</div>}
        </motion.div>
    );
}

/* ── Sparkline ── */
function SparkLine() {
    const points = [0, 15, 8, 20, 12, 25, 18, 30, 22, 28];
    const max = Math.max(...points);
    const width = 180;
    const height = 36;
    const pts = points
        .map((v, i) => `${(i / (points.length - 1)) * width},${height - (v / max) * height}`)
        .join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${pts} ${width},${height}`}
                fill="url(#sparkGrad)"
            />
            <polyline
                points={pts}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ── Progress bar ── */
function ProgressBar({ percent }: { percent: number }) {
    return (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
        </div>
    );
}

/* ── Waveform ── */
function Waveform() {
    const bars = [4, 8, 14, 10, 16, 12, 8, 14, 10, 6];
    return (
        <div className="flex items-end gap-0.5 h-5">
            {bars.map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                    style={{ height: h, originY: 1 }}
                    className="w-1.5 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-sm"
                />
            ))}
        </div>
    );
}

export default function StatsCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <StatCard
                index={0}
                title="Total Complaints"
                value="1,247"
                trend={{ label: "+23 new today", positive: true }}
                accentBar="bg-blue-500"
                accentBg="bg-blue-50"
                accentText="text-blue-600"
                icon={<FileText className="w-5 h-5 text-blue-500" />}
                iconBg="bg-blue-50"
                extra={<SparkLine />}
            />
            <StatCard
                index={1}
                title="Pending Action"
                value="89"
                badge="Require attention"
                badgeColor="bg-orange-100 text-orange-600"
                accentBar="bg-orange-500"
                accentBg="bg-orange-50"
                accentText="text-orange-600"
                icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
                iconBg="bg-orange-50"
                subtitle="12 high priority tickets"
            />
            <StatCard
                index={2}
                title="Resolved This Month"
                value="342"
                trend={{ label: "+18% vs last month", positive: true }}
                accentBar="bg-green-500"
                accentBg="bg-green-50"
                accentText="text-green-600"
                icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                iconBg="bg-green-50"
                extra={
                    <div className="space-y-1">
                        <ProgressBar percent={70} />
                        <p className="text-[10px] text-gray-400">70% of target</p>
                    </div>
                }
            />
            <StatCard
                index={3}
                title="Avg. Resolution Time"
                value="4.2 days"
                trend={{ label: "0.8 days improvement", positive: true }}
                accentBar="bg-purple-500"
                accentBg="bg-purple-50"
                accentText="text-purple-600"
                icon={<Clock className="w-5 h-5 text-purple-500" />}
                iconBg="bg-purple-50"
                extra={<Waveform />}
            />
        </div>
    );
}
