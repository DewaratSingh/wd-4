"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, MapPin, Clock, CheckCircle2, AlertCircle,
    Calendar, ThumbsUp, BarChart3, Zap, Filter, ArrowRight, Plus
} from "lucide-react";
import Link from "next/link";

interface Complaint {
    id: number;
    image_url: string;
    notes: string;
    phone: string;
    latitude: number;
    longitude: number;
    created_at: string;
    progress: string;
    resolved_text?: string;
    resolved_image_url?: string;
    upvotes: number;
    priority_score: number;
}

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; badge: string }> = {
    Resolved: { bg: "bg-emerald-500/15 border-emerald-400/30", text: "text-emerald-400", dot: "bg-emerald-400", badge: "border-emerald-500/40" },
    "In Progress": { bg: "bg-amber-500/15 border-amber-400/30", text: "text-amber-400", dot: "bg-amber-400", badge: "border-amber-500/40" },
    Pending: { bg: "bg-blue-500/15 border-blue-400/30", text: "text-blue-400", dot: "bg-blue-400", badge: "border-blue-500/40" },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP["Pending"];

const PRIORITY_COLOR = (score: number) => {
    if (score >= 7) return "text-red-400";
    if (score >= 4) return "text-amber-400";
    return "text-slate-400";
};

export default function UserComplaintsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (id) fetchUserComplaints();
    }, [id]);

    const fetchUserComplaints = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/user-complaints/${id}`);
            const data = await res.json();
            if (data.success) {
                // Normalise all numeric fields so .toFixed() etc. always work
                const normalised = data.complaints.map((c: any) => ({
                    ...c,
                    latitude: parseFloat(c.latitude) || 0,
                    longitude: parseFloat(c.longitude) || 0,
                    upvotes: parseInt(c.upvotes) || 0,
                    priority_score: parseFloat(c.priority_score) || 0,
                }));
                setComplaints(normalised);
            } else {
                setError(data.error || "Failed to load complaints");
            }
        } catch { setError("Failed to connect to server"); }
        finally { setLoading(false); }
    };

    const filtered = filter === "All" ? complaints : complaints.filter(c => c.progress === filter);
    const resolved = complaints.filter(c => c.progress === "Resolved").length;
    const pending = complaints.filter(c => c.progress === "Pending").length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-[1600px] mx-auto flex pt-4">
                <Sidebar />

                <main className="flex-1 px-4 lg:px-8 pb-16 overflow-x-hidden">
                    <div className="space-y-7">

                        {/* ── HERO HEADER ──────────────────────────────────────── */}
                        <div className="relative rounded-2xl overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)" }}>
                            {/* grid */}
                            <div className="absolute inset-0 opacity-[0.07]"
                                style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
                            {/* glow */}
                            <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-orange-500/15 blur-[70px]" />

                            <div className="relative z-10 px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-indigo-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Citizen Portal</p>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Complaints</h1>
                                    <p className="text-indigo-200 text-sm mt-1">Track and manage all your civic reports in one place</p>
                                </div>

                                {/* Quick stats */}
                                <div className="flex items-center gap-4 shrink-0">
                                    {[
                                        { label: "Total", value: complaints.length, color: "text-white" },
                                        { label: "Resolved", value: resolved, color: "text-emerald-400" },
                                        { label: "Pending", value: pending, color: "text-amber-400" },
                                    ].map(s => (
                                        <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-3">
                                            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                            <div className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider mt-0.5">{s.label}</div>
                                        </div>
                                    ))}
                                    <Link href="/complaint"
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-vibrant-orange text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all">
                                        <Plus className="w-4 h-4" /> New Report
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── FILTER TABS ───────────────────────────────────────── */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-slate-400" />
                            {["All", "Pending", "In Progress", "Resolved"].map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-300/30"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                        }`}>
                                    {f}
                                    <span className="ml-1.5 opacity-60">
                                        {f === "All" ? complaints.length : complaints.filter(c => c.progress === f).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* ── STATES ───────────────────────────────────────────── */}
                        {loading ? (
                            <div className="flex items-center justify-center py-32">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                                    <p className="text-slate-400 text-sm font-medium">Loading your reports…</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />{error}
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 py-24 text-center space-y-5">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto">
                                    <MessageSquare className="w-8 h-8 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No reports yet</h3>
                                    <p className="text-slate-400 text-sm mt-1">Help improve your city by reporting the first issue</p>
                                </div>
                                <Link href="/complaint"
                                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                                    <Plus className="w-4 h-4" /> Report an Issue
                                </Link>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                                    {filtered.map((complaint, i) => {
                                        const status = getStatus(complaint.progress);
                                        const date = new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                        return (
                                            <motion.div
                                                key={complaint.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                                            >
                                                {/* Image */}
                                                <div className="relative h-44 overflow-hidden bg-slate-100">
                                                    {complaint.image_url ? (
                                                        <img src={complaint.image_url} alt="Issue"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <MessageSquare className="w-10 h-10 text-slate-300" />
                                                        </div>
                                                    )}
                                                    {/* Dark gradient overlay */}
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                                    {/* Status chip */}
                                                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${status.bg} ${status.text} ${status.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} shrink-0`} />
                                                        {complaint.progress || "Pending"}
                                                    </div>

                                                    {/* Date chip */}
                                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
                                                        <Calendar className="w-3 h-3 text-indigo-500" />{date}
                                                    </div>

                                                    {/* Ticket ID */}
                                                    <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-mono text-white/80">
                                                        #{complaint.id}
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="flex-1 flex flex-col p-5 gap-4">
                                                    {/* Description */}
                                                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-2 font-medium">
                                                        {complaint.notes || "No description provided"}
                                                    </p>

                                                    {/* Location */}
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                                        <span className="truncate font-mono text-[11px]">{parseFloat(String(complaint.latitude))?.toFixed(4)}, {parseFloat(String(complaint.longitude))?.toFixed(4)}</span>
                                                    </div>

                                                    {/* Resolved banner */}
                                                    {complaint.progress === "Resolved" && (
                                                        <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Resolution Update</p>
                                                                <p className="text-xs text-emerald-800 line-clamp-2">{complaint.resolved_text || "Issue has been successfully addressed."}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {/* Upvotes */}
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                                                    <ThumbsUp className="w-3 h-3 text-indigo-500" />
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-600">{complaint.upvotes || 0}</span>
                                                            </div>
                                                            {/* Priority */}
                                                            <div className="flex items-center gap-1">
                                                                <Zap className={`w-3.5 h-3.5 ${PRIORITY_COLOR(complaint.priority_score)}`} />
                                                                <span className={`text-xs font-bold ${PRIORITY_COLOR(complaint.priority_score)}`}>
                                                                    {complaint.priority_score?.toFixed(1) ?? "0.0"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => router.push(`/citizen-dashboard/complaint/${complaint.id}`)}
                                                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/btn">
                                                            View Details
                                                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </AnimatePresence>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
