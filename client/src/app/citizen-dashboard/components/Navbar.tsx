"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
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
                        <NavLink href="/citizen-dashboard" active>Dashboard</NavLink>
                        <NavLink href="#">My Complaints</NavLink>
                        <NavLink href="#">City Map</NavLink>
                        <NavLink href="#">Community</NavLink>
                        <NavLink href="#">Services</NavLink>
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
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                RK
                            </div>
                            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                                <span>Rajesh K.</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
