"use client";

import { Bell, ChevronDown, Menu, Search, User, LogOut, Settings, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [notificationCount, setNotificationCount] = useState(3);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const municipalUser = localStorage.getItem('municipalUser');

        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } else if (municipalUser) {
            setUser(JSON.parse(municipalUser));
        }
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('municipalUser');
        router.push('/user/login');
    };

    const navLinks = [
        { href: "/citizen-dashboard", label: "Dashboard" },
        { href: user?.id ? `/citizen-dashboard/complaints/${user.id}` : "/citizen-dashboard/complaints", label: "My Complaints" },
        { href: "/map", label: "City Map" },
        { href: "/community", label: "Community" },
        { href: "/complaint", label: "Report Issue" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/citizen-dashboard" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5 text-white"
                                >
                                    <path d="M3 21h18" />
                                    <path d="M5 21V7l8-4 8 4v14" />
                                    <path d="M17 21v-8H7v8" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                                NagarSeva
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8 ml-10">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                active={pathname === link.href || pathname?.startsWith(link.href)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 ml-auto">
                        {/* Search */}
                        <div className="hidden md:flex relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services, wards..."
                                className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <Link
                            href="/notifications"
                            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </Link>

                        {/* User Profile with Dropdown */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors p-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {user ? getInitials(user.username || user.name || 'User') : 'U'}
                                </div>
                                <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
                                    <span>{user?.username || user?.name || 'Guest'}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">{user?.username || user?.name || 'Guest User'}</p>
                                        <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-yellow-500" />
                                            <span className="text-xs text-gray-600">Trust Score: <span className="font-bold text-blue-600">92/100</span></span>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>View Profile</span>
                                        </Link>
                                        <Link
                                            href={user?.id ? `/citizen-dashboard/complaints/${user.id}` : "/citizen-dashboard/complaints"}
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>My Complaints</span>
                                        </Link>
                                        <Link
                                            href="/notifications"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Bell className="w-4 h-4" />
                                            <span>Notifications</span>
                                            {notificationCount > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    {notificationCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link
                                            href="/settings"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-gray-100 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href || pathname?.startsWith(link.href)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${active ? "text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full" : "text-gray-600"
                }`}
        >
            {children}
        </Link>
    );
}
