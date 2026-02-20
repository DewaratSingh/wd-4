"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Clock, Zap, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface Complaint {
    id: number;
    notes?: string;
    progress: string;
    priority_score: number;
    upvotes: number;
    created_at: string;
    image_url: string;
    latitude: number;
    longitude: number;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    Resolved: { bg: "bg-green-100", text: "text-green-700", border: "border-l-green-500" },
    "Work in Progress": { bg: "bg-amber-100", text: "text-amber-700", border: "border-l-amber-500" },
    Accepted: { bg: "bg-blue-100", text: "text-blue-700", border: "border-l-blue-500" },
    Closed: { bg: "bg-gray-100", text: "text-gray-600", border: "border-l-gray-400" },
    Pending: { bg: "bg-red-50", text: "text-red-600", border: "border-l-red-400" },
};

const PRIORITY_BADGE: Record<string, string> = {
    Critical: "bg-red-100 text-red-600",
    High: "bg-orange-100 text-orange-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600",
};

function getPriorityLabel(score: number) {
    if (score >= 75) return "Critical";
    if (score >= 50) return "High";
    if (score >= 25) return "Medium";
    return "Low";
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
}

export default function ActiveComplaints() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/api/all-complaints")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    // Show top 3 by priority_score, exclude resolved
                    const active = data.complaints
                        .filter((c: Complaint) => c.progress !== "Resolved" && c.progress !== "Closed")
                        .slice(0, 3);
                    setComplaints(active);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const status = (s: string) => STATUS_STYLES[s] || STATUS_STYLES["Pending"];

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
                // Update local state
                setComplaints(prev => prev.map(c => c.id === id ? { ...c, upvotes: data.upvotes } : c));
                // Signal charts to refresh
                window.dispatchEvent(new Event('refresh-data'));
            } else {
                alert(data.error || "Failed to upvote");
            }
        } catch (err) {
            console.error("Upvote error:", err);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-gray-900">Active Complaints</h3>
                <button
                    onClick={() => router.push("/citizen-dashboard/all-complaints")}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {loading && (
                <div className="text-sm text-gray-400 text-center py-6 animate-pulse">Loading complaints...</div>
            )}

            {!loading && complaints.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-6">No active complaints right now 🎉</div>
            )}

            <div className="space-y-3">
                {complaints.map((c) => {
                    const s = status(c.progress);
                    const priorityLabel = getPriorityLabel(Number(c.priority_score));
                    const score = Number(c.priority_score);

                    return (
                        <div
                            key={c.id}
                            onClick={() => router.push(`/citizen-dashboard/complaint/${c.id}`)}
                            className={`border border-l-4 ${s.border} rounded-xl p-4 hover:shadow-md transition-all cursor-pointer bg-white group`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 text-sm">
                                            {c.notes || "Reported Issue"}
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {timeAgo(c.created_at)} • #{c.id}
                                        </p>
                                        <span className={`inline-block px-2 py-0.5 ${s.bg} ${s.text} text-[10px] font-bold rounded uppercase tracking-wider`}>
                                            {c.progress || "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {score > 0 && (
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${PRIORITY_BADGE[priorityLabel]}`}>
                                            {priorityLabel}
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                            <Zap className="w-3 h-3" />{score}/100
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Priority bar & Upvote */}
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3 gap-3">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${score >= 75 ? 'bg-red-500' :
                                            score >= 50 ? 'bg-orange-500' :
                                                score >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${score}%` }}
                                    />
                                </div>
                                <button
                                    onClick={(e) => handleUpvote(e, c.id)}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-bold"
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{c.upvotes}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
