"use client";

import { X, AlertTriangle, ThumbsUp, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Duplicate {
    id: number;
    image_url: string;
    notes: string;
    distance: number;
    similarity: number;
    created_at: string;
    progress: string;
    aiAnalysis?: {
        similarity: number;
        reason: string;
        isDuplicate: boolean;
    };
    upvotes: number;
}

interface DuplicateDetectionModalProps {
    isOpen: boolean;
    duplicates: Duplicate[];
    currentImage: string;
    onClose: () => void;
    onSubmitAnyway: () => void;
    onSupportExisting: (id: number) => void;
}

export default function DuplicateDetectionModal({
    isOpen,
    duplicates,
    currentImage,
    onClose,
    onSubmitAnyway,
    onSupportExisting
}: DuplicateDetectionModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-yellow-500/30"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
                        >
                            <X size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={32} className="text-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Similar Issues Found!</h2>
                                <p className="text-yellow-100 text-sm">
                                    {duplicates.length} similar complaint{duplicates.length > 1 ? 's' : ''} detected nearby
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <div className="mb-6 bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-blue-200 text-sm">
                                💡 <strong>Tip:</strong> Supporting an existing complaint helps prioritize it! 
                                If this is the same issue, click "Add My Support" instead of creating a duplicate.
                            </p>
                        </div>

                        {/* Your Image */}
                        <div className="mb-6">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">YOUR REPORT</span>
                            </h3>
                            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                                <img src={currentImage} alt="Your complaint" className="w-full h-48 object-cover" />
                            </div>
                        </div>

                        {/* Similar Complaints */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold mb-3">Similar Complaints Found:</h3>
                            
                            {duplicates.map((duplicate, index) => (
                                <motion.div
                                    key={duplicate.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-500/50 transition"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        {/* Image */}
                                        <div className="relative">
                                            <img 
                                                src={duplicate.image_url} 
                                                alt="Similar complaint" 
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                                {duplicate.similarity}% Match
                                            </div>
                                            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                                                duplicate.progress === 'Resolved' ? 'bg-green-600' :
                                                duplicate.progress === 'Work in Progress' ? 'bg-yellow-600' :
                                                duplicate.progress === 'Accepted' ? 'bg-blue-600' : 'bg-red-600'
                                            }`}>
                                                {duplicate.progress || 'Pending'}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                                                    {duplicate.notes || 'No description provided'}
                                                </p>

                                                {duplicate.aiAnalysis && (
                                                    <div className="bg-purple-900/30 border border-purple-500/30 rounded p-2 mb-3">
                                                        <p className="text-purple-200 text-xs">
                                                            🤖 AI Analysis: {duplicate.aiAnalysis.reason}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {duplicate.distance}m away
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(duplicate.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp size={12} />
                                                        {duplicate.upvotes} support
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => onSupportExisting(duplicate.id)}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                                            >
                                                <ThumbsUp size={16} />
                                                Add My Support
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-800 p-6 border-t border-gray-700 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmitAnyway}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition"
                        >
                            No, This is Different - Submit Anyway
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
