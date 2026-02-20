"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
    const router = useRouter();

    const notifications = [
        {
            id: 1,
            type: "success",
            icon: CheckCircle,
            title: "Complaint Resolved",
            message: "Your complaint #1234 about pothole on MG Road has been marked as resolved.",
            time: "2 hours ago",
            read: false
        },
        {
            id: 2,
            type: "info",
            icon: Info,
            title: "Status Update",
            message: "Your complaint #1235 is now in progress. Municipal team has been assigned.",
            time: "5 hours ago",
            read: false
        },
        {
            id: 3,
            type: "warning",
            icon: AlertCircle,
            title: "Similar Issue Reported",
            message: "3 other citizens reported a similar issue near your location.",
            time: "1 day ago",
            read: true
        },
        {
            id: 4,
            type: "info",
            icon: Clock,
            title: "Complaint Received",
            message: "Your complaint #1236 has been received and is under review.",
            time: "2 days ago",
            read: true
        }
    ];

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "success":
                return "bg-green-50 text-green-600 border-green-200";
            case "warning":
                return "bg-yellow-50 text-yellow-600 border-yellow-200";
            case "info":
                return "bg-blue-50 text-blue-600 border-blue-200";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-sm text-gray-500">Stay updated on your complaints</p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Unread Count */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Bell size={16} />
                        <span>
                            You have <span className="font-bold text-blue-600">
                                {notifications.filter(n => !n.read).length}
                            </span> unread notifications
                        </span>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.map((notification, index) => {
                        const Icon = notification.icon;
                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer ${
                                    notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="font-bold text-gray-900">{notification.title}</h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                        <span className="text-xs text-gray-500">{notification.time}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty State (if no notifications) */}
                {notifications.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications yet</h3>
                        <p className="text-gray-500">
                            You'll see updates about your complaints here
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
