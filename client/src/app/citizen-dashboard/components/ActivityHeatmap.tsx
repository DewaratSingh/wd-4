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
                // Map the trend data to heatmap format
                const formatted = data.trend.map((d: any) => ({
                    date: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    level: Math.min(Math.ceil(d.count / 2), 4), // Scale volume to levels 0-4
                    count: d.count
                })).slice(-14); // Last 14 days
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Activity Heatmap</h3>
            <p className="text-xs text-gray-500 mb-6">Recent reporting activity in your ward</p>

            <div className="flex-1 flex flex-wrap gap-2 items-center justify-start max-w-md mx-auto xl:mx-0">
                {heatmapData.map((day, index) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                    >
                        <div
                            className={`w-10 h-10 xl:w-12 xl:h-12 rounded-lg ${getColor(day.level)} transition-all duration-300 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 cursor-pointer`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {day.date}: {day.count} reports
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-gray-400">
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
