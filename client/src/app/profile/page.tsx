"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Award, Edit, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalComplaints: 0,
        resolved: 0,
        pending: 0,
        trustScore: 92
    });

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const municipalUser = localStorage.getItem('municipalUser');
        
        if (currentUser) {
            setUser(JSON.parse(currentUser));
            fetchUserStats(JSON.parse(currentUser).id);
        } else if (municipalUser) {
            setUser(JSON.parse(municipalUser));
        }
    }, []);

    const fetchUserStats = async (userId: number) => {
        try {
            const res = await fetch(`http://localhost:3000/api/user-complaints/${userId}`);
            const data = await res.json();
            if (data.success) {
                const complaints = data.complaints;
                setStats({
                    totalComplaints: complaints.length,
                    resolved: complaints.filter((c: any) => c.progress === 'Resolved').length,
                    pending: complaints.filter((c: any) => c.progress === 'Pending').length,
                    trustScore: 92 // Mock calculation
                });
            }
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-sm text-gray-500">Manage your account information</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                                {getInitials(user.username || user.name || 'User')}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                {user.username || user.name || 'Guest User'}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Citizen ID: {user.id ? `MUM-${String(user.id).padStart(4, '0')}-${user.email?.substring(0, 2).toUpperCase()}` : 'N/A'}
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">Trust Score</span>
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {stats.trustScore}/100
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" 
                                        style={{ width: `${stats.trustScore}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Edit size={16} />
                                Edit Profile
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column - Details & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">{user.username || user.name || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="font-medium text-gray-900">{user.email || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="font-medium text-gray-900">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently joined'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Activity Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Statistics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalComplaints}</div>
                                    <div className="text-xs text-gray-600">Total Complaints</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
                                    <div className="text-xs text-gray-600">Resolved</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                    <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
                                    <div className="text-xs text-gray-600">Pending</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                Achievements
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                    <div className="text-2xl mb-1">🏆</div>
                                    <div className="text-xs font-semibold text-gray-700">Active Citizen</div>
                                    <div className="text-xs text-gray-500">Reported 5+ issues</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                                    <div className="text-2xl mb-1">⭐</div>
                                    <div className="text-xs font-semibold text-gray-700">Trusted Reporter</div>
                                    <div className="text-xs text-gray-500">High trust score</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
