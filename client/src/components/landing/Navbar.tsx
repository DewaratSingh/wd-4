"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleTranslate from "@/components/GoogleTranslate";

const NAV_LINKS = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Impact", href: "#impact" },
    { label: "For Cities", href: "#for-cities" },
    { label: "Login", href: "/signin" },
];

// Smooth-scroll to an anchor with offset to clear the fixed navbar (~80px)
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return; // Let Next.js handle page routes normally
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
        const navbarHeight = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: "smooth" });
    }
};

export const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 border-b border-light-border"
            >
                {/* Left: Logo */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <Shield className="w-8 h-8 text-electric-indigo fill-electric-indigo/20 group-hover:text-vibrant-orange transition-colors duration-300" />
                        <div className="absolute inset-0 bg-electric-indigo/20 blur-lg rounded-full opacity-50 group-hover:bg-vibrant-orange/20 transition-colors duration-300" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-light-text-heading tracking-tight">
                            NagarSeva
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-vibrant-orange bg-vibrant-orange/10 rounded-full border border-vibrant-orange/20">
                            BETA
                        </span>
                    </div>
                </div>

                {/* Center: Nav Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className="relative text-sm font-medium text-light-text-body hover:text-light-text-heading transition-colors group cursor-pointer"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-vibrant-orange transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Right: CTAs */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <GoogleTranslate />
                    </div>

                    <Link href="/signin" className="hidden md:block px-5 py-2 text-sm font-medium text-light-text-heading border border-light-border rounded-full hover:bg-slate-50 transition-colors">
                        Admin Login
                    </Link>
                    <Link href="/complaint" className="relative px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-vibrant-orange to-orange-500 rounded-full shadow-lg shadow-vibrant-orange/20 hover:shadow-vibrant-orange/40 hover:scale-105 transition-all duration-300 group overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Report an Issue
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[73px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-light-border shadow-xl md:hidden"
                    >
                        <nav className="flex flex-col px-6 py-4 gap-1">
                            {NAV_LINKS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => {
                                        scrollToSection(e, item.href);
                                        setMobileOpen(false);
                                    }}
                                    className="text-sm font-medium text-slate-700 hover:text-vibrant-orange py-3 border-b border-slate-100 last:border-0 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
