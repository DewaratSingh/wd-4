"use client";

import { AlertCircle, Dog, Droplets, MapPin, ThumbsUp } from "lucide-react";

const issues = [
    {
        icon: AlertCircle,
        color: "text-red-500",
        bg: "bg-red-50",
        title: "Leaking Hydrant at Market St.",
        location: "Near Vegetable Market",
        time: "2h ago",
        upvotes: 12,
        status: "Verified",
        statusColor: "text-green-600",
    },
    {
        icon: Dog,
        color: "text-purple-500",
        bg: "bg-purple-50",
        title: "Stray Dog Pack Aggressive",
        location: "Sector 4 Park",
        time: "5h ago",
        upvotes: 28,
        status: "High Priority",
        statusColor: "text-amber-600",
    },
    {
        icon: Droplets,
        color: "text-blue-500",
        bg: "bg-blue-50",
        title: "Low Water Pressure",
        location: "Azad Nagar Housing",
        time: "1d ago",
        upvotes: 45,
        status: "Investigating",
        statusColor: "text-blue-600",
    },
];

export default function IssuesNearYou() {
    return (
        <div className="pt-2">
            <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Issues Near You
                </h3>
                <span className="text-xs text-gray-500">Andheri West (2km radius)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {issues.map((issue, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${issue.bg} ${issue.color}`}>
                                <issue.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{issue.time}</span>
                        </div>

                        <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{issue.title}</h4>
                        <p className="text-xs text-gray-500 mb-4">{issue.location}</p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium group cursor-pointer hover:text-blue-600">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{issue.upvotes}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-gray-50 ${issue.statusColor}`}>
                                • {issue.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
