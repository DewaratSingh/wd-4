"use client";

import { Bell, ClipboardList, Home, Map as MapIcon, Users, ChevronRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const municipalUser = localStorage.getItem('municipalUser');

        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } else if (municipalUser) {
            setUser(JSON.parse(municipalUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('municipalUser');
        router.push('/user/login');
    };

    const handleViewProfile = () => {
        router.push('/profile');
    };

    // Get user initials
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Calculate trust score based on user activity
    const calculateTrustScore = () => {
        // Mock calculation - in real app, this would come from backend
        return 92;
    };

    const menuItems = [
        { icon: Home, label: "Home", href: "/citizen-dashboard" },
        { icon: ClipboardList, label: "My Complaints", href: "/citizen-dashboard?view=my-complaints" },
        { icon: MapIcon, label: "City Map", href: "/dashboard/map" },
        { icon: Users, label: "Community", href: "/community" },
        { icon: Bell, label: "Notifications", href: "/notifications" },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 p-6 gap-6">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-600 mb-3">
                    {user ? getInitials(user.username || user.name || 'User') : 'U'}
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                    {user?.username || user?.name || 'Guest User'}
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    Citizen ID: {user?.id ? `MUM-${String(user.id).padStart(4, '0')}-${user.email?.substring(0, 2).toUpperCase()}` : 'N/A'}
                </p>

                <div className="w-full bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                        <span>Trust Score</span>
                        <span className="font-bold text-blue-600">{calculateTrustScore()}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${calculateTrustScore()}%` }}
                        ></div>
                    </div>
                </div>

                <button
                    onClick={handleViewProfile}
                    className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                    <User className="w-4 h-4" />
                    View Profile
                </button>
            </motion.div>

            {/* Navigation Menu */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 block">Menu</span>
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            active={pathname === item.href || pathname?.startsWith(item.href)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Logout Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-auto"
            >
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout Session</span>
                </button>
            </motion.div>
        </aside>
    );
}

function SidebarItem({ icon: Icon, label, href, active }: { icon: any; label: string; href: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
            <span>{label}</span>
            {active && <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />}
        </Link>
    );
}
