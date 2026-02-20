"use client";

import { AlertTriangle, CalendarDays, Bug, Phone } from "lucide-react";

export default function EmergencySection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emergency Contacts Card */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Emergency
                </h3>
                <div className="space-y-3">
                    <EmergencyRow label="Police" number="100" />
                    <EmergencyRow label="Ambulance" number="102" />
                    <EmergencyRow label="Fire" number="101" />
                </div>
            </div>

            {/* City Announcements Card */}
            <div className="md:col-span-2 bg-blue-50 rounded-2xl p-6 border border-blue-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="text-lg font-bold text-gray-900">City Announcements</h3>
                    <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        NEW
                    </span>
                </div>

                <div className="space-y-4 relative z-10">
                    <AnnouncementItem
                        icon={CalendarDays}
                        title="Tax Filing Deadline Extended"
                        description="Property tax filing for Ward 14 extended till Oct 31st."
                        iconColor="text-blue-600"
                    />
                    <AnnouncementItem
                        icon={Bug}
                        title="Dengue Prevention Drive"
                        description="Fumigation scheduled for this Saturday, 10 AM."
                        iconColor="text-red-500"
                    />
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
            </div>
        </div>
    );
}

function EmergencyRow({ label, number }: { label: string; number: string }) {
    return (
        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-red-100/50">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-bold text-red-600">{number}</span>
        </div>
    );
}

function AnnouncementItem({ icon: Icon, title, description, iconColor }: any) {
    return (
        <div className="flex gap-3 items-start">
            <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
            <div>
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-xs text-gray-600">{description}</p>
            </div>
        </div>
    );
}
