"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";

const wards = [
    {
        rank: 1,
        name: "Ward 12 - Andheri W",
        rate: 94,
        barColor: "bg-green-500",
        medal: "🥇",
        isYou: false,
    },
    {
        rank: 2,
        name: "Ward 07 - Bandra W",
        rate: 88,
        barColor: "bg-green-400",
        medal: "🥈",
        isYou: false,
    },
    {
        rank: 3,
        name: "Ward 14 - Dadar (You)",
        rate: 81,
        barColor: "bg-indigo-500",
        medal: "🥉",
        isYou: true,
    },
    {
        rank: 4,
        name: "Ward 03 - Colaba",
        rate: 74,
        barColor: "bg-yellow-400",
        medal: null,
        isYou: false,
    },
    {
        rank: 5,
        name: "Ward 19 - Malad",
        rate: 61,
        barColor: "bg-orange-400",
        medal: null,
        isYou: false,
    },
    {
        rank: 6,
        name: "Ward 22 - Borivali",
        rate: 58,
        barColor: "bg-orange-300",
        medal: null,
        isYou: false,
    },
];

export default function WardPerformancePanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-base">Ward Performance</h3>
                <motion.button
                    whileHover={{ scale: 1.05, color: "#4f46e5" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                    <Filter className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[40px_1fr_80px] gap-2 px-2 mb-2">
                <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Rank</span>
                <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">Ward</span>
                <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide text-right">Rate</span>
            </div>

            {/* Rows */}
            <div className="space-y-1">
                {wards.map((ward, i) => (
                    <motion.div
                        key={ward.rank}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.07 }}
                        whileHover={{ backgroundColor: ward.isYou ? "#eef2ff" : "#f9fafb" }}
                        className={`grid grid-cols-[40px_1fr_80px] gap-2 items-center px-2 py-2.5 rounded-xl cursor-pointer transition-colors ${ward.isYou ? "bg-indigo-50 border border-indigo-100" : ""
                            }`}
                    >
                        {/* Rank */}
                        <div className="flex items-center justify-start">
                            {ward.medal ? (
                                <span className="text-base leading-none">{ward.medal}</span>
                            ) : (
                                <span className="text-gray-400 text-sm font-semibold">
                                    {String(ward.rank).padStart(2, "0")}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <span
                            className={`text-sm font-semibold truncate ${ward.isYou ? "text-indigo-700" : "text-gray-800"
                                }`}
                        >
                            {ward.name}
                        </span>

                        {/* Rate + bar */}
                        <div className="flex flex-col items-end gap-1">
                            <span
                                className={`text-xs font-bold ${ward.isYou ? "text-indigo-600" : "text-gray-700"
                                    }`}
                            >
                                {ward.rate}%
                            </span>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${ward.rate}%` }}
                                    transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                        delay: 0.5 + i * 0.07,
                                    }}
                                    className={`h-full ${ward.barColor} rounded-full`}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
