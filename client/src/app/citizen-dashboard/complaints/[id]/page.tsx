"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import { MessageSquare, MapPin, Clock, CheckCircle2, AlertCircle, Calendar, ThumbsUp, BarChart3 } from "lucide-react";

interface Complaint {
    id: number;
    image_url: string;
    notes: string;
    phone: string;
    latitude: number;
    longitude: number;
    created_at: string;
    progress: string;
    resolved_text?: string;
    resolved_image_url?: string;
    upvotes: number;
    priority_score: number;
}

export default function UserComplaintsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchUserComplaints();
        }
    }, [id]);

    const fetchUserComplaints = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/user-complaints/${id}`);
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            } else {
                setError(data.error || "Failed to load complaints");
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Pending': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Resolved': return <CheckCircle2 className="w-4 h-4" />;
            case 'In Progress': return <Clock className="w-4 h-4" />;
            case 'Pending': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="max-w-[1600px] mx-auto flex pt-4">
                <Sidebar />

                <main className="flex-1 px-4 lg:px-8 pb-12 overflow-x-hidden">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Your Complaints</h1>
                                <p className="text-gray-500 text-sm mt-1">Track and manage all your reports in one place</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">{complaints.length} Total Reports</span>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center p-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                <p>{error}</p>
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">No complaints found</h3>
                                    <p className="text-gray-500">You haven't reported any issues yet.</p>
                                </div>
                                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                    Report an Issue
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {complaints.map((complaint) => (
                                    <motion.div
                                        key={complaint.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                                    >
                                        {/* Image Header */}
                                        <div className="relative h-48 w-full group overflow-hidden">
                                            <img
                                                src={complaint.image_url}
                                                alt="Complaint"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shadow-sm ${getStatusColor(complaint.progress)}`}>
                                                    {getStatusIcon(complaint.progress)}
                                                    {complaint.progress || 'Pending'}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-gray-900 flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-blue-600" />
                                                {new Date(complaint.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col space-y-4">
                                            <p className="text-gray-700 text-sm line-clamp-3 italic">
                                                "{complaint.notes || 'No description provided'}"
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                                    <span className="truncate">{complaint.latitude}, {complaint.longitude}</span>
                                                </div>
                                            </div>

                                            {/* Footer Stats */}
                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <ThumbsUp className="w-4 h-4 text-blue-600" />
                                                        <span className="text-xs font-bold">{complaint.upvotes || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.2 text-gray-600">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Priority Score:</span>
                                                        <span className="text-xs font-bold ml-1 text-orange-600">{complaint.priority_score || 0}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/citizen-dashboard/complaint/${complaint.id}`)}
                                                    className="text-blue-600 text-xs font-bold hover:underline"
                                                >
                                                    View Details
                                                </button>
                                            </div>

                                            {/* Resolution Message */}
                                            {complaint.progress === 'Resolved' && (
                                                <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100">
                                                    <h4 className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Resolution Update</h4>
                                                    <p className="text-xs text-green-800 line-clamp-2">{complaint.resolved_text || 'Issue has been successfully addressed.'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
