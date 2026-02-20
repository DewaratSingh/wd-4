"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Lock, Globe, Palette, Shield, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const router = useRouter();

    const settingsSections = [
        {
            title: "Account Settings",
            items: [
                { icon: Lock, label: "Change Password", description: "Update your password" },
                { icon: Mail, label: "Email Preferences", description: "Manage email notifications" },
                { icon: Shield, label: "Privacy", description: "Control your privacy settings" },
            ]
        },
        {
            title: "Notifications",
            items: [
                { icon: Bell, label: "Push Notifications", description: "Manage push notifications" },
                { icon: Mail, label: "Email Alerts", description: "Configure email alerts" },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Globe, label: "Language", description: "Choose your preferred language" },
                { icon: Palette, label: "Theme", description: "Light or dark mode" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="text-sm text-gray-500">Manage your account preferences</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 flex items-start gap-4"
                >
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="font-bold text-blue-900 mb-2">Settings Coming Soon!</h2>
                        <p className="text-sm text-blue-700">
                            We're working on comprehensive settings to give you full control over your account, 
                            notifications, and preferences. Stay tuned!
                        </p>
                    </div>
                </motion.div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {settingsSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">{section.title}</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item, itemIndex) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={itemIndex}
                                            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                            </div>
                                            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
