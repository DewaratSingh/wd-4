import { Layers, Flame } from "lucide-react";

export default function MapLegend() {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-full py-2 px-6 flex items-center gap-6 shadow-2xl text-white">

                {/* Priority Legend */}
                <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white/20 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
                        <span className="text-xs font-bold text-gray-300">High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white/20"></span>
                        <span className="text-xs font-bold text-gray-300">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white/20"></span>
                        <span className="text-xs font-bold text-gray-300">Resolved</span>
                    </div>
                </div>

                {/* Heatmap Indicator */}
                <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 w-16 h-1.5 rounded-full" />
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" />
                        Hotspot Density
                    </span>
                </div>

            </div>
        </div>
    );
}
