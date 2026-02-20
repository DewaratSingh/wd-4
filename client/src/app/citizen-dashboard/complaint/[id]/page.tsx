'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle2, FileText, Phone, MapPin,
    Calendar, Hash, ThumbsUp, Zap, ExternalLink, ImageIcon, Shield
} from 'lucide-react';
import JourneyTimeline from '../../components/JourneyTimeline';
import { motion } from 'framer-motion';

// ─── Status helpers ─────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    Resolved: { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400", border: "border-emerald-400/30" },
    "In Progress": { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400", border: "border-amber-400/30" },
    "Work in Progress": { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400", border: "border-amber-400/30" },
    Pending: { bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400", border: "border-blue-400/30" },
    Closed: { bg: "bg-slate-500/15", text: "text-slate-400", dot: "bg-slate-400", border: "border-slate-400/30" },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP["Pending"];

const PRIORITY_COLOR = (score: number) => {
    if (score >= 7) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-400/30" };
    if (score >= 4) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30" };
    return { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-400/30" };
};

export default function CitizenComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/complaint/${id}`);
            const data = await res.json();
            if (data.success) {
                const c = data.complaint;
                setComplaint({
                    ...c,
                    latitude: parseFloat(c.latitude) || 0,
                    longitude: parseFloat(c.longitude) || 0,
                    upvotes: parseInt(c.upvotes) || 0,
                    priority_score: parseFloat(c.priority_score) || 0,
                });
            }
        } catch (err) {
            console.error("Error fetching complaint:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Loading report details…</p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="bg-white border border-slate-200 p-10 rounded-3xl text-center max-w-md w-full shadow-sm">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
                    <p className="text-slate-400 text-sm mb-6">This complaint doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const status = getStatus(complaint.progress);
    const priority = PRIORITY_COLOR(complaint.priority_score ?? 0);
    const date = new Date(complaint.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 py-4">

            {/* ── BACK BUTTON ─── */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group text-sm"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Complaints
            </button>

            {/* ── HERO HEADER ─── */}
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)" }}
            >
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
                {/* Glow */}
                <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-orange-500/15 blur-[80px]" />

                <div className="relative z-10 px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <p className="text-indigo-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">Citizen Portal · Complaint Detail</p>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Report #{complaint.id}</h1>
                        <p className="text-indigo-200 text-sm mt-1">Filed on {date}</p>
                    </div>

                    {/* Status + priority badges */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${status.bg} ${status.text} ${status.border}`}>
                            <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">{complaint.progress || "Pending"}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${priority.bg} ${priority.text} ${priority.border}`}>
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Priority {complaint.priority_score?.toFixed(1) ?? "0.0"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT: Image */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="lg:col-span-2 space-y-4"
                >
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="relative aspect-[4/3] bg-slate-100">
                            {complaint.image_url ? (
                                <img src={complaint.image_url} alt="Issue" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                                    <ImageIcon className="w-10 h-10 text-slate-300" />
                                    <p className="text-slate-400 text-xs font-medium">No image uploaded</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Issue Photo</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">#{complaint.id}</span>
                        </div>
                    </div>

                    {/* Stats mini-cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-indigo-500 mb-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upvotes</span>
                            </div>
                            <p className="text-2xl font-black text-slate-800">{complaint.upvotes ?? 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filed</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-tight">{date}</p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Details */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3 space-y-4"
                >
                    {/* Notes */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">User Notes</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 rounded-xl p-4 border border-slate-100">
                            {complaint.notes || "No description provided."}
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Contact</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-slate-800 font-bold font-mono text-base">
                                {complaint.phone?.slice(0, 2)}••••••{complaint.phone?.slice(-2)}
                            </p>
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold uppercase tracking-wider">Masked</span>
                        </div>
                    </div>

                    {/* Geo Location */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5 text-red-500" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Geo Location</span>
                        </div>
                        <p className="text-slate-800 font-mono font-semibold text-sm mb-2">
                            {complaint.latitude?.toFixed(5)}, {complaint.longitude?.toFixed(5)}
                        </p>
                        <a
                            href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in Google Maps
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Citizen Journey Timeline */}
            <JourneyTimeline complaint={complaint} />

            {/* ── RESOLUTION CARD ─── */}
            {(complaint.resolved_text || complaint.resolved_image_url) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden"
                >
                    {/* Header strip */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-base leading-none">Resolution Status</p>
                            <p className="text-emerald-100 text-xs mt-0.5">Official update from the municipal authority</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 bg-white/15 border border-white/30 rounded-full px-3 py-1">
                            <Shield className="w-3.5 h-3.5 text-white" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Verified</span>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col lg:flex-row gap-8">
                        {/* Officer notes */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Welfare Officer Notes</p>
                                <blockquote className="text-slate-700 leading-relaxed text-sm bg-emerald-50 p-5 rounded-xl border border-emerald-100 italic">
                                    "{complaint.resolved_text || 'Issue has been successfully resolved based on municipal guidelines.'}"
                                </blockquote>
                            </div>

                            {complaint.resolved_latitude && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Resolution Location</p>
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <span className="text-slate-800 font-mono font-semibold text-sm">
                                            {parseFloat(complaint.resolved_latitude).toFixed(5)}, {parseFloat(complaint.resolved_longitude).toFixed(5)}
                                        </span>
                                        <a
                                            href={`https://www.google.com/maps?q=${complaint.resolved_latitude},${complaint.resolved_longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline"
                                        >
                                            <ExternalLink className="w-3 h-3" /> View Proof Trace
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Proof image */}
                        {complaint.resolved_image_url && (
                            <div className="lg:w-64 shrink-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Proof of Resolution</p>
                                <div className="rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-md aspect-square bg-slate-100">
                                    <img
                                        src={complaint.resolved_image_url}
                                        alt="Resolution Proof"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

        </div>
    );
}
