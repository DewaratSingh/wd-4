'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, Star, Building2 } from 'lucide-react';

/* ─── Google Icon SVG ─────────────────────────────────────────────────── */
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
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

            {/* ═══════════════════════════════════════════
                LEFT PANEL — Dark Decorative
            ═══════════════════════════════════════════ */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: '#07091A' }}>

                {/* Gradient blobs */}
                <div className="absolute top-[-80px] left-[-60px] w-[480px] h-[480px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.55) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute bottom-[-60px] right-[-40px] w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.45) 0%, transparent 70%)', filter: 'blur(70px)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />

                {/* Dot grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4F46E5 100%)' }}>
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">NagarSeva</span>
                    </motion.div>

                    {/* Hero text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="flex-1 flex flex-col justify-center"
                    >
                        <h1 className="text-5xl font-black text-white leading-tight mb-3">
                            Fix Your City.
                        </h1>
                        <h1 className="text-5xl font-black leading-tight mb-6"
                            style={{ color: '#FF6B35' }}>
                            One Tap.
                        </h1>
                        <p className="text-slate-400 text-base leading-relaxed max-w-xs">
                            Join 50,000+ citizens making Indian cities smarter, cleaner, and safer for everyone.
                        </p>

                        {/* Stat chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="flex flex-wrap gap-3 mt-10"
                        >
                            {/* Chip 1 */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                124K+ Issues Resolved
                            </div>
                            {/* Chip 2 */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                4.8 Rating
                            </div>
                            {/* Chip 3 */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                <Building2 className="w-4 h-4 text-indigo-300" />
                                47 Cities
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom wave silhouette */}
                    <div className="relative z-10 mt-8">
                        <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full opacity-20" fill="none">
                            <path d="M0 80 Q 60 30 120 55 Q 180 80 240 45 Q 300 10 360 40 Q 420 70 500 30 L500 80 Z"
                                fill="#4F46E5" />
                            <path d="M0 80 Q 80 50 160 65 Q 240 80 320 55 Q 400 30 500 50 L500 80 Z"
                                fill="#7C3AED" opacity="0.6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                RIGHT PANEL — Light Form
            ═══════════════════════════════════════════ */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12"
                style={{ background: '#F1F4F9' }}>

                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    {/* Top accent bar */}
                    <div className="h-[3px] w-full"
                        style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4F46E5 100%)' }} />

                    <div className="p-8 md:p-10">

                        {/* Badge */}
                        <div className="flex justify-center mb-6">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border"
                                style={{ color: '#4F46E5', background: 'rgba(79,70,229,0.07)', borderColor: 'rgba(79,70,229,0.2)' }}>
                                🔐 Secure Access
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-7">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                            <p className="text-sm text-slate-500 mt-1.5">Sign in to your NagarSeva account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1.5">
                                    <a href="#" className="text-xs font-medium hover:underline"
                                        style={{ color: '#4F46E5' }}>
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-[52px] rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(90deg, #FF6B35 0%, #f97316 100%)',
                                    boxShadow: '0 8px 24px rgba(255,107,53,0.30)',
                                }}
                            >
                                {/* Shimmer */}
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-xs text-slate-400 font-medium">or continue with</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className="w-full h-12 flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:shadow-sm transition-all"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            {/* Footer */}
                            <p className="text-center text-slate-500 text-sm pt-1">
                                Don't have an account?{' '}
                                <Link href="/signup" className="font-semibold hover:underline"
                                    style={{ color: '#4F46E5' }}>
                                    Create Account
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
