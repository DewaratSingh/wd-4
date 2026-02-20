"use client";

import { Megaphone, ClipboardList, Map as MapIcon, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const actions = [
    {
        icon: Megaphone,
        label: "Report Issue",
        color: "bg-orange-600 text-white",
        hoverColor: "hover:bg-orange-700",
        shadow: "shadow-orange-200",
        href: "/complaint",
    },
    {
        icon: ClipboardList,
        label: "My Complaints",
        color: "bg-blue-50 text-blue-600 border border-blue-100",
        hoverColor: "hover:bg-blue-100",
        shadow: "shadow-blue-50",
        href: "/citizen-dashboard?view=my-complaints",
    },
    {
        icon: MapIcon,
        label: "View Map",
        color: "bg-white text-gray-700 border border-gray-100",
        hoverColor: "hover:bg-gray-50",
        shadow: "shadow-gray-100",
        href: "/dashboard/map",
    },
    {
        icon: Bell,
        label: "Notifications",
        color: "bg-white text-gray-700 border border-gray-100",
        hoverColor: "hover:bg-gray-50",
        shadow: "shadow-gray-100",
        badge: 3,
        href: "#",
    },
];

export default function QuickActions() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {actions.map((action, index) => (
                <motion.button
                    key={action.label}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (action.href && action.href !== '#') {
                            router.push(action.href);
                        }
                    }}
                    className={`relative p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all shadow-sm hover:shadow-lg ${action.color} ${action.hoverColor} ${action.shadow}`}
                >
                    {action.badge && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {action.badge}
                        </span>
                    )}
                    <action.icon className="w-8 h-8" />
                    <span className="font-semibold text-sm">{action.label}</span>
                </motion.button>
            ))}
        </div>
    );
}
