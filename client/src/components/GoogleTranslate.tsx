"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export default function GoogleTranslate() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        // 22 Listed Indian Languages + English
                        // hi=Hindi, bn=Bengali, te=Telugu, mr=Marathi, ta=Tamil, ur=Urdu, 
                        // gu=Gujarati, kn=Kannada, ml=Malayalam, or=Odia, pa=Punjabi, as=Assamese, 
                        // mai=Maithili, ne=Nepali, sd=Sindhi, sa=Sanskrit, ks=Kashmiri, 
                        // kok=Konkani, doi=Dogri, mni=Manipuri, brx=Bodo, sat=Santali
                        includedLanguages: "en,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,mai,ne,sd,sa,ks,kok,doi,mni,brx,sat",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };

        const existingScript = document.getElementById("google-translate-script");
        if (!existingScript) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.google && window.google.translate) {
            // Re-init if needed
            // window.googleTranslateElementInit(); 
        }

        setIsLoaded(true);
    }, []);

    return (
        <div className="relative group z-50">
            {/* Custom UI Trigger */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-gray-200/50 rounded-full cursor-pointer hover:bg-white/20 transition-all shadow-sm">
                <Globe className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-medium text-gray-700">Language</span>
            </div>

            {/* Hidden Native Widget Overlay */}
            <div
                id="google_translate_element"
                className="absolute inset-0 opacity-0 w-full h-full overflow-hidden cursor-pointer"
            ></div>

            {/* CSS to clean up Google's mess */}
            <style jsx global>{`
                /* Hide Top Banner */
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                
                /* Hide 'Powered by Google' branding if strictly needed, though T&C usually requires it */
                .goog-logo-link {
                    display: none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                }
                
                /* Customizing the dropdown iframe if possible (limited control) */
                #google_translate_element select {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
