"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const statusData = [
    { name: "Resolved", value: 27.4, color: "#22c55e" },
    { name: "Submitted", value: 7.2, color: "#ef4444" },
    { name: "In Progress", value: 15.2, color: "#f59e0b" },
    { name: "Assigned", value: 11.0, color: "#3b82f6" },
    { name: "Under Review", value: 18.8, color: "#6366f1" },
    { name: "Rejected", value: 2.5, color: "#1f2937" },
];

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
            <span className="text-gray-500 text-[11px]">{label}</span>
            <span className="text-gray-700 text-[11px] font-semibold ml-auto">{value}%</span>
        </div>
    );
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0];
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl"
            >
                <p className="font-semibold">{d.name}</p>
                <p className="text-gray-300 mt-0.5">{d.value}%</p>
            </motion.div>
        );
    }
    return null;
};

export default function StatusDonutChart() {
    const total = 1247;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col"
        >
            <div className="mb-4">
                <h3 className="text-gray-900 font-bold text-base">By Status</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                    Current distribution of {total.toLocaleString()} tickets
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center">
                {/* Donut Chart */}
                <div className="relative w-[200px] h-[200px]">
                    <PieChart width={200} height={200}>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            isAnimationActive={true}
                            animationBegin={200}
                            animationDuration={1200}
                        >
                            {statusData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>

                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                            className="text-2xl font-extrabold text-gray-900 leading-none"
                        >
                            {total.toLocaleString()}
                        </motion.span>
                        <span className="text-gray-400 text-[10px] font-medium mt-0.5">TOTAL</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 w-full grid grid-cols-2 gap-x-4 gap-y-2 px-2">
                    {statusData.map((item) => (
                        <LegendItem
                            key={item.name}
                            color={item.color}
                            label={item.name}
                            value={item.value}
                        />
                    ))}
                </div>

                {/* Percentage labels around the donut matching screenshot */}
                <div className="mt-2 flex gap-4 text-[11px] text-gray-500 justify-center">
                    <span className="text-green-500 font-semibold">27.4%</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-yellow-500 font-semibold">15.2%</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-indigo-500 font-semibold">18.8%</span>
                </div>
            </div>
        </motion.div>
    );
}
