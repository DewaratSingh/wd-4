'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, RefreshCw } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        municipal_name: '',
        latitude: '',
        longitude: '',
        radius: ''
    });
    const [locating, setLocating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString()
                }));
                setLocating(false);
            },
            (err) => {
                setError('Failed to get location: ' + err.message);
                setLocating(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Auto-login (store user) or redirect to signin
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
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-blue-400 text-center">Municipal Registration</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" placeholder="Full Name" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />
                    <input name="municipal_name" placeholder="Municipal Name" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />

                    <div className="flex gap-2">
                        <input name="latitude" placeholder="Lat" value={formData.latitude} readOnly className="w-1/3 bg-gray-700 p-3 rounded" />
                        <input name="longitude" placeholder="Lon" value={formData.longitude} readOnly className="w-1/3 bg-gray-700 p-3 rounded" />
                        <button type="button" onClick={getCurrentLocation} className="w-1/3 bg-blue-600 rounded flex items-center justify-center">
                            {locating ? <RefreshCw className="animate-spin" /> : <MapPin />}
                        </button>
                    </div>

                    <input name="radius" type="number" placeholder="Jurisdiction Radius (km)" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded" />

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-500 p-3 rounded font-bold">
                        {submitting ? 'Registering...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-gray-400 text-sm">
                        Already have an account? <a href="/signin" className="text-blue-400">Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
