'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, MapPin, CheckCircle2, RefreshCw, Mic, MicOff,
    Languages, Phone, FileText, Send, ArrowLeft, Zap, Shield,
    AlertCircle, ChevronRight
} from 'lucide-react';
import DuplicateDetectionModal from '@/components/DuplicateDetectionModal';
import Link from 'next/link';

// ── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Capture', icon: Camera },
    { id: 2, label: 'Details', icon: FileText },
    { id: 3, label: 'Submit', icon: Send },
];

const LANGUAGES = [
    { code: 'en-IN', name: 'English', full: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi', full: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', full: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', full: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali', full: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi', full: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati', full: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', full: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam', full: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'Punjabi', full: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
];

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
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicates, setDuplicates] = useState<any[]>([]);
    const [checkingDuplicates, setCheckingDuplicates] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const recognitionRef = useRef<any>(null);

    // GPS
    useEffect(() => {
        if (!navigator.geolocation) { setLocationStatus('error'); return; }
        setLocationStatus('locating');
        const watchId = navigator.geolocation.watchPosition(
            (pos) => { setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); setLocationStatus('success'); },
            (err) => { setLocationStatus('error'); setErrorMsg(`Location error: ${err.message}`); },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Speech recognition
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        const rec = new SR();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = selectedLanguage;
        rec.onresult = (e: any) => { setNotes(p => p ? `${p} ${e.results[0][0].transcript}` : e.results[0][0].transcript); setIsListening(false); };
        rec.onerror = (e: any) => { setIsListening(false); if (e.error === 'not-allowed') setErrorMsg('Mic access denied.'); };
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
    }, [selectedLanguage]);

    const startVoice = () => {
        if (!recognitionRef.current) { setErrorMsg('Speech recognition not supported.'); return; }
        if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
        else { setErrorMsg(''); recognitionRef.current.lang = selectedLanguage; recognitionRef.current.start(); setIsListening(true); }
    };

    const capture = useCallback(() => {
        if (webcamRef.current) { setImage(webcamRef.current.getScreenshot()); setStep(2); }
    }, []);

    const retake = () => { setImage(null); setStep(1); setErrorMsg(''); };

    const checkForDuplicates = async () => {
        if (!image || !location) return;
        setCheckingDuplicates(true); setErrorMsg('');
        try {
            const blob = await (await fetch(image)).blob();
            const fd = new FormData();
            fd.append('image', blob, 'capture.jpg');
            fd.append('notes', notes);
            fd.append('latitude', location.latitude.toString());
            fd.append('longitude', location.longitude.toString());
            const res = await fetch('http://localhost:3000/api/check-duplicates', { method: 'POST', body: fd });
            const data = await res.json();
            if (res.ok && data.duplicates?.length > 0) { setDuplicates(data.duplicates); setShowDuplicateModal(true); }
            else submitComplaint();
        } catch { submitComplaint(); }
        finally { setCheckingDuplicates(false); }
    };

    const submitComplaint = async () => {
        if (!image || !location) return;
        setSubmitting(true); setErrorMsg('');
        try {
            const blob = await (await fetch(image)).blob();
            const fd = new FormData();
            fd.append('image', blob, 'capture.jpg');
            fd.append('notes', notes);
            fd.append('phone', phone);
            fd.append('latitude', location.latitude.toString());
            fd.append('longitude', location.longitude.toString());
            const cu = localStorage.getItem('currentUser');
            if (cu) fd.append('user_id', JSON.parse(cu).id);
            const res = await fetch('http://localhost:3000/api/complaint', { method: 'POST', body: fd });
            const data = await res.json();
            if (res.ok) { setSuccessData(data.data); setStep(4); }
            else setErrorMsg(data.error || 'Submission failed');
        } catch { setErrorMsg('Failed to submit complaint.'); }
        finally { setSubmitting(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await checkForDuplicates(); };

    const handleSupportExisting = async (complaintId: number) => {
        try {
            const cu = localStorage.getItem('currentUser');
            const userId = cu ? JSON.parse(cu).id : null;
            const res = await fetch(`http://localhost:3000/api/complaint/${complaintId}/upvote`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            if (res.ok) { setShowDuplicateModal(false); setSuccessData({ id: complaintId, message: 'Your support has been added!' }); setStep(4); }
        } catch { setErrorMsg('Failed to add support'); }
    };

    const handleSubmitAnyway = () => { setShowDuplicateModal(false); submitComplaint(); };

    // ── UI ───────────────────────────────────────────────────────────────────
    return (
        <div
            className="h-screen overflow-y-auto font-sans"
            style={{ background: "linear-gradient(145deg,#0f0c29 0%,#1a1744 40%,#24243e 100%)" }}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 sticky top-0 z-10" style={{ background: "rgba(15,12,41,0.85)", backdropFilter: "blur(12px)" }}>
                <Link href="/citizen-dashboard" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">NagarSeva · Civic Reports</span>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 pt-4 pb-6">

                {/* Page title */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                >
                    <h1 className="text-2xl font-black text-white tracking-tight">Report an Issue</h1>
                    <p className="text-indigo-300/80 text-xs mt-1">Help your city by documenting civic problems</p>
                </motion.div>

                {/* Step indicator */}
                {step < 4 && (
                    <div className="flex items-center justify-center gap-0 mb-5">
                        {STEPS.map((s, i) => {
                            const done = step > s.id;
                            const current = step === s.id;
                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                                            style={{
                                                background: done ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                                    : current ? "linear-gradient(135deg,#6366f1,#4338ca)"
                                                        : "rgba(255,255,255,0.08)",
                                                boxShadow: current ? "0 0 0 4px rgba(99,102,241,0.25)" : "none",
                                                border: (!done && !current) ? "1px solid rgba(255,255,255,0.12)" : "none",
                                            }}
                                        >
                                            {done
                                                ? <CheckCircle2 className="w-4.5 h-4.5 text-white" />
                                                : <s.icon className={`w-4 h-4 ${current ? 'text-white' : 'text-slate-500'}`} />
                                            }
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${current ? 'text-indigo-300' : done ? 'text-emerald-400' : 'text-slate-600'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="w-16 h-px mb-5 transition-colors duration-500" style={{ background: step > s.id ? "#22c55e" : "rgba(255,255,255,0.1)" }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {/* ── STEP 1: CAPTURE ─────────────────────────────────── */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black relative" style={{ boxShadow: "0 0 60px rgba(99,102,241,0.15)" }}>
                                {/* Camera — fixed height to stay within viewport */}
                                <div className="relative" style={{ height: "65vw", maxHeight: "550px", minHeight: "240px" }}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: "environment" }}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Corner brackets */}
                                    <div className="absolute inset-4 pointer-events-none">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
                                    </div>

                                    {/* GPS badge */}
                                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md"
                                            style={{
                                                background: "rgba(0,0,0,0.55)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: locationStatus === 'success' ? "#4ade80" : locationStatus === 'error' ? "#f87171" : "#fbbf24",
                                            }}
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {locationStatus === 'locating' && "Acquiring GPS…"}
                                            {locationStatus === 'success' && `${location?.latitude.toFixed(4)}, ${location?.longitude.toFixed(4)}`}
                                            {locationStatus === 'error' && "GPS Unavailable"}
                                        </div>
                                    </div>

                                    {/* Bottom gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }} />

                                    {/* Capture button */}
                                    <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
                                        <button
                                            onClick={capture}
                                            disabled={locationStatus !== 'success'}
                                            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                                            style={locationStatus === 'success' ? {
                                                background: "linear-gradient(135deg,#6366f1,#4338ca)",
                                                boxShadow: "0 0 0 4px rgba(99,102,241,0.3), 0 8px 24px rgba(99,102,241,0.5)",
                                            } : { background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)" }}
                                        >
                                            <Camera className="w-7 h-7 text-white" />
                                        </button>
                                        {locationStatus !== 'success' && (
                                            <span className="text-amber-300 text-[11px] font-medium flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                                <Zap className="w-3 h-3" /> Waiting for GPS…
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tip card */}
                            <div className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <p className="text-indigo-200 text-[11px] leading-snug">
                                    Point your camera at the issue and capture. GPS is recorded automatically.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: DETAILS ─────────────────────────────────── */}
                    {step === 2 && image && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                            {/* Captured photo preview */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-4" style={{ boxShadow: "0 0 40px rgba(99,102,241,0.12)" }}>
                                <img src={image} alt="Captured" className="w-full object-cover max-h-80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <button
                                    onClick={retake}
                                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                                    style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}
                                >
                                    <RefreshCw className="w-3 h-3" /> Retake
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                    <MapPin className="w-3 h-3" />
                                    {location?.latitude.toFixed(5)}, {location?.longitude.toFixed(5)}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">

                                {/* Notes field */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" /> Describe the Issue
                                        </label>
                                        {/* Language picker */}
                                        <div className="relative">
                                            <button type="button" onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors px-2.5 py-1 rounded-full"
                                                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                                <Languages className="w-3 h-3" />
                                                {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                                            </button>
                                            <AnimatePresence>
                                                {showLanguageMenu && (
                                                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                                        className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-20 w-48 py-1"
                                                        style={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                                                        {LANGUAGES.map(lang => (
                                                            <button key={lang.code} type="button" onClick={() => { setSelectedLanguage(lang.code); setShowLanguageMenu(false); }}
                                                                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-indigo-800/40"
                                                                style={{ color: selectedLanguage === lang.code ? "#818cf8" : "#a5b4fc" }}>
                                                                <span>{lang.flag}</span><span>{lang.full}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={3}
                                            required
                                            placeholder="Describe the civic issue clearly… e.g. 'Broken streetlight on main road'"
                                            className="w-full text-sm text-white placeholder-indigo-400/50 rounded-xl px-4 py-3 pr-14 resize-none outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.25)" }}
                                        />
                                        <button type="button" onClick={startVoice}
                                            className="absolute right-3 top-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                                            style={isListening
                                                ? { background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 0 16px rgba(239,68,68,0.5)" }
                                                : { background: "linear-gradient(135deg,#6366f1,#4338ca)" }}>
                                            {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
                                        </button>
                                    </div>

                                    {isListening && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="mt-2 flex items-center gap-2 text-[11px] font-bold text-red-400 px-3 py-1.5 rounded-full w-fit"
                                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                            <span className="flex gap-0.5">
                                                {[0, 0.15, 0.3].map((d, i) => (
                                                    <span key={i} className="w-1 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: `${d}s` }} />
                                                ))}
                                            </span>
                                            Listening in {LANGUAGES.find(l => l.code === selectedLanguage)?.name}…
                                        </motion.div>
                                    )}
                                </div>

                                {/* Phone field */}
                                <div>
                                    <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                        <Phone className="w-3.5 h-3.5" /> Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                        placeholder="+91 98765 43210"
                                        className="w-full text-sm text-white placeholder-indigo-400/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.25)" }}
                                    />
                                    <p className="text-[10px] text-indigo-400/60 mt-1.5 ml-1">Used only for resolution updates. Will be masked publicly.</p>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {errorMsg && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-red-300"
                                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                                            <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting || checkingDuplicates}
                                    className="w-full h-[52px] rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2.5 transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                                        boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                                    }}
                                >
                                    {checkingDuplicates ? (
                                        <><RefreshCw className="w-4 h-4 animate-spin" /> Checking for duplicates…</>
                                    ) : submitting ? (
                                        <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting…</>
                                    ) : (
                                        <><Send className="w-4 h-4" /> Submit Report</>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ── STEP 4: SUCCESS ──────────────────────────────────── */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="flex flex-col items-center text-center py-10 gap-6">

                            {/* Success ring */}
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 0 0 12px rgba(34,197,94,0.12), 0 16px 40px rgba(34,197,94,0.35)" }}>
                                    <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={1.5} />
                                </div>
                                {/* Pulse rings */}
                                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white">{successData?.message || 'Report Submitted!'}</h2>
                                <p className="text-indigo-300 text-sm mt-2">
                                    {successData?.message
                                        ? `Complaint ID: #${successData.id}`
                                        : `Ticket ID #${successData?.id} has been raised with the municipal authority.`
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <Link href="/citizen-dashboard"
                                    className="w-full h-12 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                    style={{ background: "linear-gradient(135deg,#6366f1,#4338ca)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
                                    Back to Dashboard
                                </Link>
                                <button onClick={() => window.location.reload()}
                                    className="w-full h-12 rounded-2xl font-bold text-indigo-300 text-sm border border-indigo-500/30 hover:bg-indigo-500/10 transition-all">
                                    Submit Another Report
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

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
