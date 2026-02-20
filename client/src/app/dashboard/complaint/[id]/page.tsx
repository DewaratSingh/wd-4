'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, FileText, ArrowLeft, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Status state management
    const [progress, setProgress] = useState('');
    const [resolvedText, setResolvedText] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/complaint/${id}`);
            const data = await res.json();
            if (data.success) {
                setComplaint(data.complaint);
                setProgress(data.complaint.progress || 'Pending');
                setResolvedText(data.complaint.resolved_text || '');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setMessage('');
        try {
            const res = await fetch('http://localhost:5000/api/complaint/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: complaint.id,
                    progress,
                    resolved_text: resolvedText
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Status updated successfully!');
                setComplaint(data.complaint);
            } else {
                setMessage('Failed to update status.');
            }
        } catch (err) {
            setMessage('Error connecting to server.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (!complaint) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Complaint not found</div>;

    const StatusButton = ({ status, color, icon: Icon }: any) => (
        <button
            onClick={() => setProgress(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${progress === status
                ? `bg-${color}-600 border-${color}-400 text-white ring-2 ring-${color}-400 ring-offset-2 ring-offset-gray-900`
                : `bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700`
                }`}
        >
            <Icon size={18} />
            {status}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image & Details */}
                    <div className="space-y-6">
                        <div className="bg-black rounded-lg overflow-hidden border border-gray-700 aspect-video shadow-lg">
                            <img src={complaint.image_url} alt="Complaint" className="w-full h-full object-contain" />
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Complaint Details</h2>

                            <div className="flex items-start gap-3">
                                <FileText className="text-blue-400 mt-1" />
                                <div>
                                    <label className="text-sm text-gray-400">Notes</label>
                                    <p className="text-gray-200">{complaint.notes}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="text-green-400" />
                                <div>
                                    <label className="text-sm text-gray-400">Phone</label>
                                    <p className="text-gray-200"><a href={`tel:${complaint.phone}`} className="hover:underline">{complaint.phone}</a></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="text-red-400" />
                                <div>
                                    <label className="text-sm text-gray-400">Location</label>
                                    <p className="text-gray-200">{complaint.latitude}, {complaint.longitude}</p>
                                    <a
                                        href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-400 hover:underline"
                                    >
                                        View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Status Management */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                            <h2 className="text-xl font-semibold border-b border-gray-700 pb-4 mb-4">Status & Resolution</h2>

                            <div className="space-y-4">
                                <label className="text-sm text-gray-400">Current Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatusButton status="Accepted" color="blue" icon={CheckCircle} />
                                    <StatusButton status="Work in Progress" color="yellow" icon={Clock} />
                                    <StatusButton status="Resolved" color="green" icon={CheckCircle} />
                                    <StatusButton status="Closed" color="gray" icon={XCircle} />
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm text-gray-400 mb-2">Resolution Notes (Optional)</label>
                                    <textarea
                                        value={resolvedText}
                                        onChange={(e) => setResolvedText(e.target.value)}
                                        className="w-full bg-gray-900 border-gray-600 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                                        placeholder="Add notes about the resolution or progress..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={updating}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                                    >
                                        {updating ? (
                                            <span className="flex items-center gap-2">Updating...</span>
                                        ) : (
                                            "Update Status"
                                        )}
                                    </button>
                                </div>

                                {message && (
                                    <div className={`p-3 rounded text-center text-sm ${message.includes('success') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
