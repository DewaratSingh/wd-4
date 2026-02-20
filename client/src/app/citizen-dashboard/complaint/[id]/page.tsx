'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, FileText, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { motion } from 'framer-motion';

export default function CitizenComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}`);
            const data = await res.json();
            if (data.success) {
                setComplaint(data.complaint);
            }
        } catch (err) {
            console.error("Error fetching complaint:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
                    <p className="text-gray-500 mb-6">The complaint you're looking for doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="max-w-[1600px] mx-auto flex pt-4">
                <Sidebar />

                <main className="flex-1 px-4 lg:px-8 pb-12 overflow-x-hidden pt-16 lg:pt-0">
                    <div className="max-w-4xl mx-auto py-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition font-medium group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </button>

                        <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8">
                            {/* Left: Product Image & Badges */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-gray-100 shadow-blue-100"
                                >
                                    <img
                                        src={complaint.image_url}
                                        alt="Complaint"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-4 right-4 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-white/20 ${complaint.progress === 'Resolved' ? 'bg-green-600/90' :
                                        complaint.progress === 'Work in Progress' ? 'bg-yellow-600/90' :
                                            complaint.progress === 'Closed' ? 'bg-gray-600/90' : 'bg-red-600/90'
                                        }`}>
                                        {complaint.progress || 'Pending'}
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Calendar size={14} /> Created On
                                        </div>
                                        <p className="text-gray-900 font-semibold">{new Date(complaint.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Clock size={14} /> ID
                                        </div>
                                        <p className="text-gray-900 font-semibold">#{complaint.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Info Section */}
                            <div className="w-full lg:w-1/2 flex flex-col">
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Issue Details</h1>
                                    <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-2"></div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                                            <FileText size={16} /> User Notes
                                        </div>
                                        <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                            {complaint.notes}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase tracking-wider">
                                            <Phone size={16} /> Contact Phone
                                        </div>
                                        <p className="text-gray-900 font-semibold text-lg flex items-center gap-2 px-4 py-2 bg-green-50/50 rounded-2xl border border-green-100 w-fit">
                                            <span>{complaint.phone.slice(0, 2)}******{complaint.phone.slice(-2)}</span>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 uppercase font-bold">Masked</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
                                            <MapPin size={16} /> Geo Location
                                        </div>
                                        <div className="px-4 py-3 bg-red-50/50 rounded-2xl border border-red-100">
                                            <p className="text-gray-900 font-semibold mb-2">{complaint.latitude}, {complaint.longitude}</p>
                                            <a
                                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-bold hover:underline group"
                                            >
                                                Open Google Maps <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resolution Proof Card (If available) */}
                        {(complaint.resolved_text || complaint.resolved_image_url) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-emerald-100 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Resolution Status</h2>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="lg:w-3/5 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Welfare Officer Notes</label>
                                                <p className="text-gray-700 leading-relaxed text-lg bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 italic">
                                                    "{complaint.resolved_text || 'Issue has been successfully resolved based on municipal guidelines.'}"
                                                </p>
                                            </div>

                                            {complaint.resolved_latitude && (
                                                <div className="space-y-2">
                                                    <label className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Resolution Location</label>
                                                    <div className="flex items-center justify-between p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100">
                                                        <span className="text-gray-900 font-semibold">{complaint.resolved_latitude.toFixed(4)}, {complaint.resolved_longitude.toFixed(4)}</span>
                                                        <a
                                                            href={`https://www.google.com/maps?q=${complaint.resolved_latitude},${complaint.resolved_longitude}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                                                        >
                                                            <MapPin size={12} /> View Proof Trace
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {complaint.resolved_image_url && (
                                            <div className="lg:w-2/5">
                                                <label className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-2 block text-center lg:text-left">Proof of Resolution</label>
                                                <div className="rounded-2xl overflow-hidden border-4 border-emerald-50 shadow-md aspect-square bg-gray-100">
                                                    <img
                                                        src={complaint.resolved_image_url}
                                                        alt="Resolution Proof"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
