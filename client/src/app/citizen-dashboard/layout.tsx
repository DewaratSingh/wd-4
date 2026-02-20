"use client";

import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function CitizenDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-[1600px] mx-auto flex pt-4">
                <Sidebar />
                <main className="flex-1 px-4 lg:px-8 pb-12 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
