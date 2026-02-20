"use client";

import { CloudSun, MapPin, AlertCircle, Wind } from "lucide-react";

export default function HeroBanner() {
    return (
        <div className="relative w-full bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-8 text-white overflow-hidden shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        Good Morning, Rajesh <span className="text-2xl">👋</span>
                    </h1>
                    <div className="flex items-center gap-2 text-blue-100 text-sm mb-6">
                        <MapPin className="w-4 h-4" />
                        <span>Mumbai Ward 14 — Andheri West</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <CloudSun className="w-5 h-5 text-yellow-300" />
                            <span>32°C Mostly Sunny</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <Wind className="w-5 h-5 text-green-300" />
                            <span>AQI 85 (Moderate)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/20">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                    3 active issues
                </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
    );
}
