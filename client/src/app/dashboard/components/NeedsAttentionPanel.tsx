"use client";

import { motion } from "framer-motion";

const complaints = [
    {
        id: 1,
        title: "Major pipe burst at Andheri East Station",
        ward: "WARD 12",
        category: "WATER",
        categoryColor: "text-blue-600 bg-blue-50",
        time: "2h ago",
        score: 98,
        scoreColor: "bg-orange-500",
    },
    {
        id: 2,
        title: "Traffic signal malfunction at Linking Road",
        ward: "WARD 09",
        category: "TRAFFIC",
        categoryColor: "text-yellow-600 bg-yellow-50",
        time: "4h ago",
        score: 94,
        scoreColor: "bg-orange-400",
    },
    {
        id: 3,
        title: "Garbage dump overflow near market",
        ward: "WARD 14",
        category: "HEALTH",
        categoryColor: "text-green-600 bg-green-50",
        time: "5h ago",
        score: 89,
        scoreColor: "bg-orange-400",
    },
    {
        id: 4,
        title: "Open manhole cover on main street",
        ward: "WARD 03",
        category: "SAFETY",
        categoryColor: "text-red-600 bg-red-50",
        time: "6h ago",
        score: 85,
        scoreColor: "bg-yellow-500",
    },
];

export default function NeedsAttentionPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-bold text-base">Needs Attention</h3>
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="w-2 h-2 rounded-full bg-red-500"
                    />
                </div>
                <motion.button
                    whileHover={{ color: "#4f46e5" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-indigo-500 text-xs font-semibold hover:text-indigo-700 transition-colors cursor-pointer"
                >
                    View All
                </motion.button>
            </div>

            {/* List */}
            <div className="space-y-1">
                {complaints.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.07 }}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        className="flex items-center gap-3 px-2 py-3 rounded-xl border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                    >
                        {/* Left: text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-800 text-sm font-semibold truncate">{c.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-400 text-[10px] font-medium">{c.ward}</span>
                                <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.categoryColor}`}
                                >
                                    {c.category}
                                </span>
                                <span className="text-gray-400 text-[10px]">{c.time}</span>
                            </div>
                        </div>

                        {/* Right: score badge */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-9 h-9 rounded-full ${c.scoreColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
                        >
                            <span className="text-white text-xs font-bold">{c.score}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
