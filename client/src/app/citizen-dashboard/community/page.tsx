"use client";

import React, { useState } from "react";
import {
    Users, MessageCircle, ThumbsUp, Share2, Search,
    TrendingUp, Award, Clock, ArrowRight, Zap,
    Filter, MoreHorizontal, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const communityPosts = [
        {
            id: 1,
            author: "Priya Sharma",
            avatar: "PS",
            time: "2 hours ago",
            content: "Great to see the pothole on MG Road finally fixed! Thanks to everyone who supported the complaint. It's amazing what we can achieve when we come together as a community.",
            likes: 24,
            comments: 8,
            category: "Road Maintenance",
            color: "indigo"
        },
        {
            id: 2,
            author: "Amit Patel",
            avatar: "AP",
            time: "5 hours ago",
            content: "Anyone else facing water supply issues in Andheri West? Let's raise a collective complaint to ensure the municipal authorities prioritize this before the weekend.",
            likes: 15,
            comments: 12,
            category: "Water Supply",
            color: "blue"
        },
        {
            id: 3,
            author: "Sneha Reddy",
            avatar: "SR",
            time: "1 day ago",
            content: "The new street lights in our area are working great! Kudos to the municipal team for the quick turnaround. Safety has improved significantly at night.",
            likes: 42,
            comments: 6,
            category: "Street Lighting",
            color: "amber"
        }
    ];

    const trendingTopics = [
        { name: "#SafetFirst", posts: 156, color: "bg-red-500" },
        { name: "#GreenMumbai", posts: 124, color: "bg-emerald-500" },
        { name: "#RoadFix", posts: 89, color: "bg-indigo-500" },
        { name: "#CleanCity", posts: 67, color: "bg-blue-500" },
    ];

    const topCitizens = [
        { name: "Rahul V.", points: 1250, badge: "Gold Reporter" },
        { name: "Sonia M.", points: 980, badge: "Silver Watcher" },
        { name: "Vikram S.", points: 840, badge: "Community Leader" },
    ];

    return (
        <div className="space-y-8 pb-12">

            {/* ── HERO HEADER ────────────────────────────────────────── */}
            <div
                className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-14 mb-8 group"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)" }}
            >
                {/* Visual elements */}
                <div className="absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-orange-500/20 blur-[100px] group-hover:bg-orange-500/30 transition-colors duration-700" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center md:text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-indigo-300 text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                        >
                            Citizen Hub · Community
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
                        >
                            Connect, Discuss, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Impact.</span>
                        </motion.h1>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-md mx-auto md:mx-0"
                        >
                            <input
                                type="text"
                                placeholder="Search discussions or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 backdrop-blur-md px-12 py-4 rounded-2xl text-white placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all text-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                        </motion.div>
                    </div>

                    {/* Stats or Action */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="shrink-0"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center">
                                <div className="text-3xl font-black text-white">2.4k</div>
                                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Active Today</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center">
                                <div className="text-3xl font-black text-white">458</div>
                                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Discussions</div>
                            </div>
                            <button className="col-span-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                                <Plus className="w-5 h-5" /> Start New Discussion
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── MAIN CONTENT GRID ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Feed (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Filters & Navigation */}
                    <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            {["All", "Popular", "Recent", "Resolved"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                        : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>

                    {/* Feature Announcement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-50/50 border border-indigo-100 rounded-4xl p-8 flex items-center gap-6 group hover:bg-indigo-50 transition-colors cursor-pointer overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Zap className="w-32 h-32 text-indigo-900" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-xl shadow-indigo-200">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-indigo-900 mb-1">Coming Soon: Live Discussions</h2>
                            <p className="text-sm text-indigo-700/80 leading-relaxed max-w-md">
                                Soon you'll be able to join live town halls and real-time neighborhood chats with municipal officials.
                            </p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-10 h-10 rounded-full border border-indigo-200 flex items-center justify-center group-hover:bg-white transition-all">
                                <ArrowRight className="w-4 h-4 text-indigo-600" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {communityPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
                            >
                                <div className="p-8">
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative group/avatar">
                                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
                                                    {post.avatar}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{post.author}</h3>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" /> {post.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border 
                                                ${post.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    post.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'}`}
                                            >
                                                {post.category}
                                            </span>
                                            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <p className="text-slate-700 leading-relaxed text-lg font-medium">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-6">
                                            <button className="group flex items-center gap-2.5 text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                                                    <ThumbsUp className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="text-sm font-bold">{post.likes}</span>
                                            </button>
                                            <button className="group flex items-center gap-2.5 text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                                                    <MessageCircle className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="text-sm font-bold">{post.comments}</span>
                                            </button>
                                        </div>
                                        <button className="group flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
                                            <Share2 className="w-4.5 h-4.5 text-slate-400 group-hover:text-indigo-600" />
                                            <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600">Share</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Trending Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-orange-500" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">Trending Topics</h3>
                        </div>

                        <div className="space-y-6">
                            {trendingTopics.map((topic, i) => (
                                <div key={topic.name} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${topic.color} group-hover:scale-150 transition-transform`} />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors uppercase tracking-wide">
                                            {topic.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                        {topic.posts} Posts
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2 group transition-all">
                            View all tags <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Community Leaders */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm overflow-hidden relative"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl" />

                        <div className="flex items-center gap-2 mb-8 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Award className="w-4 h-4 text-amber-500" />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">Citizen Leaders</h3>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {topCitizens.map((citizen, i) => (
                                <div key={citizen.name} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-slate-800">{citizen.name}</h4>
                                        <p className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">{citizen.badge}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-black text-slate-900">{citizen.points}</span>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">REP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Rules/Guide */}
                    <div className="p-8 text-center bg-slate-900 rounded-[2rem] text-white overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-full opacity-20"
                            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #4f46e5 0%, transparent 50%)" }} />
                        <h4 className="text-sm font-black mb-2 relative z-10">Community Guidelines</h4>
                        <p className="text-[11px] text-indigo-200 leading-relaxed mb-4 relative z-10">
                            Help us keep JanSeva a safe and productive space for all citizens.
                        </p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all relative z-10">
                            Read Our Mission
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
