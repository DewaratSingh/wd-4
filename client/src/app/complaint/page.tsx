'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import DuplicateDetectionModal from '@/components/DuplicateDetectionModal';

export default function ComplaintPage() {
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(1);
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
    const [distanceCheck, setDistanceCheck] = useState<'valid' | 'invalid' | 'checking' | null>(null);
    const [distanceValue, setDistanceValue] = useState<number | null>(null);
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
            // checkLocationValidity(); // Logic disabled
        }
    }, [webcamRef]);

    const retake = () => {
        setImage(null);
        setStep(1);
        // setDistanceCheck(null);
        setErrorMsg('');
    };

    const checkLocationValidity = async () => {
        if (!location) {
            setErrorMsg("Waiting for location...");
            return;
        }

        setDistanceCheck('checking');
        try {
            const response = await fetch('http://localhost:3000/api/check-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(location)
            });

            const data = await response.json();

            if (data.valid) {
                setDistanceCheck('valid');
            } else {
                setDistanceCheck('invalid');
                setDistanceValue(data.distance);
                setErrorMsg(`You are too close to the reference point (${data.distance?.toFixed(2)} km). Must be > 50km away.`);
            }
        } catch (err) {
            console.error("API Error:", err);
            setDistanceCheck(null);
            setErrorMsg("Failed to verify location. Is backend running?");
        }
    };

    const checkForDuplicates = async () => {
        if (!image || !location) return;

        setCheckingDuplicates(true);
        setErrorMsg('');

        try {
            const res = await fetch(image);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
            formData.append('notes', notes);
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());

            const response = await fetch('http://localhost:3000/api/check-duplicates', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.duplicates && data.duplicates.length > 0) {
                setDuplicates(data.duplicates);
                setShowDuplicateModal(true);
            } else {
                // No duplicates, proceed with submission
                submitComplaint();
            }
        } catch (err) {
            console.error("Duplicate check error:", err);
            // If duplicate check fails, proceed with submission anyway
            submitComplaint();
        } finally {
            setCheckingDuplicates(false);
        }
    };

    const submitComplaint = async () => {
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
                setStep(4); // Success step
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
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Report Issue</h1>

            {/* Step 1: Capture */}
            {step === 1 && (
                <div className="w-full max-w-md flex flex-col gap-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-[3/4] shadow-lg border border-gray-700">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-full object-cover"
                        />

                        {/* Location Overlay */}
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-xs bg-black/50 p-2 rounded backdrop-blur-sm">
                            <div className="flex items-center gap-1">
                                <MapPin size={14} className={locationStatus === 'success' ? 'text-green-400' : 'text-yellow-400'} />
                                <span>
                                    {locationStatus === 'locating' && "Locating..."}
                                    {locationStatus === 'success' && `${location?.latitude.toFixed(4)}, ${location?.longitude.toFixed(4)}`}
                                    {locationStatus === 'error' && "Loc Error"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={capture}
                        disabled={locationStatus !== 'success'}
                        className={`p-4 rounded-full flex items-center justify-center mx-auto transition-all ${locationStatus === 'success'
                            ? 'bg-blue-600 hover:bg-blue-500 scale-100'
                            : 'bg-gray-600 opacity-50 cursor-not-allowed'
                            }`}
                        title={locationStatus !== 'success' ? "Wait for location" : "Capture Photo"}
                    >
                        <Camera size={32} />
                    </button>
                    {locationStatus !== 'success' && <p className="text-center text-sm text-gray-400">Waiting for GPS signal...</p>}
                </div>
            )}

            {/* Step 2 & 3: Review & Details */}
            {(step === 2 || step === 3) && image && (
                <div className="w-full max-w-md flex flex-col gap-4">
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video shadow-lg border border-gray-700">
                        <img src={image} alt="Captured" className="w-full h-full object-contain" />
                        <button
                            onClick={retake}
                            className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Direct Form Display */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={3}
                                placeholder="Describe the issue..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="+91..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || checkingDuplicates}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {checkingDuplicates ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Checking for duplicates...
                                </>
                            ) : submitting ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Complaint"
                            )}
                        </button>
                    </form>

                    {errorMsg && (
                        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                            {errorMsg}
                        </div>
                    )}
                </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <div className="w-full max-w-md flex flex-col items-center gap-6 mt-10 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {successData?.message || 'Complaint Submitted!'}
                        </h2>
                        <p className="text-gray-400">
                            {successData?.message
                                ? `Complaint ID: #${successData.id}`
                                : `Thank you for reporting. Your ID is #${successData?.id}`
                            }
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition"
                    >
                        Submit Another
                    </button>
                </div>
            )}

            {/* Duplicate Detection Modal */}
            <DuplicateDetectionModal
                isOpen={showDuplicateModal}
                duplicates={duplicates}
                currentImage={image || ''}
                onClose={() => setShowDuplicateModal(false)}
                onSubmitAnyway={handleSubmitAnyway}
                onSupportExisting={handleSupportExisting}
            />
        </div>
    );
}
