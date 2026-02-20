"use client";

import { motion } from "framer-motion";

const categories = [
    { icon: "🛣️", label: "Road & Potholes", count: 387, max: 387 },
    { icon: "🗑️", label: "Garbage Collection", count: 298, max: 387 },
    { icon: "💡", label: "Street Lighting", count: 201, max: 387 },
    { icon: "💧", label: "Drainage/Water", count: 178, max: 387 },
    { icon: "🚽", label: "Sanitation", count: 134, max: 387 },
];

const BAR_COLORS = [
    "bg-gray-800",
    "bg-gray-700",
    "bg-gray-600",
    "bg-gray-500",
    "bg-gray-400",
];

export default function CategoryPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
        >
            <h3 className="text-gray-900 font-bold text-base mb-5">By Category</h3>

            <div className="space-y-4">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="group"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-base leading-none">{cat.icon}</span>
                                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                    {cat.label}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{cat.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(cat.count / cat.max) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.4 + i * 0.08 }}
                                className={`h-full ${BAR_COLORS[i]} rounded-full`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
