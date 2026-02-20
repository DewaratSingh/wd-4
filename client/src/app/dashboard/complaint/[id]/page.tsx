'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Webcam from 'react-webcam';
import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Phone, MapPin, Camera, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';

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

    useEffect(() => {
        // Check if user is logged in as municipal admin
        const user = localStorage.getItem('municipalUser');
        setIsAdmin(!!user);

        fetchComplaint();
    }, [id]);

    // Geolocation for resolution
    useEffect(() => {
        if (cameraMode) {
            if (!navigator.geolocation) {
                setLocationStatus('error');
                return;
            }

            setLocationStatus('locating');
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setResolutionLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setLocationStatus('success');
                },
                (error) => {
                    setLocationStatus('error');
                    console.error("Location error:", error);
                },
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [cameraMode]);

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

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setResolutionImage(imageSrc);
            setCameraMode(false);
        }
    }, [webcamRef]);

    const retake = () => {
        setResolutionImage(null);
        setCameraMode(true);
    };

    const handleUpdate = async () => {
        // Validation: Require image and location for "Resolved" status
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
                // Convert base64 to blob
                const res = await fetch(resolutionImage);
                const blob = await res.blob();
                formData.append('resolution_image', blob, 'resolution.jpg');

                if (resolutionLocation) {
                    formData.append('resolved_latitude', resolutionLocation.latitude.toString());
                    formData.append('resolved_longitude', resolutionLocation.longitude.toString());
                }
            }

            const res = await fetch('http://localhost:3000/api/complaint/update', {
                method: 'PUT',
                body: formData // Fetch automatically sets Content-Type to multipart/form-data
            });

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
                    {/* Existing dark theme content */}
                    <div className="max-w-4xl mx-auto">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
                            <ArrowLeft size={20} /> Back
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Image & Details */}
                            <div className="space-y-6">
                                <div className="bg-black rounded-lg overflow-hidden border border-gray-700 aspect-video shadow-lg relative">
                                    <img src={complaint.image_url} alt="Complaint" className="w-full h-full object-contain" />
                                    {/* Status Badge for everyone */}
                                    <div className={`absolute top-4 right-4 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md ${complaint.progress === 'Resolved' ? 'bg-green-600/90' :
                                        complaint.progress === 'Work in Progress' ? 'bg-yellow-600/90' :
                                            complaint.progress === 'Closed' ? 'bg-gray-600/90' : 'bg-red-600/90'
                                        }`}>
                                        {complaint.progress || 'Pending'}
                                    </div>
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

                                    {/* Resolution Details (Visible if resolved/closed) */}
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
                                                                target="_blank"
                                                                rel="noreferrer"
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
                                                {/* Mask phone for public, show for admin */}
                                                {isAdmin ? (
                                                    <a href={`tel:${complaint.phone}`} className="hover:underline">{complaint.phone}</a>
                                                ) : (
                                                    <span>{complaint.phone.slice(0, 2)}******{complaint.phone.slice(-2)}</span>
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

                            {/* Right Column: Status Management (ADMIN ONLY) */}
                            {isAdmin && (
                                <div className="space-y-6">
                                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg h-full">
                                        <h2 className="text-xl font-semibold border-b border-gray-700 pb-4 mb-4">Update Status</h2>

                                        <div className="space-y-4">
                                            <label className="text-sm text-gray-400">Set Status</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <StatusButton status="Accepted" color="blue" icon={CheckCircle} />
                                                <StatusButton status="Work in Progress" color="yellow" icon={Clock} />
                                                <StatusButton status="Resolved" color="green" icon={CheckCircle} />
                                                <StatusButton status="Closed" color="gray" icon={XCircle} />
                                            </div>

                                            {/* Live Camera Resolution Capture - Only when 'Resolved' is selected */}
                                            {progress === 'Resolved' && (
                                                <div className="mt-4 p-4 bg-black/40 border border-gray-700 rounded-lg">
                                                    <label className="block text-sm text-blue-300 mb-2 font-bold">
                                                        Proof of Resolution (Required)
                                                    </label>

                                                    {/* Webcam View */}
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
                                                                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full p-3 shadow-lg ${locationStatus === 'success' ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                <div className="w-10 h-10 rounded-full border-2 border-black"></div>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Captured Image Preview */}
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

                                                    {/* Initial State (Start Camera) */}
                                                    {!cameraMode && !resolutionImage && (
                                                        <div className="flex flex-col gap-2">
                                                            {complaint.resolved_image_url ? (
                                                                <div className="text-sm text-green-400 flex items-center gap-2 bg-green-900/20 p-2 rounded border border-green-900">
                                                                    <CheckCircle size={16} /> Existing proof available
                                                                </div>
                                                            ) : null}
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
                                                    className="w-full bg-gray-900 border-gray-600 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
                                                    placeholder="Add notes about the resolution..."
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleUpdate}
                                                    disabled={updating}
                                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                                                >
                                                    {updating ? "Updating..." : "Update Complaint"}
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
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
