"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Eye, Wrench, CheckCircle2, Clock, MapPin } from "lucide-react";

interface JourneyTimelineProps {
    complaint: {
        created_at: string;
        accepted_at?: string;
        in_progress_at?: string;
        resolved_at?: string;
        progress: string;
    };
}

export default function JourneyTimeline({ complaint }: JourneyTimelineProps) {
    const stages = [
        {
            id: "reported",
            label: "Reported",
            icon: Camera,
            time: complaint.created_at,
            isActive: true,
            isCompleted: !!complaint.accepted_at || !!complaint.in_progress_at || !!complaint.resolved_at || complaint.progress !== "Pending",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            accent: "bg-blue-500",
        },
        {
            id: "acknowledged",
            label: "Acknowledged",
            icon: Eye,
            time: complaint.accepted_at,
            isActive: !!complaint.accepted_at || complaint.progress === "Accepted",
            isCompleted: !!complaint.in_progress_at || !!complaint.resolved_at || (complaint.progress !== "Pending" && complaint.progress !== "Accepted"),
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            accent: "bg-purple-500",
        },
        {
            id: "progress",
            label: "In Progress",
            icon: Wrench,
            time: complaint.in_progress_at,
            isActive: !!complaint.in_progress_at || complaint.progress === "Work in Progress",
            isCompleted: !!complaint.resolved_at || complaint.progress === "Resolved" || complaint.progress === "Closed",
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            accent: "bg-amber-500",
        },
        {
            id: "resolved",
            label: "Resolved",
            icon: CheckCircle2,
            time: complaint.resolved_at,
            isActive: !!complaint.resolved_at || complaint.progress === "Resolved" || complaint.progress === "Closed",
            isCompleted: !!complaint.resolved_at || complaint.progress === "Resolved" || complaint.progress === "Closed",
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            accent: "bg-emerald-500",
        },
    ];

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return null;
        const date = new Date(timeStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 w-full mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock size={16} />
                </div>
                Citizen Journey Tracking
            </h3>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-100 lg:left-0 lg:right-0 lg:top-[23px] lg:bottom-auto lg:h-0.5 lg:w-full"></div>

                <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                    {stages.map((stage, index) => {
                        const Icon = stage.icon;
                        const formattedTime = formatTime(stage.time);
                        const isCurrent = stage.isActive && !stage.isCompleted;

                        return (
                            <div key={stage.id} className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3 flex-1">
                                {/* Icon Container */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${stage.isCompleted || stage.isActive
                                        ? `${stage.bgColor} ${stage.color} border-white shadow-lg`
                                        : "bg-white text-gray-300 border-gray-100"
                                        }`}
                                >
                                    {stage.isCompleted && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                    )}
                                    <Icon size={22} className={isCurrent ? "animate-bounce" : ""} />

                                    {/* Progress Line Extension for active/completed */}
                                    {stage.isActive && index < stages.length - 1 && (
                                        <motion.div
                                            className={`hidden lg:block absolute left-full top-[21px] h-0.5 z-[-1] ${stage.accent}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: "calc(100% + 2rem)" }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        />
                                    )}
                                </motion.div>

                                {/* Content */}
                                <div className="text-left lg:text-center space-y-1">
                                    <h4 className={`text-sm font-bold tracking-tight uppercase ${stage.isActive || stage.isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                        {stage.label}
                                    </h4>
                                    {formattedTime ? (
                                        <div className="flex items-center lg:justify-center gap-1 text-[10px] text-gray-500 font-medium">
                                            <Clock size={10} />
                                            {formattedTime}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-gray-300 font-medium">Pending...</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Status Message */}
            <div className="mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Clock size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Status Update</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {complaint.progress === 'Resolved'
                            ? "Great news! Your issue has been resolved. Please review the proof below."
                            : complaint.progress === 'Work in Progress'
                                ? "Our ground team is currently addressing your reported issue."
                                : complaint.progress === 'Accepted'
                                    ? "Municipal authorities have acknowledged your report and assigned it to the relevant department."
                                    : "Your report has been received and is waiting for initial review by the control center."}
                    </p>
                </div>
            </div>
        </div>
    );
}
