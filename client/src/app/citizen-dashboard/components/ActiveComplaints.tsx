"use client";

import { AlertTriangle, ArrowRight, Clock, Trash2 } from "lucide-react";

export default function ActiveComplaints() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">My Active Complaints</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="border border-l-4 border-l-amber-500 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                Pothole on MG Road near Bus Stop 4
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                                Reported 3 days ago • Ward 14 • Ticket #8821
                            </p>
                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                In Progress
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
<<<<<<< HEAD
            </div>

            {/* Complaint Item 2 - Garbage */}
            <div className="border border-l-4 border-l-gray-300 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white group mt-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-50 text-green-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                Garbage not collected for 4 days
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                                Reported yesterday • Ward 14 • Ticket #8901
                            </p>
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                Submitted
                            </span>
                        </div>
                    </div>
                    {/* No High Priority Badge for this one based on image, or maybe "Normal"? Image doesn't show one clearly, but let's leave it out or add a 'Medium' if needed. The previous one had 'High'. Leaving blank for now as image implies standard. */}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="w-2/3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 w-1/5 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Assigning Team...
                    </div>
                </div>
            </div>
=======
            )}
>>>>>>> ba474d32bf2565b408a472594d8633b667128599
        </div>
    );
}
