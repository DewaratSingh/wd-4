'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MapPin, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function AllComplaintsPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/all-complaints');
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress':
            case 'Work in Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Rejected':
            case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-red-100 text-red-700 border-red-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Resolved': return <CheckCircle size={14} />;
            case 'In Progress':
            case 'Work in Progress': return <Clock size={14} />;
            case 'Closed': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-gray-800">Complaints Database</h3>
                        <p className="text-sm text-gray-500">Total {complaints.length} records found</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading complaints...</div>
                ) : complaints.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No complaints found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Category/Dept</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {complaints.map((complaint) => (
                                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{complaint.id}</td>
                                        <td className="px-6 py-4 text-gray-600 flex flex-col justify-center">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(complaint.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-tight">{complaint.category || 'Other'}</span>
                                                <span className="text-[10px] text-gray-500">{complaint.department || 'General Admin'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-gray-800 font-medium" title={complaint.notes}>
                                                {complaint.notes || "No description provided"}
                                            </div>
                                            {complaint.latitude && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                    <MapPin size={10} />
                                                    {Number(complaint.latitude).toFixed(4)}, {Number(complaint.longitude).toFixed(4)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.progress || 'Pending')}`}>
                                                {getStatusIcon(complaint.progress || 'Pending')}
                                                {complaint.progress || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => router.push(`/dashboard/complaint/${complaint.id}`)}
                                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
