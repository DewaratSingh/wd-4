"use client";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const categoryData = [
    { name: 'Roads', value: 40, color: '#3b82f6' },
    { name: 'Garbage', value: 30, color: '#10b981' },
    { name: 'Lighting', value: 20, color: '#f59e0b' },
    { name: 'Water', value: 10, color: '#ef4444' },
];

const trendData = [
    { name: 'Mon', new: 4, resolved: 2 },
    { name: 'Tue', new: 3, resolved: 4 },
    { name: 'Wed', new: 6, resolved: 3 },
    { name: 'Thu', new: 8, resolved: 5 },
    { name: 'Fri', new: 5, resolved: 7 },
    { name: 'Sat', new: 2, resolved: 3 },
    { name: 'Sun', new: 3, resolved: 4 },
];

export function CategoryDistribution() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Issue Categories</h3>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-500 font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ResolutionTrend() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Resolution Trend</h3>
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="new"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="resolved"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
