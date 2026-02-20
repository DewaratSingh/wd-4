'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, Phone, ArrowRight, Loader2, MapPin } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        municipal_name: '', // Optional for now, assuming admin registration
        phone: '' // Optional
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Note: Adjust endpoint if you have a specific signup endpoint
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Auto login or redirect to login?
                // For now, redirect to signin
                router.push('/signin');
            } else {
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointing-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-orange-100 blur-3xl opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            NagarSeva
                        </span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-sm text-gray-500 mt-2">Join us to make your city better.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Phone (Optional)"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
