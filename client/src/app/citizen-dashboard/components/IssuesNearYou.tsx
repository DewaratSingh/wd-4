"use client";

import { AlertCircle, Dog, Droplets, MapPin, ThumbsUp } from "lucide-react";

interface Complaint {
    id: number;
    notes?: string;
    latitude: number;
    longitude: number;
    upvotes: number;
    created_at: string;
    progress: string;
    image_url: string;
    distanceFromMuni?: number;
}

interface IssuesNearYouProps {
    complaints: Complaint[];
    radius?: number;
}

export default function IssuesNearYou({ complaints, radius = 2 }: IssuesNearYouProps) {
    const handleUpvote = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            const user = JSON.parse(localStorage.getItem('municipalUser') || '{}');
            const res = await fetch(`http://localhost:3000/api/complaint/${id}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id })
            });
            const data = await res.json();
            if (data.success) {
                // Signal global refresh
                window.dispatchEvent(new Event('refresh-data'));
            } else {
                alert(data.error || "Already upvoted or failed");
            }
        } catch (err) {
            console.error("Upvote error:", err);
        }
    };

    const issues = complaints.slice(0, 3).map(c => ({
        id: c.id,
        icon: AlertCircle,
        color: c.progress === 'Resolved' ? "text-green-500" : "text-red-500",
        bg: c.progress === 'Resolved' ? "bg-green-50" : "bg-red-50",
        title: c.notes || "Reported Issue",
        location: `${c.distanceFromMuni?.toFixed(1) || '0.0'} km away`,
        time: new Date(c.created_at).toLocaleDateString(),
        upvotes: c.upvotes || 0,
        status: c.progress || "Pending",
        statusColor: c.progress === 'Resolved' ? "text-green-600" : "text-amber-600",
    }));

    return (
        <div className="pt-2">
            <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Issues Near You
                </h3>
                <span className="text-xs text-gray-500">Result within {radius}km radius</span>
            </div>

            {issues.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No issues found nearby.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg ${issue.bg} ${issue.color}`}>
                                    <issue.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">{issue.time}</span>
                            </div>

                            <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug line-clamp-2">{issue.title}</h4>
                            <p className="text-xs text-gray-500 mb-4">{issue.location}</p>

                            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-auto">
                                <button
                                    onClick={(e) => handleUpvote(e, issue.id)}
                                    className="flex items-center gap-1.5 text-gray-500 text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{issue.upvotes}</span>
                                </button>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-gray-50 ${issue.statusColor}`}>
                                    • {issue.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
