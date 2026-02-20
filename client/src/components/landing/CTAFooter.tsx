"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, Linkedin, Github, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

// ─── Floating Blob ────────────────────────────────────────────────────────────
const FloatingBlob = ({
    className,
    style,
}: {
    className?: string;
    style?: React.CSSProperties;
}) => (
    <div
        className={`absolute rounded-full pointer-events-none blur-[120px] ${className}`}
        style={style}
    />
);

// ─── CTA Card ─────────────────────────────────────────────────────────────────
const CTACard = ({
    icon,
    role,
    sub,
    btnLabel,
    accent,
    footerNote,
    perks,
    delay,
}: {
    icon: string;
    role: string;
    sub: string;
    btnLabel: string;
    accent: "orange" | "indigo";
    footerNote: string;
    perks: string[];
    delay: number;
}) => {
    const isOrange = accent === "orange";

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay }}
            whileHover={{ y: -8, scale: 1.01 }}
            className={`relative flex-1 max-w-md bg-white rounded-3xl p-8 border shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${isOrange
                ? "border-vibrant-orange/20 hover:border-vibrant-orange/40 hover:shadow-vibrant-orange/10"
                : "border-electric-indigo/20 hover:border-electric-indigo/40 hover:shadow-electric-indigo/10"
                }`}
        >
            {/* Top accent bar */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-500 ${isOrange
                    ? "bg-gradient-to-r from-vibrant-orange to-amber-400"
                    : "bg-gradient-to-r from-electric-indigo to-violet-500"
                    }`}
            />

            {/* Subtle inner glow on hover */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl ${isOrange
                    ? "bg-gradient-to-br from-vibrant-orange/4 via-transparent to-transparent"
                    : "bg-gradient-to-br from-electric-indigo/4 via-transparent to-transparent"
                    }`}
            />

            <div className="relative z-10">
                {/* Icon */}
                <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${isOrange ? "bg-vibrant-orange/10" : "bg-electric-indigo/10"
                        }`}
                >
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-light-text-heading mb-2 tracking-tight">{role}</h3>
                <p className="text-light-text-body text-sm leading-relaxed mb-6">{sub}</p>

                {/* Perks */}
                <ul className="space-y-2 mb-7">
                    {perks.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-light-text-body">
                            <CheckCircle2
                                className={`w-4 h-4 shrink-0 ${isOrange ? "text-vibrant-orange" : "text-electric-indigo"
                                    }`}
                            />
                            {p}
                        </li>
                    ))}
                </ul>

                <button
                    className={`group/btn w-full flex items-center justify-center gap-2 h-[52px] px-6 rounded-full font-bold text-sm transition-all duration-300 ${isOrange
                        ? "bg-vibrant-orange text-white shadow-lg shadow-vibrant-orange/25 hover:shadow-vibrant-orange/40 hover:scale-[1.02]"
                        : "bg-electric-indigo text-white shadow-lg shadow-electric-indigo/25 hover:shadow-electric-indigo/40 hover:scale-[1.02]"
                        }`}
                >
                    {btnLabel}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-slate-400 text-xs mt-4">{footerNote}</p>
            </div>
        </motion.div>
    );
};

// ─── Footer Link Group ────────────────────────────────────────────────────────
const FooterLinkGroup = ({
    title,
    links,
}: {
    title: string;
    links: { label: string; dimmed?: boolean }[];
}) => (
    <div>
        <h4 className="text-light-text-heading font-semibold text-sm mb-5 tracking-wider uppercase">{title}</h4>
        <ul className="space-y-3">
            {links.map((l) => (
                <li key={l.label}>
                    <a
                        href="#"
                        className={`text-sm transition-colors duration-200 ${l.dimmed
                            ? "text-slate-400 cursor-not-allowed hover:text-slate-400"
                            : "text-light-text-body hover:text-vibrant-orange"
                            }`}
                    >
                        {l.label}
                        {l.dimmed && (
                            <span className="ml-2 text-[10px] border border-slate-300 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Soon
                            </span>
                        )}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
export const CTAFooter = () => {
    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════
                FINAL CTA SECTION — Light Theme
            ═══════════════════════════════════════════════════════════════ */}
            <section id="for-cities" className="relative w-full overflow-hidden bg-light-bg py-32 selection:bg-vibrant-orange/20 selection:text-electric-indigo">

                {/* Subtle grid (same as Hero) */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`,
                    }}
                />

                {/* Radial blobs */}
                <FloatingBlob className="w-[700px] h-[700px] bg-electric-indigo/8 -top-32 -left-40" />
                <FloatingBlob className="w-[500px] h-[500px] bg-vibrant-orange/7 bottom-0 right-0 translate-y-1/4" />
                <FloatingBlob className="w-[400px] h-[400px] bg-electric-indigo/5 bottom-0 left-1/3" />

                {/* Decorative circles */}
                <div className="absolute top-12 right-16 w-24 h-24 rounded-full border border-electric-indigo/10 pointer-events-none" />
                <div className="absolute top-20 right-24 w-12 h-12 rounded-full border border-vibrant-orange/15 pointer-events-none" />
                <div className="absolute bottom-20 left-16 w-20 h-20 rounded-full border border-electric-indigo/10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12">

                    {/* Top Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-indigo/8 border border-electric-indigo/20">
                            <Sparkles className="w-3.5 h-3.5 text-electric-indigo" />
                            <span className="text-xs font-bold text-electric-indigo tracking-[0.2em] uppercase">
                                Join the Movement
                            </span>
                        </div>
                    </motion.div>

                    {/* Massive Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-center mb-6"
                    >
                        <h2
                            className="font-extrabold tracking-tight leading-[1.05] text-light-text-heading"
                            style={{ fontSize: "clamp(44px, 6.5vw, 72px)" }}
                        >
                            Your City Is{" "}
                            <span
                                className="relative inline-block bg-clip-text text-transparent"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg, #4F46E5 0%, #7C3AED 40%, #FF6B35 100%)",
                                }}
                            >
                                Waiting For You.
                                {/* Underline squiggle */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 400 12"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 8 Q 50 2 100 8 Q 150 14 200 8 Q 250 2 300 8 Q 350 14 400 8"
                                        stroke="url(#wg)"
                                        strokeWidth="2.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        opacity="0.5"
                                    />
                                    <defs>
                                        <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4F46E5" />
                                            <stop offset="100%" stopColor="#FF6B35" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </h2>
                    </motion.div>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        className="text-light-text-body max-w-2xl mx-auto text-center leading-relaxed mb-6"
                        style={{ fontSize: "clamp(15px, 1.6vw, 20px)" }}
                    >
                        Every pothole, every broken light, every overflowing drain — it's one tap away from being fixed.
                        Be the citizen your city needs.
                    </motion.p>

                    {/* Social proof mini row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="flex items-center justify-center gap-6 mb-16 text-sm text-light-text-body"
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="text-electric-indigo font-bold">124K+</span> issues resolved
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1.5">
                            <span className="text-vibrant-orange font-bold">89%</span> citizen satisfaction
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1.5">
                            <span className="text-electric-indigo font-bold">47</span> cities onboarded
                        </span>
                    </motion.div>

                    {/* Two Path Cards */}
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-0">
                        <CTACard
                            icon="📱"
                            role="I'm a Citizen"
                            sub="Report your first civic issue in under 60 seconds. No bureaucracy, no waiting — just results."
                            btnLabel="Start Reporting"
                            accent="orange"
                            footerNote="No signup needed to browse issues"
                            perks={[
                                "Real-time complaint tracking",
                                "Photo & location upload",
                                "Instant ward officer notifications",
                            ]}
                            delay={0.3}
                        />

                        {/* Divider */}
                        <div className="flex md:flex-col items-center gap-3 mx-4 md:mx-10 shrink-0 py-4 md:py-0">
                            <div className="w-16 h-px md:w-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-light-border to-transparent" />
                            <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase px-2 md:px-0 py-0 md:py-2 bg-light-bg">
                                or
                            </span>
                            <div className="w-16 h-px md:w-px md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-light-border to-transparent" />
                        </div>

                        <CTACard
                            icon="🏛️"
                            role="I'm a Municipal Officer"
                            sub="Request your city's admin access. Full dashboard, analytics, and team management included."
                            btnLabel="Request Admin Access"
                            accent="indigo"
                            footerNote="Free for verified government bodies"
                            perks={[
                                "Ward-level complaint management",
                                "Priority scoring & AI triage",
                                "Live analytics dashboard",
                            ]}
                            delay={0.45}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                FOOTER — Light Theme
            ═══════════════════════════════════════════════════════════════ */}
            <footer className="w-full bg-slate-900 border-t border-slate-800">

                {/* Top Footer */}
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* COL 1 – Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vibrant-orange to-electric-indigo flex items-center justify-center shadow-md">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-extrabold text-lg tracking-tight">NagarSeva</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-xs">
                            Making Indian cities smarter, one complaint at a time.
                        </p>
                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
                                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                                { icon: <Github className="w-4 h-4" />, label: "GitHub" },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href="#"
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-vibrant-orange hover:border-vibrant-orange/40 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* COL 2 – Platform */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-5 tracking-wider uppercase">Platform</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Report an Issue" },
                                { label: "Track Complaints" },
                                { label: "View City Map" },
                                { label: "Download App", dimmed: true },
                            ].map((l) => (
                                <li key={l.label}>
                                    <a href="#" className={`text-sm transition-colors duration-200 ${l.dimmed ? "text-slate-600 cursor-not-allowed" : "text-slate-400 hover:text-vibrant-orange"}`}>
                                        {l.label}
                                        {l.dimmed && <span className="ml-2 text-[10px] border border-slate-700 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Soon</span>}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 3 – For Cities */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-5 tracking-wider uppercase">For Cities</h4>
                        <ul className="space-y-3">
                            {["Municipal Onboarding", "Admin Dashboard", "Analytics Suite", "API Documentation"].map((l) => (
                                <li key={l}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-vibrant-orange transition-colors duration-200">{l}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 4 – About */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-5 tracking-wider uppercase">About</h4>
                        <ul className="space-y-3">
                            {["About NagarSeva", "Smart City Mission", "Privacy Policy", "Terms of Service", "Contact Us"].map((l) => (
                                <li key={l}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-vibrant-orange transition-colors duration-200">{l}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800">
                    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-xs text-center md:text-left">
                            © 2026 NagarSeva. Built for Smart City Mission, Ministry of Housing &amp; Urban Affairs, India{" "}
                            🇮🇳
                        </p>
                        <p className="text-slate-500 text-xs">
                            Made with <span className="text-vibrant-orange">❤️</span> for Indian Citizens
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};
