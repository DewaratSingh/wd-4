'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, CheckCircle, AlertCircle, RefreshCw, ChevronLeft, Shield, FileText, Phone, Send } from 'lucide-react';

export default function ComplaintPage() {
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(1);
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
    const [notes, setNotes] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successData, setSuccessData] = useState<any>(null);

    // Duplicate detection states
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicates, setDuplicates] = useState<any[]>([]);
    const [checkingDuplicates, setCheckingDuplicates] = useState(false);

    // Get location continuously
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setErrorMsg('Geolocation is not supported by your browser');
            return;
        }

        setLocationStatus('locating');

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setLocationStatus('success');
            },
            (error) => {
                setLocationStatus('error');
                setErrorMsg(`Location error: ${error.message}`);
                console.error("Location error:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            setStep(2);
        }
    }, [webcamRef]);

    const retake = () => {
        setImage(null);
        setStep(1);
        setErrorMsg('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !location) return;

        setSubmitting(true);
        setErrorMsg('');

        try {
            const res = await fetch(image);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
            formData.append('notes', notes);
            formData.append('phone', phone);
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());

            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                formData.append('user_id', user.id);
            }

            const response = await fetch('http://localhost:3000/api/complaint', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessData(data.data);
                setStep(3); // Success step
            } else {
                setErrorMsg(data.error || 'Submission failed');
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setErrorMsg("Failed to submit complaint.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await checkForDuplicates();
    };

    const handleSupportExisting = async (complaintId: number) => {
        try {
            const currentUser = localStorage.getItem('currentUser');
            const userId = currentUser ? JSON.parse(currentUser).id : null;

            const response = await fetch(`http://localhost:3000/api/complaint/${complaintId}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            if (response.ok) {
                setShowDuplicateModal(false);
                setSuccessData({
                    id: complaintId,
                    message: 'Your support has been added to the existing complaint!'
                });
                setStep(4);
            }
        } catch (err) {
            console.error("Upvote error:", err);
            setErrorMsg("Failed to add support");
        }
    };

    const handleSubmitAnyway = () => {
        setShowDuplicateModal(false);
        submitComplaint();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
            {/* Header */}
            <div className="w-full bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-0">
                    <ChevronLeft size={20} />
                    <span className="font-medium text-sm">Back to Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                        <Shield className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md p-4 flex-1 flex flex-col justify-center">
                <AnimatePresence mode='wait'>
                    {/* Step 1: Capture */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900">Take a Photo</h1>
                                <p className="text-gray-500 text-sm mt-1">Capture the issue clearly to help us resolve it.</p>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[3/4] shadow-xl border border-gray-200 group">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "environment" }}
                                    className="w-full h-full object-cover"
                                />

                                {/* Location Badge */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs bg-black/40 text-white p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${locationStatus === 'success' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                        <span className="font-medium">
                                            {locationStatus === 'locating' && "Acquiring GPS..."}
                                            {locationStatus === 'success' && "Location Locked"}
                                            {locationStatus === 'error' && "GPS Error"}
                                        </span>
                                    </div>
                                    {locationStatus === 'success' && (
                                        <span className="opacity-70 font-mono tracking-wide hidden sm:inline-block">
                                            {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={capture}
                                    disabled={locationStatus !== 'success'}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${locationStatus === 'success'
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:scale-110 hover:shadow-orange-500/40 cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Camera size={32} />
                                </button>
                                {locationStatus !== 'success' && (
                                    <p className="text-sm text-gray-500 animate-pulse">Waiting for GPS signal...</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Review & Details */}
                    {step === 2 && image && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900">Add Details</h1>
                                <p className="text-gray-500 text-sm mt-1">Provide more context about the problem.</p>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video shadow-lg border border-gray-200">
                                <img src={image} alt="Captured" className="w-full h-full object-contain" />
                                <button
                                    onClick={retake}
                                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-gray-700 hover:text-orange-600 shadow-sm transition-colors"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 font-semibold flex items-center gap-2">
                                        <FileText size={16} className="text-orange-500" />
                                        Description
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none"
                                        rows={3}
                                        placeholder="Describe the issue (e.g., Pothole nearby...)"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 font-semibold flex items-center gap-2">
                                        <Phone size={16} className="text-orange-500" />
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                        placeholder="+91..."
                                        required
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={20} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Complaint
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center py-10"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <CheckCircle size={32} className="text-white" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Submitted!</h2>
                            <p className="text-gray-500 max-w-xs mx-auto mb-8">
                                Complaint <strong>#{successData?.id}</strong> has been registered successfully. We'll verify it shortly.
                            </p>

                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all shadow-sm"
                                >
                                    Report Another Issue
                                </button>
                                <Link
                                    href="/"
                                    className="w-full text-indigo-600 hover:text-indigo-700 font-medium py-2 rounded-xl transition-colors"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
