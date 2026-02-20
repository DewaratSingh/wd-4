"use client";

import { CheckCircle2, RefreshCw, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const statsConfig = [
    {
        label: "RESOLVED",
        key: "resolved",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-100",
    },
    {
        label: "IN PROGRESS",
        key: "inProgress",
        icon: RefreshCw,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    {
        label: "NEW TODAY",
        key: "newToday",
        icon: PlusCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
];

interface StatsBarProps {
    stats: {
        resolved: number;
        inProgress: number;
        newToday: number;
    };
}

export default function StatsBar({ stats }: StatsBarProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {statsConfig.map((config, index) => (
                <motion.div
                    key={config.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group flex items-center p-4 rounded-xl border ${config.bg} ${config.border}`}
                >
                    <div className={`p-3 rounded-full bg-white shadow-sm mr-4 ${config.color}`}>
                        <config.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 tracking-wider mb-1">{config.label}</p>
                        <p className="text-lg font-bold text-gray-800">
                            {config.key === 'resolved' && `${stats.resolved} this month`}
                            {config.key === 'inProgress' && `${stats.inProgress} active`}
                            {config.key === 'newToday' && `${stats.newToday} reports`}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
