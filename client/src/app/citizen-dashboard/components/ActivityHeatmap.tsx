import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ActivityHeatmap() {
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/stats');
            const data = await res.json();
            if (data.success) {
                // Build a full 14-day scaffold first
                const scaffold: any[] = [];
                for (let i = 13; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    scaffold.push({
                        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        level: 0,
                        count: 0
                    });
                }

                // Overlay real data — API returns { date: 'Mon DD', total, resolved }
                const apiMap: Record<string, any> = {};
                (data.stats?.trend ?? data.trend ?? []).forEach((d: any) => {
                    apiMap[d.date] = d;
                });

                const formatted = scaffold.map(day => {
                    const real = apiMap[day.date];
                    if (real) {
                        const count = parseInt(real.total ?? real.count ?? 0);
                        return { date: day.date, level: Math.min(Math.ceil(count / 2), 4), count };
                    }
                    return day;
                });

                setHeatmapData(formatted);
            }
        } catch (err) {
            console.error("Heatmap fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('refresh-data', fetchData);
        return () => window.removeEventListener('refresh-data', fetchData);
    }, []);

    const getColor = (level: number) => {
        if (level === 0) return "bg-gray-100";
        if (level === 1) return "bg-blue-100";
        if (level === 2) return "bg-blue-300";
        if (level === 3) return "bg-blue-500";
        return "bg-blue-700";
    };

    if (loading) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Loading activity...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-1">Activity Heatmap</h3>
            <p className="text-xs text-gray-500 mb-5">Recent reporting activity in your ward</p>

            {/* 7 columns × 2 rows grid of day cells */}
            <div className="grid grid-cols-7 gap-2">
                {heatmapData.map((day, index) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04 }}
                        className="group relative"
                    >
                        <div
                            className={`w-full aspect-square rounded-lg ${getColor(day.level)} transition-all duration-300 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 cursor-pointer`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {day.date}: {day.count} reports
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100" />
                    <div className="w-3 h-3 rounded-sm bg-blue-100" />
                    <div className="w-3 h-3 rounded-sm bg-blue-300" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <div className="w-3 h-3 rounded-sm bg-blue-700" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
