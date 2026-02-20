"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function UserLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                router.push("/citizen-dashboard");
            } else {
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch {
            setError("Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fade = (i: number) => ({
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } },
    });

    return (
        <div className="min-h-screen flex overflow-hidden">

            {/* ── LEFT BRAND PANEL ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="hidden lg:flex lg:w-[40%] flex-col justify-between relative overflow-hidden"
                style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)" }}
            >
                {/* Glows */}
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-500/20 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-400/15 blur-[80px] pointer-events-none" />
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                {/* Rings */}
                <div className="absolute bottom-28 right-0 translate-x-1/2 w-[480px] h-[480px] rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute bottom-28 right-0 translate-x-1/2 w-[340px] h-[340px] rounded-full border border-white/8 pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 px-10 pt-10">
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibrant-orange to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-white tracking-tight">NagarSeva</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold text-orange-300 bg-orange-500/20 rounded-full border border-orange-400/30 tracking-wider">BETA</span>
                    </div>
                    <p className="text-indigo-300 text-[11px] font-semibold tracking-[0.2em] uppercase">Smart City Mission</p>
                </div>

                {/* Headline + Benefits */}
                <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                        <h1 className="text-5xl font-black leading-[1.05] mb-4">
                            <span className="text-white">Welcome</span><br />
                            <span className="text-vibrant-orange">Back.</span>
                        </h1>
                        <p className="text-indigo-200 text-sm leading-relaxed mb-8 max-w-xs">
                            Your city needs you. Sign in to track complaints, view updates, and keep your ward accountable.
                        </p>
                        <ul className="space-y-4">
                            {["Report issues in 60 seconds", "Real-time resolution tracking", "47 Smart Cities onboarded"].map((item, i) => (
                                <motion.li key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-success-emerald/20 border border-success-emerald/40 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-success-emerald" />
                                    </div>
                                    <span className="text-indigo-100 text-sm font-medium">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Stat Cards + Footer */}
                <div className="relative z-10 px-10 pb-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="grid grid-cols-2 gap-4 mb-8">
                        {[{ icon: "📊", label: "IMPACT", value: "124K+", sub: "Issues Resolved" }, { icon: "❤️", label: "TRUST", value: "89%", sub: "Citizen Satisfaction" }].map((s) => (
                            <div key={s.label} className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="text-sm">{s.icon}</span>
                                    <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">{s.label}</span>
                                </div>
                                <div className="text-2xl font-black text-white">{s.value}</div>
                                <div className="text-xs text-indigo-300 mt-0.5">{s.sub}</div>
                            </div>
                        ))}
                    </motion.div>
                    <p className="text-indigo-400 text-[11px]">© 2024 NagarSeva Foundation. Partnered with MoHUA.</p>
                </div>
            </motion.div>

            {/* ── RIGHT FORM PANEL ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen py-12 px-6 md:px-12 relative"
            >
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{ backgroundImage: "linear-gradient(#4F46E5 1px,transparent 1px),linear-gradient(90deg,#4F46E5 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vibrant-orange to-amber-400 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-extrabold text-slate-900">NagarSeva</span>
                </div>

                <div className="relative z-10 w-full max-w-[400px]">

                    {/* Heading */}
                    <motion.div variants={fade(0)} initial="hidden" animate="visible" className="mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
                        <p className="text-slate-500 mt-1.5 text-sm">Welcome back — your city is waiting</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <motion.div variants={fade(1)} initial="hidden" animate="visible" className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                name="email" type="email" placeholder="Email Address" required
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-indigo/30 focus:border-electric-indigo transition-all"
                            />
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={fade(2)} initial="hidden" animate="visible" className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                name="password" type={showPassword ? "text" : "password"} placeholder="Password" required
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-indigo/30 focus:border-electric-indigo transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </motion.div>

                        {/* Forgot password */}
                        <motion.div variants={fade(3)} initial="hidden" animate="visible" className="flex justify-end">
                            <Link href="/user/forgot-password" className="text-xs text-electric-indigo font-semibold hover:underline">
                                Forgot password?
                            </Link>
                        </motion.div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />{error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* CTA */}
                        <motion.div variants={fade(4)} initial="hidden" animate="visible">
                            <button type="submit" disabled={loading}
                                className="group relative w-full flex items-center justify-center gap-2 h-[52px] rounded-full font-bold text-white text-sm overflow-hidden transition-all duration-300 shadow-lg shadow-vibrant-orange/30 hover:shadow-vibrant-orange/50 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(90deg, #FF6B35, #f97316)" }}>
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" />Signing In...</>
                                ) : (
                                    <><span>Sign In</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Footer */}
                    <motion.div variants={fade(5)} initial="hidden" animate="visible" className="text-center mt-6 space-y-2">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/user/signup" className="text-electric-indigo font-bold hover:underline">Create one</Link>
                        </p>
                        <p className="text-xs text-slate-400">Free to use · No spam · Govt-verified</p>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                            <Lock className="w-3 h-3 text-success-emerald" />
                            <span>256-bit encrypted · Privacy-first</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}