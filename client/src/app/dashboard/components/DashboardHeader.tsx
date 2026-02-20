"use client";

import { motion } from "framer-motion";
import { Search, Bell, HelpCircle, Command } from "lucide-react";

export default function DashboardHeader() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-20"
        >
            {/* Greeting */}
            <div>
                <h2 className="text-gray-900 font-semibold text-lg leading-tight">
                    Good Morning, Suresh 👋
                </h2>
            </div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-[340px] shadow-sm group hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search complaints, wards, citizens..."
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                />
                <div className="flex items-center gap-0.5 text-gray-400 text-[11px] border border-gray-200 rounded px-1.5 py-0.5">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                </div>
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {/* Live indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1.5"
                >
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-red-500"
                    />
                    <span className="text-red-600 text-xs font-semibold tracking-wide">LIVE</span>
                </motion.div>

                {/* Notification bell */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-indigo-300 transition-colors cursor-pointer relative"
                >
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        3
                    </span>
                </motion.button>

                {/* Help */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
                >
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                </motion.button>
            </div>
        </motion.header>
    );
}
