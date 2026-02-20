"use client";

import { Expand } from "lucide-react";

export default function WardMap() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Ward 14 Map</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    Expand <Expand className="w-3 h-3" />
                </button>
            </div>

            <div className="relative flex-1 bg-blue-50 rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center group">
                {/* Placeholder Map Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover bg-center"></div>

                {/* Map Marker Pin */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-2 h-8 bg-red-500 rounded-full -mt-2"></div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium shadow-sm flex gap-3">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved
                    </div>
                </div>
            </div>
        </div>
    );
}
