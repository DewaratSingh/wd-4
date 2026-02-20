'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Webcam from 'react-webcam';
import {
    ArrowLeft, CheckCircle, Clock, XCircle, FileText, Phone, MapPin,
    Camera, RefreshCw, ThumbsUp, Zap, AlertTriangle, CloudRain, Building2,
    GraduationCap, Timer, ArrowRight
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';

interface PriorityData {
    score: number;
    label: 'Critical' | 'High' | 'Medium' | 'Low';
    impacts: string[];
    recommended: string;
    rainPredicted: boolean;
    rainProbability: number;
    nearbyHospital: boolean;
    nearbySchool: boolean;
}

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const webcamRef = useRef<Webcam>(null);

    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [progress, setProgress] = useState('');
    const [resolvedText, setResolvedText] = useState('');
    const [message, setMessage] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);
    const [cameraMode, setCameraMode] = useState(false);
    const [resolutionImage, setResolutionImage] = useState<string | null>(null);
    const [resolutionLocation, setResolutionLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

    const [priority, setPriority] = useState<PriorityData | null>(null);
    const [upvotes, setUpvotes] = useState(0);
    const [upvoting, setUpvoting] = useState(false);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    useEffect(() => {
        const adminData = localStorage.getItem('municipalUser');
        setIsAdmin(!!adminData);
        fetchComplaint();
    }, [id]);

    // Geolocation for resolution
    useEffect(() => {
        if (cameraMode) {
            if (!navigator.geolocation) { setLocationStatus('error'); return; }
            setLocationStatus('locating');
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setResolutionLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                    setLocationStatus('success');
                },
                () => setLocationStatus('error'),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [cameraMode]);

    const fetchComplaint = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}`);
            const data = await res.json();
            if (data.success) {
                setComplaint(data.complaint);
                setProgress(data.complaint.progress || 'Pending');
                setResolvedText(data.complaint.resolved_text || '');
                setUpvotes(data.complaint.upvotes || 0);
                fetchPriority();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPriority = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}/priority`, { method: 'POST' });
            const data = await res.json();
            if (data.success) setPriority(data.priority);
        } catch (err) {
            console.error('Priority fetch error:', err);
        }
    };

    const handleUpvote = async () => {
        if (hasUpvoted || upvoting) return;

        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            setMessage('Please log in to upvote');
            return;
        }

        const user = JSON.parse(userData);
        setUpvoting(true);
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id })
            });
            const data = await res.json();
            if (data.success) {
                setUpvotes(data.upvotes);
                setPriority(data.priority);
                setHasUpvoted(true);
            } else if (data.error) {
                setMessage(data.error);
                if (data.error.includes('already upvoted')) {
                    setHasUpvoted(true);
                }
            }
        } catch (err) {
            console.error('Upvote error:', err);
        } finally {
            setUpvoting(false);
        }
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setResolutionImage(imageSrc);
            setCameraMode(false);
        }
    }, [webcamRef]);

    const retake = () => { setResolutionImage(null); setCameraMode(true); };

    const handleUpdate = async () => {
        if (progress === 'Resolved' && !resolutionImage && !complaint.resolved_image_url) {
            setMessage('Error: Proof of resolution (photo) is required.');
            return;
        }
        if (progress === 'Resolved' && !complaint.resolved_image_url && !resolutionLocation) {
            setMessage('Error: GPS Location not found. Please wait for signal.');
            return;
        }

        setUpdating(true);
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('id', complaint.id);
            formData.append('progress', progress);
            formData.append('resolved_text', resolvedText);

            if (resolutionImage) {
                const res = await fetch(resolutionImage);
                const blob = await res.blob();
                formData.append('resolution_image', blob, 'resolution.jpg');
                if (resolutionLocation) {
                    formData.append('resolved_latitude', resolutionLocation.latitude.toString());
                    formData.append('resolved_longitude', resolutionLocation.longitude.toString());
                }
            }

            const res = await fetch('http://localhost:3000/api/complaint/update', { method: 'PUT', body: formData });
            const data = await res.json();

            if (data.success) {
                setMessage('Status updated successfully!');
                setComplaint(data.complaint);
                setResolutionImage(null);
                setCameraMode(false);
            } else {
                setMessage('Failed to update status.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error connecting to server.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (!complaint) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Complaint not found</div>;

    const priorityColors: Record<string, string> = {
        Critical: 'text-red-400 border-red-500 bg-red-950/40',
        High: 'text-orange-400 border-orange-500 bg-orange-950/40',
        Medium: 'text-yellow-400 border-yellow-500 bg-yellow-950/40',
        Low: 'text-green-400 border-green-500 bg-green-950/40',
    };
    const priorityBarColor: Record<string, string> = {
        Critical: 'bg-red-500', High: 'bg-orange-500', Medium: 'bg-yellow-500', Low: 'bg-green-500',
    };

    const statusColors: Record<string, string> = {
        Resolved: 'bg-green-600/90',
        'Work in Progress': 'bg-yellow-600/90',
        Accepted: 'bg-blue-600/90',
        Closed: 'bg-gray-600/90',
    };

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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0 ml-[230px]">
                <DashboardHeader title="Complaint Details" />
                <main className="flex-1 overflow-y-auto bg-gray-900 p-4">
                    <div className="max-w-5xl mx-auto">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
                            <ArrowLeft size={20} /> Back
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* ── Left Column: Image, Details, Priority ── */}
                            <div className="space-y-6">
                                {/* Complaint Image */}
                                <div className="bg-black rounded-lg overflow-hidden border border-gray-700 aspect-video shadow-lg relative">
                                    <img src={complaint.image_url} alt="Complaint" className="w-full h-full object-contain" />
                                    <div className={`absolute top-4 right-4 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md ${statusColors[complaint.progress] || 'bg-red-600/90'}`}>
                                        {complaint.progress || 'Pending'}
                                    </div>
                                </div>

                                {/* Priority Score Panel */}
                                {priority && (
                                    <div className={`rounded-xl border p-5 ${priorityColors[priority.label]}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap size={18} />
                                            <h3 className="font-bold text-sm uppercase tracking-wider">Smart Priority Score</h3>
                                        </div>

                                        <div className="flex items-end gap-3 mb-3">
                                            <span className="text-4xl font-black">{priority.score}</span>
                                            <span className="text-lg text-gray-400 mb-1">/100</span>
                                            <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full border ${priorityColors[priority.label]}`}>
                                                {priority.label}
                                            </span>
                                        </div>

                                        {/* Score bar */}
                                        <div className="w-full h-2 bg-gray-700 rounded-full mb-4">
                                            <div
                                                className={`h-full rounded-full transition-all ${priorityBarColor[priority.label]}`}
                                                style={{ width: `${priority.score}%` }}
                                            />
                                        </div>

                                        {/* Impact indicators */}
                                        {priority.impacts.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {priority.nearbyHospital && (
                                                    <div className="flex items-center gap-2 text-xs text-red-300">
                                                        <Building2 size={13} /> Near a hospital — emergency access risk
                                                    </div>
                                                )}
                                                {priority.nearbySchool && (
                                                    <div className="flex items-center gap-2 text-xs text-yellow-300">
                                                        <GraduationCap size={13} /> Near a school — affects children's safety
                                                    </div>
                                                )}
                                                {priority.rainPredicted && (
                                                    <div className="flex items-center gap-2 text-xs text-blue-300">
                                                        <CloudRain size={13} /> Rain predicted ({priority.rainProbability}%) — flooding risk
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Recommended action */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-700/50">
                                            <Timer size={13} className="text-gray-400" />
                                            <span className="text-xs text-gray-300 font-medium">
                                                Recommended: <span className="text-white font-bold">{priority.recommended}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Complaint Details */}
                                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                                    <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Complaint Details</h2>

                                    <div className="flex items-start gap-3">
                                        <FileText className="text-blue-400 mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-gray-400">Notes</label>
                                                {complaint.category && (
                                                    <span className="text-[10px] font-bold bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700 uppercase">
                                                        {complaint.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-200">{complaint.notes}</p>
                                            {complaint.department && (
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <Building2 size={12} className="text-gray-500" />
                                                    <span className="text-xs text-gray-500 italic">Managed by: {complaint.department}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Resolution Details */}
                                    {(complaint.resolved_text || complaint.resolved_image_url) && (
                                        <div className="bg-gray-700/30 p-4 rounded border border-gray-600 space-y-3">
                                            <h3 className="text-green-400 font-semibold flex items-center gap-2">
                                                <CheckCircle size={16} /> Resolution Details
                                            </h3>
                                            {complaint.resolved_text && (
                                                <p className="text-gray-200 text-sm">{complaint.resolved_text}</p>
                                            )}
                                            {complaint.resolved_image_url && (
                                                <div className="mt-2 text-sm">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs text-gray-400">Proof of Resolution:</label>
                                                        {complaint.resolved_latitude && (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${complaint.resolved_latitude},${complaint.resolved_longitude}`}
                                                                target="_blank" rel="noreferrer"
                                                                className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                                                            >
                                                                <MapPin size={12} /> View Proof Loc
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="rounded overflow-hidden border border-gray-600 w-full h-40 bg-black">
                                                        <img src={complaint.resolved_image_url} alt="Resolution Proof" className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Phone className="text-green-400" />
                                        <div>
                                            <label className="text-sm text-gray-400">Phone</label>
                                            <p className="text-gray-200">
                                                {isAdmin ? (
                                                    <a href={`tel:${complaint.phone}`} className="hover:underline">{complaint.phone}</a>
                                                ) : (
                                                    <span>{complaint.phone?.slice(0, 2)}******{complaint.phone?.slice(-2)}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-red-400" />
                                        <div>
                                            <label className="text-sm text-gray-400">Location</label>
                                            <p className="text-gray-200">{complaint.latitude}, {complaint.longitude}</p>
                                            <a
                                                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                                target="_blank" rel="noreferrer"
                                                className="text-xs text-blue-400 hover:underline"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>

                                    {/* Upvote Button */}
                                    <div className="pt-2 border-t border-gray-700">
                                        <button
                                            onClick={handleUpvote}
                                            disabled={hasUpvoted || upvoting}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold text-sm transition-all ${hasUpvoted
                                                ? 'bg-blue-900/50 border-blue-600 text-blue-300 cursor-default'
                                                : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-blue-800 hover:border-blue-500 hover:text-white'
                                                }`}
                                        >
                                            <ThumbsUp size={16} />
                                            {hasUpvoted ? 'Upvoted' : upvoting ? 'Upvoting...' : 'Upvote'}
                                            <span className="ml-1 bg-gray-600/60 px-2 py-0.5 rounded-full text-xs">{upvotes}</span>
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">Upvoting raises this issue's priority score</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right Column ── */}
                            <div className="space-y-6">
                                {/* Admin: Status Management Panel */}
                                {isAdmin ? (
                                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                                        <h2 className="text-xl font-semibold border-b border-gray-700 pb-4 mb-4">Update Status</h2>

                                        <div className="space-y-4">
                                            <label className="text-sm text-gray-400">Set Status</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <StatusButton status="Accepted" color="blue" icon={CheckCircle} />
                                                <StatusButton status="Work in Progress" color="yellow" icon={Clock} />
                                                <StatusButton status="Resolved" color="green" icon={CheckCircle} />
                                                <StatusButton status="Closed" color="gray" icon={XCircle} />
                                            </div>

                                            {progress === 'Resolved' && (
                                                <div className="mt-4 p-4 bg-black/40 border border-gray-700 rounded-lg">
                                                    <label className="block text-sm text-blue-300 mb-2 font-bold">
                                                        Proof of Resolution (Required)
                                                    </label>

                                                    {cameraMode && !resolutionImage && (
                                                        <div className="relative bg-black rounded overflow-hidden aspect-video border border-gray-600">
                                                            <Webcam
                                                                audio={false}
                                                                ref={webcamRef}
                                                                screenshotFormat="image/jpeg"
                                                                videoConstraints={{ facingMode: "environment" }}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs">
                                                                <MapPin size={12} className={locationStatus === 'success' ? 'text-green-400' : 'text-yellow-400'} />
                                                                <span className="text-white">
                                                                    {locationStatus === 'locating' && "Locating..."}
                                                                    {locationStatus === 'success' && "GPS Locked"}
                                                                    {locationStatus === 'error' && "No GPS"}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={capture}
                                                                disabled={locationStatus !== 'success'}
                                                                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full p-3 shadow-lg ${locationStatus === 'success' ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'}`}
                                                            >
                                                                <div className="w-10 h-10 rounded-full border-2 border-black"></div>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {resolutionImage && (
                                                        <div className="relative bg-black rounded overflow-hidden aspect-video border border-gray-600">
                                                            <img src={resolutionImage} alt="Captured" className="w-full h-full object-contain" />
                                                            <button
                                                                onClick={retake}
                                                                className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-black/80 text-white"
                                                            >
                                                                <RefreshCw size={14} />
                                                            </button>
                                                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-green-400 flex items-center gap-1">
                                                                <MapPin size={12} />
                                                                {resolutionLocation?.latitude.toFixed(4)}, {resolutionLocation?.longitude.toFixed(4)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!cameraMode && !resolutionImage && (
                                                        <div className="flex flex-col gap-2">
                                                            {complaint.resolved_image_url && (
                                                                <div className="text-sm text-green-400 flex items-center gap-2 bg-green-900/20 p-2 rounded border border-green-900">
                                                                    <CheckCircle size={16} /> Existing proof available
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => setCameraMode(true)}
                                                                className="flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-400 transition"
                                                            >
                                                                <Camera size={24} />
                                                                <span>{complaint.resolved_image_url ? "Retake Proof Photo" : "Open Camera to Capture Proof"}</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-6">
                                                <label className="block text-sm text-gray-400 mb-2">Resolution Notes</label>
                                                <textarea
                                                    value={resolvedText}
                                                    onChange={(e) => setResolvedText(e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                                                    placeholder="Add notes about the resolution..."
                                                />
                                            </div>

                                            <button
                                                onClick={handleUpdate}
                                                disabled={updating}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                                            >
                                                {updating ? "Updating..." : "Update Complaint"}
                                            </button>

                                            {message && (
                                                <div className={`p-3 rounded text-center text-sm ${message.includes('success') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                                                    {message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Citizen: Read-only Status Card */
                                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg space-y-5">
                                        <h2 className="text-xl font-semibold border-b border-gray-700 pb-3">Complaint Status</h2>

                                        {/* Status Step Tracker */}
                                        {(() => {
                                            const steps = ['Pending', 'Accepted', 'Work in Progress', 'Resolved'];
                                            const currentIdx = steps.indexOf(complaint.progress);
                                            return (
                                                <div className="relative">
                                                    <div className="flex items-center justify-between mb-2">
                                                        {steps.map((step, i) => (
                                                            <div key={step} className="flex flex-col items-center flex-1">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i <= currentIdx
                                                                    ? 'bg-blue-600 border-blue-400 text-white'
                                                                    : 'bg-gray-700 border-gray-600 text-gray-500'
                                                                    }`}>
                                                                    {i < currentIdx ? <CheckCircle size={14} /> : i + 1}
                                                                </div>
                                                                <span className={`text-[9px] mt-1 text-center leading-tight ${i <= currentIdx ? 'text-blue-300' : 'text-gray-600'}`}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Connector line */}
                                                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-700 -z-0">
                                                        <div
                                                            className="h-full bg-blue-600 transition-all"
                                                            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Current Status Badge */}
                                        <div className="space-y-2">
                                            <div className={`w-full text-center py-3 rounded-lg font-bold text-lg ${statusColors[complaint.progress] || 'bg-red-600/90'} text-white`}>
                                                {complaint.progress || 'Pending'}
                                            </div>
                                            {complaint.resolved_at && (
                                                <p className="text-[10px] text-center text-gray-500 italic">
                                                    Resolved on {new Date(complaint.resolved_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                        </div>

                                        {/* Resolution notes (if resolved) */}
                                        {complaint.resolved_text && (
                                            <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-4">
                                                <h4 className="text-green-400 text-sm font-semibold mb-1 flex items-center gap-2">
                                                    <CheckCircle size={14} /> Admin's Resolution Note
                                                </h4>
                                                <p className="text-gray-300 text-sm">{complaint.resolved_text}</p>
                                            </div>
                                        )}

                                        {/* Resolution proof image */}
                                        {complaint.resolved_image_url && (
                                            <div>
                                                <label className="text-xs text-gray-400 mb-1 block">Proof of Resolution</label>
                                                <div className="rounded-lg overflow-hidden border border-gray-600 h-40 bg-black">
                                                    <img src={complaint.resolved_image_url} alt="Proof" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        )}

                                        {/* If still pending */}
                                        {(!complaint.progress || complaint.progress === 'Pending') && (
                                            <div className="flex items-start gap-3 text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3">
                                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                                <span>Your complaint is in the queue. The municipality will review and assign it soon.</span>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 flex items-center gap-1 pt-1">
                                            <Clock size={11} />
                                            Reported on {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
