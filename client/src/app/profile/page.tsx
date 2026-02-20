"use client";

import { useRouter } from "next/navigation";
import {
    ArrowLeft, User, Mail, Calendar, Shield, Edit, Star,
    TrendingUp, CheckCircle, Clock, Award, Zap, MapPin, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
    if (!name) return "U";
    const p = name.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
}

// Animated number counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 30);
        return () => clearInterval(timer);
    }, [target]);
    return <>{count}{suffix}</>;
}

// SVG ring for trust score
function TrustRing({ score }: { score: number }) {
    const r = 44, circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="56" cy="56" r={r} fill="none" stroke="url(#trustGrad)" strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.2s ease" }}
                />
                <defs>
                    <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex flex-col items-center z-10">
                <span className="text-2xl font-black text-slate-900">{score}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Trust</span>
            </div>
        </div>
    );
}

// ─── Achievement Badge ─────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
    { icon: "🏆", title: "Active Citizen", desc: "Reported 5+ issues", color: "from-amber-50 to-orange-50", border: "border-amber-200", earned: true },
    { icon: "⭐", title: "Trusted Reporter", desc: "High trust score", color: "from-indigo-50 to-purple-50", border: "border-indigo-200", earned: true },
    { icon: "⚡", title: "Quick Responder", desc: "Responded within 24h", color: "from-yellow-50 to-green-50", border: "border-yellow-200", earned: false },
    { icon: "🎯", title: "Problem Solver", desc: "10+ issues resolved", color: "from-rose-50 to-pink-50", border: "border-rose-200", earned: false },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ totalComplaints: 0, resolved: 0, pending: 0, trustScore: 92 });

    useEffect(() => {
        const cu = localStorage.getItem("currentUser");
        const mu = localStorage.getItem("municipalUser");
        if (cu) { const u = JSON.parse(cu); setUser(u); fetchStats(u.id); }
        else if (mu) setUser(JSON.parse(mu));
    }, []);

    const fetchStats = async (userId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/user-complaints/${userId}`);
            const data = await res.json();
            if (data.success) {
                const c = data.complaints;
                setStats({
                    totalComplaints: c.length,
                    resolved: c.filter((x: any) => x.progress === "Resolved").length,
                    pending: c.filter((x: any) => x.progress === "Pending").length,
                    trustScore: 92,
                });
            }
        } catch { /* silent */ }
    };

    if (!user) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <p className="text-slate-500 text-sm font-medium">Loading your profile…</p>
            </div>
        </div>
    );

    const displayName = user.username || user.name || "Citizen";
    const citizenId = user.id ? `MUM-${String(user.id).padStart(4, "0")}-${user.email?.substring(0, 2).toUpperCase() || "XX"}` : "N/A";
    const memberDate = user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "Recently joined";
    const resolutionRate = stats.totalComplaints > 0 ? Math.round((stats.resolved / stats.totalComplaints) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ═══ HERO COVER ═══════════════════════════════════════════════════ */}
            <div className="relative h-52 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 60%, #6366f1 100%)" }}>
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "36px 36px" }} />
                {/* Glows */}
                <div className="absolute -top-16 right-20 w-64 h-64 rounded-full bg-orange-500/20 blur-[80px]" />
                <div className="absolute bottom-0 left-32 w-48 h-48 rounded-full bg-indigo-300/15 blur-[60px]" />
                {/* Concentric ring accent */}
                <div className="absolute -right-8 -bottom-16 w-72 h-72 rounded-full border border-white/10" />
                <div className="absolute -right-8 -bottom-16 w-52 h-52 rounded-full border border-white/8" />

                {/* Back button */}
                <button onClick={() => router.back()}
                    className="absolute top-5 left-5 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                    <ArrowLeft className="w-4 h-4" />Back
                </button>

                {/* Page label */}
                <div className="absolute top-5 right-5 flex items-center gap-1.5 text-white/60 text-[11px] font-semibold tracking-widest uppercase">
                    <Shield className="w-3.5 h-3.5" /> Citizen Profile
                </div>
            </div>

            {/* ═══ MAIN LAYOUT ══════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 pb-16">

                {/* ── AVATAR CARD (floats over the cover) ─────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="-mt-16 mb-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center sm:items-end gap-5"
                >
                    {/* Avatar ring */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-orange-400 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-400/30 ring-4 ring-white">
                            {getInitials(displayName)}
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-success-emerald border-2 border-white flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    {/* Name & ID */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{displayName}</h1>
                        <p className="text-slate-400 text-sm font-mono mt-0.5">{citizenId}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                <Zap className="w-3 h-3" /> Verified Citizen
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="w-3 h-3" /> Mumbai Ward
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <Calendar className="w-3 h-3" /> {memberDate}
                            </span>
                        </div>
                    </div>

                    {/* Edit & Trust */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <TrustRing score={stats.trustScore} />
                        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-400/25 hover:shadow-indigo-400/50 hover:scale-105 transition-all">
                            <Edit className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
                    <div className="space-y-6">

                        {/* Personal Info */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-500" /> Personal Info
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { icon: User, label: "Full Name", value: displayName, color: "text-indigo-500", bg: "bg-indigo-50" },
                                    { icon: Mail, label: "Email", value: user.email || "Not provided", color: "text-emerald-500", bg: "bg-emerald-50" },
                                    { icon: Calendar, label: "Member Since", value: memberDate, color: "text-purple-500", bg: "bg-purple-50" },
                                ].map(({ icon: Icon, label, value, color, bg }) => (
                                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-4 h-4 ${color}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                                            <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Impact Score Card */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                            className="rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden relative"
                            style={{ background: "linear-gradient(135deg, #1e1b4b, #4338ca)" }}>
                            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-orange-500/10" />
                            <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" /> City Impact Score
                            </h3>
                            <div className="text-5xl font-black text-white mb-1">
                                <Counter target={stats.trustScore} />
                                <span className="text-2xl text-indigo-300">/100</span>
                            </div>
                            <p className="text-indigo-200 text-xs mb-4">Top 8% of citizens in your ward</p>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.trustScore}%` }} transition={{ delay: 0.5, duration: 1 }}
                                    className="h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg, #818cf8, #f97316)" }}
                                />
                            </div>
                        </motion.div>

                    </div>

                    {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Stats Grid */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="grid grid-cols-3 gap-4">
                            {[
                                { icon: MessageSquare, label: "Total Reported", value: stats.totalComplaints, suffix: "", color: "text-indigo-600", bg: "bg-indigo-600", light: "bg-indigo-50" },
                                { icon: CheckCircle, label: "Resolved", value: stats.resolved, suffix: "", color: "text-emerald-600", bg: "bg-emerald-600", light: "bg-emerald-50" },
                                { icon: Clock, label: "Pending", value: stats.pending, suffix: "", color: "text-amber-600", bg: "bg-amber-600", light: "bg-amber-50" },
                            ].map(({ icon: Icon, label, value, suffix, color, bg, light }) => (
                                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
                                    <div className={`w-9 h-9 ${light} rounded-xl flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${color}`} />
                                    </div>
                                    <div>
                                        <div className={`text-3xl font-black ${color}`}>
                                            <Counter target={value} suffix={suffix} />
                                        </div>
                                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{label}</div>
                                    </div>
                                    {/* Mini bar */}
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: stats.totalComplaints > 0 ? `${(value / stats.totalComplaints) * 100}%` : "0%" }} transition={{ delay: 0.6, duration: 0.8 }}
                                            className={`h-full ${bg} rounded-full`} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Resolution Rate Banner */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Issue Resolution Rate</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">How quickly your complaints get resolved</p>
                                </div>
                                <span className="text-2xl font-black text-indigo-600">{resolutionRate}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${resolutionRate}%` }} transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg, #6366f1, #22c55e)" }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-semibold text-slate-300 mt-1.5">
                                <span>0%</span><span>50%</span><span>100%</span>
                            </div>
                        </motion.div>

                        {/* Achievements */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-500" /> Achievements
                                <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} Earned
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {ACHIEVEMENTS.map((a, i) => (
                                    <motion.div key={a.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
                                        className={`relative p-4 rounded-xl border ${a.border} bg-linear-to-br ${a.color} ${!a.earned ? "opacity-40 grayscale" : ""} transition-all hover:scale-[1.02]`}>
                                        {a.earned && (
                                            <div className="absolute top-2.5 right-2.5">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            </div>
                                        )}
                                        <div className="text-2xl mb-2">{a.icon}</div>
                                        <div className="text-xs font-bold text-slate-800">{a.title}</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">{a.desc}</div>
                                        {!a.earned && (
                                            <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">🔒 Locked</div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Activity Timeline */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h3>
                            <div className="space-y-0">
                                {[
                                    { dot: "bg-indigo-500", label: "Account created", sub: memberDate, icon: "🎉" },
                                    { dot: "bg-amber-400", label: "Earned 'Active Citizen' badge", sub: "After 1st report", icon: "🏆" },
                                    { dot: "bg-emerald-500", label: "Trusted Reporter unlocked", sub: "Trust score > 90", icon: "⭐" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${item.dot} ring-2 ring-white ring-offset-1 mt-1 shrink-0`} />
                                            {i < 2 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                                        </div>
                                        <div className="flex-1 min-w-0 pb-1">
                                            <p className="text-sm font-semibold text-slate-800">{item.icon} {item.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}
