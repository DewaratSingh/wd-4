"use client";

import { AlertTriangle, ArrowRight, Clock } from "lucide-react";

interface Complaint {
    id: number;
    notes?: string;
    latitude: number;
    longitude: number;
    created_at: string;
    progress: string;
    image_url: string;
    distanceFromMuni?: number;
}

interface ActiveComplaintsProps {
    complaints: Complaint[];
}

export default function ActiveComplaints({ complaints }: ActiveComplaintsProps) {
    // Show only active (not resolved) complaints, max 3
    const activeComplaints = complaints
        .filter(c => c.progress !== 'Resolved')
        .slice(0, 3);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">My Active Complaints</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {activeComplaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No active complaints found in your area.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeComplaints.map((complaint) => (
                        <div key={complaint.id} className="border border-l-4 border-l-amber-500 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                            {complaint.notes || "Reported Issue"}
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Reported {new Date(complaint.created_at).toLocaleDateString()} • Ticket #{complaint.id}
                                        </p>
                                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                            {complaint.progress || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">
                                    High
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                                <div className="w-2/3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-3/5 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Estimated: 2 Days
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
