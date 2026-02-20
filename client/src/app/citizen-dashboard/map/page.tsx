"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

// Dynamically import WardMap to avoid SSR issues with Leaflet
const WardMap = dynamic(() => import("../components/WardMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">Loading Map...</div>
});

export default function CitizenMapPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/all-complaints');
            const data = await res.json();
            if (data.success) {
                setComplaints(data.complaints);
            }
        } catch (err) {
            console.error("Map fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className="h-[calc(100vh-120px)] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <WardMap complaints={complaints} />
        </div>
    );
}
