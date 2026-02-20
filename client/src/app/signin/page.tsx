'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const res = await fetch('http://localhost:3000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('municipalUser', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error || 'Signin failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-blue-400 text-center">Municipal Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold">
                        {submitting ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-gray-400 text-sm">
                        Need an account? <a href="/signup" className="text-blue-400">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
