"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Zap, MessageSquare, ArrowRight } from 'lucide-react';

export default function CommunityPriority() {
    const [hotTopics, setHotTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotTopics = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/stats/advanced');
                const result = await res.json();
                if (result.success) {
                    const sorted = result.categoryMetrics
                        .sort((a: any, b: any) => b.avg_upvotes - a.avg_upvotes)
                        .slice(0, 3);
                    setHotTopics(sorted);
                }
            } catch (err) {
                console.error("Failed to fetch community priorities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotTopics();
    }, []);

    if (loading) return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading Community Buzz...</div>;

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <Zap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight">Civic Priority Buzz</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-tight">What your neighbors care about most</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {hotTopics.map((topic, idx) => (
                    <motion.div
                        key={topic.category}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                        #{idx + 1}
                                    </span>
                                    <h4 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">{topic.category}</h4>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp size={12} className="text-indigo-500" />
                                        <span className="text-xs font-bold">{parseFloat(topic.avg_upvotes).toFixed(1)} avg votes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={12} className="text-slate-400" />
                                        <span className="text-xs font-medium">{topic.volume} reports</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Data updated in real-time</p>
            </div>
        </div>
    );
}
