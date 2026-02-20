"use client";

import { ChevronRight, FileText, Home, Trash2, ParkingCircle } from "lucide-react";
import Link from "next/link";

const services = [
    { label: "Pay Property Tax", icon: Home, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Birth Certificate", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Garbage Schedule", icon: Trash2, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Parking Permit", icon: ParkingCircle, color: "text-purple-500", bg: "bg-purple-50" },
];

export default function QuickServices() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Quick Services</h3>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Citizen Portal</span>
            </div>
            <div className="space-y-1.5">
                {services.map(({ label, icon: Icon, color, bg }) => (
                    <Link
                        key={label}
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-150 group"
                    >
                        <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
