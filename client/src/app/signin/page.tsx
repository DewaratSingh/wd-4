'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Shield, Mail, Lock, ArrowRight, Loader2,
    Eye, EyeOff, Star, MapPin, CheckCircle2, Clock
} from 'lucide-react';

/* ─── Google Icon ──────────────────────────────────────────── */
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
);

export default function SigninPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('http://localhost:3000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('municipalUser', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error || 'Signin failed');
            }
        } catch {
            setError('Failed to connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* ══════════════════════════════════════════
                LEFT PANEL — Dark
            ══════════════════════════════════════════ */}
            <div
                className="hidden md:flex md:w-[45%] relative overflow-hidden flex-col justify-between p-10"
                style={{ background: 'linear-gradient(160deg, #0D0F2B 0%, #0A0C22 60%, #130820 100%)' }}
            >
                {/* Blobs */}
                <div className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, transparent 65%)', filter: 'blur(70px)' }} />
                <div className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 65%)', filter: 'blur(80px)' }} />
                {/* Dot grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

                <div className="relative z-10 flex flex-col h-full">

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4F46E5 100%)' }}>
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">NagarSeva</span>
                    </motion.div>

                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-16"
                    >
                        <h1 className="text-4xl font-black text-white leading-tight">Fix Your City.</h1>
                        <h1 className="text-4xl font-black leading-tight mb-5" style={{ color: '#FF6B35' }}>One Tap.</h1>
                        <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: '#94A3B8' }}>
                            Join the fastest growing civic tech platform.{' '}
                            <span style={{ color: '#FF6B35' }}>Report issues</span>,{' '}
                            <span style={{ color: '#4F46E5' }} className="text-indigo-400">track progress</span>, and{' '}
                            <span style={{ color: '#FF6B35' }}>build</span> a better community together.
                        </p>
                    </motion.div>

                    {/* Live Feed Mockup Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mt-8 rounded-2xl overflow-hidden border"
                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#64748B' }}>Live_Feed_jane</span>
                        </div>
                        {/* Feed Items */}
                        <div className="p-4 space-y-3">
                            {/* Item 1 */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(79,70,229,0.2)' }}>
                                        <span className="text-[10px]">🙋</span>
                                    </div>
                                    <div className="h-2 w-28 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#10B981', background: 'rgba(16,185,129,0.12)' }}>
                                    Resolved
                                </span>
                            </motion.div>
                            {/* Item 2 */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,107,53,0.2)' }}>
                                        <span className="text-[10px]">⚠️</span>
                                    </div>
                                    <div className="h-2 w-36 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#FF6B35', background: 'rgba(255,107,53,0.12)' }}>
                                    In Progress
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Stat chips — pinned to bottom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-auto flex flex-wrap items-center gap-4 pt-6"
                    >
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#CBD5E1' }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            124K+ Issues Resolved
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#CBD5E1' }}>
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            4.8 Rating
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#CBD5E1' }}>
                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                            47 Cities
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                RIGHT PANEL — Light
            ══════════════════════════════════════════ */}
            <div className="w-full md:w-[55%] flex flex-col items-center justify-center p-6 md:p-12 relative"
                style={{ background: '#EEF2F7' }}>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                >
                    {/* Top accent bar */}
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4F46E5 100%)' }} />

                    <div className="px-8 py-8">

                        {/* Badge */}
                        <div className="flex justify-center mb-5">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border"
                                style={{ color: '#4F46E5', background: 'rgba(79,70,229,0.06)', borderColor: 'rgba(79,70,229,0.18)' }}>
                                🔐 Secure Access
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Sign in to your NagarSeva account to{' '}
                                <span className="font-semibold" style={{ color: '#4F46E5' }}>continue</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-slate-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="citizen@nagar.com"
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-slate-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15"
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1.5">
                                    <a href="#" className="text-xs font-medium hover:underline" style={{ color: '#4F46E5' }}>
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-lg border border-red-100 flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-11 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(90deg, #FF6B35 0%, #f97316 100%)',
                                    boxShadow: '0 4px 16px rgba(255,107,53,0.28)',
                                }}
                            >
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                                ) : (
                                    <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                                )}
                            </motion.button>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">or continue with</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Google */}
                            <button type="button"
                                className="w-full h-10 flex items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:shadow-sm transition-all">
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            {/* Sign up link */}
                            <p className="text-center text-slate-500 text-xs">
                                Don't have an account?{' '}
                                <Link href="/signup" className="font-bold hover:underline" style={{ color: '#4F46E5' }}>
                                    Create Account
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>

                {/* Footer links */}
                <p className="mt-6 text-xs text-slate-400 flex items-center gap-2">
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                </p>
            </div>
        </div>
    );
}
