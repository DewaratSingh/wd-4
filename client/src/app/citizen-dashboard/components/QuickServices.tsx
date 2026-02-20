"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

const services = [
    "Pay Property Tax",
    "Birth Certificate",
    "Garbage Schedule",
    "Parking Permit",
];

export default function QuickServices() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Services</h3>
            <div className="space-y-2">
                {services.map((service) => (
                    <Link
                        key={service}
                        href="#"
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                            {service}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
