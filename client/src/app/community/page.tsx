"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users, MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunityPage() {
    const router = useRouter();

    const communityPosts = [
        {
            id: 1,
            author: "Priya Sharma",
            avatar: "PS",
            time: "2 hours ago",
            content: "Great to see the pothole on MG Road finally fixed! Thanks to everyone who supported the complaint.",
            likes: 24,
            comments: 8,
            category: "Road Maintenance"
        },
        {
            id: 2,
            author: "Amit Patel",
            avatar: "AP",
            time: "5 hours ago",
            content: "Anyone else facing water supply issues in Andheri West? Let's raise a collective complaint.",
            likes: 15,
            comments: 12,
            category: "Water Supply"
        },
        {
            id: 3,
            author: "Sneha Reddy",
            avatar: "SR",
            time: "1 day ago",
            content: "The new street lights in our area are working great! Kudos to the municipal team.",
            likes: 42,
            comments: 6,
            category: "Street Lighting"
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
                            <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                            <p className="text-sm text-gray-500">Connect with fellow citizens</p>
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
                    <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="font-bold text-blue-900 mb-2">Community Feature Coming Soon!</h2>
                        <p className="text-sm text-blue-700">
                            We're building a space where citizens can discuss local issues, share updates, 
                            and collaborate on making the city better. Stay tuned!
                        </p>
                    </div>
                </motion.div>

                {/* Mock Community Posts */}
                <div className="space-y-4">
                    {communityPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {post.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-gray-900">{post.author}</h3>
                                        <span className="text-xs text-gray-500">{post.time}</span>
                                    </div>
                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4">{post.content}</p>

                            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                                    <ThumbsUp size={18} />
                                    <span className="text-sm font-medium">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-medium">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition ml-auto">
                                    <Share2 size={18} />
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
