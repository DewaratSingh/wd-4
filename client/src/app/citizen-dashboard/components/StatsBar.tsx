"use client";

import { CheckCircle2, RefreshCw, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
    {
        label: "RESOLVED",
        value: "47 this month",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-100",
    },
    {
        label: "IN PROGRESS",
        value: "12 active",
        icon: RefreshCw,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    {
        label: "NEW TODAY",
        value: "8 reports",
        icon: PlusCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
];

export default function StatsBar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group flex items-center p-4 rounded-xl border ${stat.bg} ${stat.border}`}
                >
                    <div className={`p-3 rounded-full bg-white shadow-sm mr-4 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 tracking-wider mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
