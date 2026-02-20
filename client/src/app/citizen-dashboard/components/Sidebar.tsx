"use client";

import {
    Bell, ClipboardList, Home, Map as MapIcon, Users,
    LogOut, User, Zap, ChevronRight, Shield
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
    { icon: Home, label: "Home", href: "/citizen-dashboard" },
    { icon: ClipboardList, label: "My Complaints", href: "/citizen-dashboard?view=my-complaints" },
    { icon: MapIcon, label: "City Map", href: "/dashboard/map" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const cu = localStorage.getItem("currentUser");
        const mu = localStorage.getItem("municipalUser");
        if (cu) setUser(JSON.parse(cu));
        else if (mu) setUser(JSON.parse(mu));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("municipalUser");
        router.push("/user/login");
    };

    const getInitials = (name: string) => {
        if (!name) return "U";
        const p = name.trim().split(" ");
        return p.length >= 2
            ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const trustScore = 92;
    const initials = user ? getInitials(user.username || user.name || "User") : "U";
    const displayName = user?.username || user?.name || "Guest User";
    const citizenId = user?.id
        ? `MUM-${String(user.id).padStart(4, "0")}-${(user.email ?? "XX").substring(0, 2).toUpperCase()}`
        : "N/A";

    const isActive = (href: string) =>
        pathname === href ||
        (href !== "/citizen-dashboard" && pathname?.startsWith(href.split("?")[0]));

    return (
        <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 p-5 gap-4 shrink-0">

            {/* ── PROFILE CARD ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden"
                style={{ background: "linear-gradient(140deg,#1e1b4b 0%,#312e81 55%,#4338ca 100%)" }}
            >
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                {/* Glow blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/25 blur-[60px] pointer-events-none" />

                <div className="relative z-10 px-6 pt-7 pb-6 flex flex-col items-center text-center">

                    {/* Avatar */}
                    <div className="relative mb-3">
                        <div
                            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-xl font-black text-white"
                            style={{
                                background: "linear-gradient(135deg,#818cf8,#7c3aed)",
                                boxShadow: "0 8px 24px rgba(99,102,241,0.45), 0 0 0 4px rgba(255,255,255,0.08)",
                            }}
                        >
                            {initials}
                        </div>
                        {/* Online indicator */}
                        <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-[2.5px] border-[#1e1b4b]" />
                    </div>

                    <h2 className="text-[15px] font-extrabold text-white tracking-tight leading-tight">
                        {displayName}
                    </h2>
                    <p className="text-[10px] font-mono text-indigo-300/80 mt-0.5">
                        Citizen ID: {citizenId}
                    </p>

                    {/* Trust Score bar */}
                    <div className="w-full mt-5 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-200">
                                    Trust Score
                                </span>
                            </div>
                            <span className="text-[13px] font-black text-white leading-none">
                                {trustScore}
                                <span className="text-indigo-400 text-[10px] font-semibold">/100</span>
                            </span>
                        </div>
                        <div className="w-full h-[6px] rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${trustScore}%` }}
                                transition={{ duration: 1.1, delay: 0.45, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg,#818cf8,#f97316)" }}
                            />
                        </div>
                        <p className="text-[9px] text-indigo-400/70 mt-1.5 text-right font-semibold tracking-wide">
                            Excellent · Top 8%
                        </p>
                    </div>

                    {/* View Profile */}
                    <button
                        onClick={() => router.push("/profile")}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90"
                        style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        <User className="w-3.5 h-3.5 text-indigo-300" />
                        View Profile
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />
                    </button>
                </div>
            </motion.div>

            {/* ── NAVIGATION ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3"
            >
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 px-3 mb-2 pt-1">
                    Navigation
                </p>

                <nav className="space-y-0.5">
                    {menuItems.map((item, i) => {
                        const active = isActive(item.href);
                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.18 + i * 0.06 }}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                                    style={
                                        active
                                            ? {
                                                background: "linear-gradient(135deg,#4338ca,#6366f1)",
                                                color: "#fff",
                                                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                                            }
                                            : { color: "#475569" }
                                    }
                                    onMouseEnter={(e) => {
                                        if (!active) (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) (e.currentTarget as HTMLElement).style.background = "";
                                    }}
                                >
                                    {/* Icon wrapper */}
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={
                                            active
                                                ? { background: "rgba(255,255,255,0.2)" }
                                                : { background: "#f1f5f9" }
                                        }
                                    >
                                        <item.icon
                                            className="w-4 h-4"
                                            style={{ color: active ? "#fff" : "#94a3b8" }}
                                        />
                                    </div>

                                    <span className="flex-1">{item.label}</span>

                                    {active && (
                                        <ChevronRight
                                            className="w-3.5 h-3.5 shrink-0"
                                            style={{ color: "rgba(255,255,255,0.65)" }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>
            </motion.div>

            {/* ── VERIFIED BADGE ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="rounded-2xl border border-amber-200 p-4 flex items-center gap-3"
                style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)" }}
            >
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                    <Shield className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                    <p className="text-[11px] font-extrabold text-amber-900 leading-tight">Verified Citizen</p>
                    <p className="text-[10px] text-amber-600 mt-0.5">Govt. ID Linked · MoHUA</p>
                </div>
            </motion.div>

            {/* ── LOGOUT ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="mt-auto"
            >
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 border border-transparent transition-all hover:bg-red-50 hover:border-red-100"
                >
                    <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                        <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    Logout Session
                </button>
            </motion.div>

        </aside>
    );
}
