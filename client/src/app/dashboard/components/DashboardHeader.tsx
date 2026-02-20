"use client";

import { motion } from "framer-motion";
import { Search, Bell, HelpCircle, Command } from "lucide-react";
import GoogleTranslate from "@/components/GoogleTranslate";

export default function DashboardHeader({ title }: { title?: string }) {
    return (
        <header
            className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-20"
        >
            {/* Greeting */}
            <div>
                <h2 className="text-gray-900 font-semibold text-lg leading-tight">
                    {title || "Good Morning, Suresh 👋"}
                </h2>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search (Visual only) */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 transition-all w-64 outline-none"
                    />
                </div>

                <div className="h-6 w-px bg-gray-200 hidden md:block" />

                <div className="flex items-center gap-4">
                    {/* Translation */}
                    <div className="hidden sm:block">
                        <GoogleTranslate />
                    </div>

                    {/* Help */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
                    >
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
