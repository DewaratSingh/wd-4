'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Webcam from 'react-webcam';
import {
    ArrowLeft, CheckCircle, Clock, XCircle, FileText, Phone, MapPin,
    Camera, RefreshCw, ThumbsUp, Zap, AlertTriangle, CloudRain, Building2,
    GraduationCap, Timer, ExternalLink, Shield, Activity, User
} from 'lucide-react';

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

const PRIORITY_CONFIG = {
    Critical: { text: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-500/10', bar: 'bg-red-500', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
    High: { text: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-500/10', bar: 'bg-orange-500', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    Medium: { text: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', bar: 'bg-yellow-500', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    Low: { text: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    'Pending': { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', label: 'Pending' },
    'Accepted': { color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', label: 'Accepted' },
    'Work in Progress': { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', label: 'In Progress' },
    'Resolved': { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', label: 'Resolved' },
    'Closed': { color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30', label: 'Closed' },
};

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
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

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
        if (!adminData) { router.push('/citizen-dashboard'); return; }
        setIsAdmin(true);
        fetchComplaint();
    }, [id]);

    useEffect(() => {
        if (!cameraMode) return;
        if (!navigator.geolocation) { setLocationStatus('error'); return; }
        setLocationStatus('locating');
        const watchId = navigator.geolocation.watchPosition(
            (pos) => { setResolutionLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); setLocationStatus('success'); },
            () => setLocationStatus('error'),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
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
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchPriority = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}/priority`, { method: 'POST' });
            const data = await res.json();
            if (data.success) setPriority(data.priority);
        } catch (err) { console.error('Priority fetch error:', err); }
    };

    const handleUpvote = async () => {
        if (hasUpvoted || upvoting) return;
        const userData = localStorage.getItem('currentUser');
        if (!userData) { setMessage('Please log in to upvote'); setMessageType('error'); return; }
        const user = JSON.parse(userData);
        setUpvoting(true);
        try {
            const res = await fetch(`http://localhost:3000/api/complaint/${id}/upvote`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id })
            });
            const data = await res.json();
            if (data.success) { setUpvotes(data.upvotes); setPriority(data.priority); setHasUpvoted(true); }
            else if (data.error) { setMessage(data.error); setMessageType('error'); if (data.error.includes('already upvoted')) setHasUpvoted(true); }
        } catch (err) { console.error('Upvote error:', err); }
        finally { setUpvoting(false); }
    };

    const capture = useCallback(() => {
        if (webcamRef.current) { setResolutionImage(webcamRef.current.getScreenshot()); setCameraMode(false); }
    }, [webcamRef]);

    const retake = () => { setResolutionImage(null); setCameraMode(true); };

    const handleUpdate = async () => {
        if (progress === 'Resolved' && !resolutionImage && !complaint.resolved_image_url) {
            setMessage('Proof of resolution (photo) is required.'); setMessageType('error'); return;
        }
        if (progress === 'Resolved' && !complaint.resolved_image_url && !resolutionLocation) {
            setMessage('GPS location not found. Please wait for signal.'); setMessageType('error'); return;
        }
        setUpdating(true); setMessage('');
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
            if (data.success) { setMessage('Status updated successfully!'); setMessageType('success'); setComplaint(data.complaint); setResolutionImage(null); setCameraMode(false); }
            else { setMessage('Failed to update status.'); setMessageType('error'); }
        } catch (err) { console.error(err); setMessage('Error connecting to server.'); setMessageType('error'); }
        finally { setUpdating(false); }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 text-sm font-medium">Loading complaint...</p>
            </div>
        </div>
    );

    if (!complaint) return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-2">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                <p className="text-gray-600 font-medium">Complaint not found</p>
            </div>
        </div>
    );

    const statusCfg = STATUS_CONFIG[complaint.progress] || STATUS_CONFIG['Pending'];
    const priorityCfg = priority ? PRIORITY_CONFIG[priority.label] : null;

    const statusSteps = ['Pending', 'Accepted', 'Work in Progress', 'Resolved'];
    const currentStepIdx = statusSteps.indexOf(complaint.progress);

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Top banner */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to All Complaints
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono">#{String(complaint.id).padStart(4, '0')}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {complaint.progress || 'Pending'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

                {/* Page title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Submitted on {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ── Left: 3 columns ── */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Image card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="relative aspect-video bg-gray-100">
                                <img
                                    src={complaint.image_url}
                                    alt="Complaint"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {complaint.category && (
                                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        {complaint.category}
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div className="text-white">
                                        <p className="text-xs text-white/70 mb-0.5">Description</p>
                                        <p className="text-sm font-medium leading-snug line-clamp-2">{complaint.notes}</p>
                                    </div>
                                    {complaint.department && (
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg ml-3 shrink-0">
                                            {complaint.department}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Priority Score card */}
                        {priority && priorityCfg && (
                            <div className={`rounded-2xl border p-5 ${priorityCfg.bg} ${priorityCfg.border}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${priorityCfg.bg} border ${priorityCfg.border}`}>
                                            <Zap size={15} className={priorityCfg.text} />
                                        </div>
                                        <span className={`text-sm font-bold uppercase tracking-wider ${priorityCfg.text}`}>Smart Priority Score</span>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${priorityCfg.badge}`}>
                                        {priority.label}
                                    </span>
                                </div>

                                <div className="flex items-end gap-2 mb-3">
                                    <span className={`text-5xl font-black leading-none ${priorityCfg.text}`}>{priority.score}</span>
                                    <span className="text-gray-400 text-lg mb-1">/100</span>
                                </div>

                                <div className="w-full h-2.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${priorityCfg.bar}`}
                                        style={{ width: `${priority.score}%` }}
                                    />
                                </div>

                                {/* Impact indicators */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {priority.nearbyHospital && (
                                        <div className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-2.5 py-1 rounded-lg">
                                            <Building2 size={11} /> Near Hospital
                                        </div>
                                    )}
                                    {priority.nearbySchool && (
                                        <div className="flex items-center gap-1.5 text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-2.5 py-1 rounded-lg">
                                            <GraduationCap size={11} /> Near School
                                        </div>
                                    )}
                                    {priority.rainPredicted && (
                                        <div className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                                            <CloudRain size={11} /> Rain {priority.rainProbability}%
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                    <Timer size={13} className="text-gray-400 shrink-0" />
                                    <span className="text-xs text-gray-400">Recommended: <span className="text-white font-semibold">{priority.recommended}</span></span>
                                </div>
                            </div>
                        )}

                        {/* Complaint Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 text-sm">Complaint Information</h3>
                            </div>
                            <div className="divide-y divide-gray-50">

                                <div className="px-5 py-4 flex items-start gap-4">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText size={15} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Notes / Description</p>
                                        <p className="text-gray-800 text-sm leading-relaxed">{complaint.notes || 'No description provided'}</p>
                                    </div>
                                </div>

                                <div className="px-5 py-4 flex items-center gap-4">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Phone size={15} className="text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Contact</p>
                                        {isAdmin ? (
                                            <a href={`tel:${complaint.phone}`} className="text-sm text-indigo-600 font-medium hover:underline">{complaint.phone}</a>
                                        ) : (
                                            <p className="text-sm text-gray-800">{complaint.phone?.slice(0, 2)}******{complaint.phone?.slice(-2)}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-4 flex items-start gap-4">
                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin size={15} className="text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Location</p>
                                        <p className="text-sm text-gray-800 font-mono mb-1">{Number(complaint.latitude).toFixed(5)}, {Number(complaint.longitude).toFixed(5)}</p>
                                        <a
                                            href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                            target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                                        >
                                            <ExternalLink size={11} /> View on Google Maps
                                        </a>
                                    </div>
                                </div>

                                {/* Upvote row */}
                                <div className="px-5 py-4 flex items-center gap-4">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                        <ThumbsUp size={15} className="text-purple-500" />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-0.5">Community Upvotes</p>
                                            <p className="text-sm text-gray-700">{upvotes} people upvoted this</p>
                                        </div>
                                        <button
                                            onClick={handleUpvote}
                                            disabled={hasUpvoted || upvoting}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${hasUpvoted
                                                    ? 'bg-purple-50 border-purple-200 text-purple-500 cursor-default'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 cursor-pointer'
                                                }`}
                                        >
                                            <ThumbsUp size={14} className={hasUpvoted ? 'fill-purple-400' : ''} />
                                            {hasUpvoted ? 'Upvoted' : upvoting ? '...' : 'Upvote'}
                                        </button>
                                    </div>
                                </div>

                                {/* Resolution proof (if exists) */}
                                {complaint.resolved_image_url && (
                                    <div className="px-5 py-4">
                                        <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1.5">
                                            <CheckCircle size={12} className="text-emerald-500" /> Proof of Resolution
                                        </p>
                                        <div className="rounded-xl overflow-hidden border border-gray-200 h-44 bg-gray-100 relative">
                                            <img src={complaint.resolved_image_url} alt="Resolution Proof" className="w-full h-full object-cover" />
                                            {complaint.resolved_latitude && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${complaint.resolved_latitude},${complaint.resolved_longitude}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur text-xs text-gray-700 px-2.5 py-1 rounded-lg shadow font-medium hover:bg-white transition"
                                                >
                                                    <MapPin size={11} className="text-red-500" /> View Proof Location
                                                </a>
                                            )}
                                        </div>
                                        {complaint.resolved_text && (
                                            <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                                <p className="text-xs text-emerald-600 font-semibold mb-1 flex items-center gap-1.5">
                                                    <CheckCircle size={12} /> Admin's Resolution Note
                                                </p>
                                                <p className="text-sm text-gray-700">{complaint.resolved_text}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: 2 columns ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Status tracker */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Activity size={15} className="text-indigo-500" />
                                <h3 className="font-semibold text-gray-800 text-sm">Status Timeline</h3>
                            </div>
                            <div className="px-5 py-5">
                                <div className="relative">
                                    {/* Progress line */}
                                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 rounded-full">
                                        <div
                                            className="w-full bg-gradient-to-b from-indigo-500 to-indigo-300 rounded-full transition-all duration-700"
                                            style={{ height: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%` }}
                                        />
                                    </div>

                                    <div className="space-y-5">
                                        {statusSteps.map((step, i) => {
                                            const done = i <= currentStepIdx;
                                            const active = i === currentStepIdx;
                                            return (
                                                <div key={step} className="relative flex items-center gap-4 pl-10">
                                                    <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${done
                                                            ? active
                                                                ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200'
                                                                : 'bg-indigo-100 border-indigo-300'
                                                            : 'bg-white border-gray-200'
                                                        }`}>
                                                        {i < currentStepIdx ? (
                                                            <CheckCircle size={14} className="text-indigo-600" />
                                                        ) : (
                                                            <span className={`text-xs font-bold ${done ? 'text-white' : 'text-gray-400'}`}>{i + 1}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-semibold ${done ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
                                                        {active && (
                                                            <p className="text-xs text-indigo-500 font-medium">Current status</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {complaint.resolved_at && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock size={11} />
                                        Resolved {new Date(complaint.resolved_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Update Panel */}
                        {isAdmin && (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                                    <Shield size={15} className="text-indigo-500" />
                                    <h3 className="font-semibold text-gray-800 text-sm">Update Status</h3>
                                </div>
                                <div className="px-5 py-5 space-y-5">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-3">Set Status</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { status: 'Accepted', icon: CheckCircle, color: 'blue' },
                                                { status: 'Work in Progress', icon: Clock, color: 'amber' },
                                                { status: 'Resolved', icon: CheckCircle, color: 'emerald' },
                                                { status: 'Closed', icon: XCircle, color: 'gray' },
                                            ].map(({ status, icon: Icon, color }) => {
                                                const active = progress === status;
                                                const colorMap: Record<string, string> = {
                                                    blue: active ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-200' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
                                                    amber: active ? 'bg-amber-500 border-amber-400 text-white ring-2 ring-amber-200' : 'border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600',
                                                    emerald: active ? 'bg-emerald-600 border-emerald-500 text-white ring-2 ring-emerald-200' : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600',
                                                    gray: active ? 'bg-gray-600 border-gray-500 text-white ring-2 ring-gray-200' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50',
                                                };
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => setProgress(status)}
                                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${colorMap[color]}`}
                                                    >
                                                        <Icon size={14} />
                                                        <span className="text-xs leading-tight">{status}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Camera proof section */}
                                    {progress === 'Resolved' && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-3">Proof of Resolution <span className="text-red-400">*</span></p>

                                            {cameraMode && !resolutionImage && (
                                                <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-gray-200">
                                                    <Webcam
                                                        audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
                                                        videoConstraints={{ facingMode: 'environment' }}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs">
                                                        <MapPin size={11} className={locationStatus === 'success' ? 'text-emerald-400' : 'text-amber-400'} />
                                                        <span className="text-white">{locationStatus === 'locating' ? 'Locating...' : locationStatus === 'success' ? 'GPS Ready' : 'No GPS'}</span>
                                                    </div>
                                                    <button
                                                        onClick={capture} disabled={locationStatus !== 'success'}
                                                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white transition-all ${locationStatus === 'success' ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 cursor-not-allowed'}`}
                                                    >
                                                        <div className="w-8 h-8 bg-white rounded-full mx-auto" />
                                                    </button>
                                                </div>
                                            )}

                                            {resolutionImage && (
                                                <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-gray-200">
                                                    <img src={resolutionImage} alt="Captured" className="w-full h-full object-contain" />
                                                    <button onClick={retake} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-black">
                                                        <RefreshCw size={13} />
                                                    </button>
                                                    {resolutionLocation && (
                                                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-lg text-xs text-emerald-400 flex items-center gap-1">
                                                            <MapPin size={11} /> {resolutionLocation.latitude.toFixed(4)}, {resolutionLocation.longitude.toFixed(4)}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!cameraMode && !resolutionImage && (
                                                <div className="space-y-2">
                                                    {complaint.resolved_image_url && (
                                                        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-2 rounded-lg">
                                                            <CheckCircle size={13} /> Existing proof available
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => setCameraMode(true)}
                                                        className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl text-gray-400 hover:text-indigo-500 transition-all"
                                                    >
                                                        <Camera size={22} />
                                                        <span className="text-xs font-medium">{complaint.resolved_image_url ? 'Retake Proof Photo' : 'Open Camera to Capture Proof'}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Notes textarea */}
                                    <div>
                                        <label className="block text-xs text-gray-400 font-medium mb-2">Resolution Notes</label>
                                        <textarea
                                            value={resolvedText}
                                            onChange={(e) => setResolvedText(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none min-h-[100px] resize-none transition-all"
                                            placeholder="Add notes about the resolution..."
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        onClick={handleUpdate}
                                        disabled={updating}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {updating ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                                        ) : 'Update Complaint'}
                                    </button>

                                    {message && (
                                        <div className={`p-3 rounded-xl text-sm text-center ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            {message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pending notice for non-admins */}
                        {!isAdmin && (!complaint.progress || complaint.progress === 'Pending') && (
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                                <p>Your complaint is in the queue. The municipality will review and assign it soon.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
