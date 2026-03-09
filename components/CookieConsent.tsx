import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Language } from "../types";

interface CookieConsentProps {
  lang: Language;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>,
    ) => void;
  }
}

const CookieConsent: React.FC<CookieConsentProps> = ({ lang }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // 1 saniye bekleyip banner'ı göster
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);

    // GA4'ü etkinleştir
    const w = globalThis as typeof globalThis & Window;
    if (w.gtag) {
      w.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);

    // GA4'ü devre dışı bırak
    const w = globalThis as typeof globalThis & Window;
    if (w.gtag) {
      w.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!showBanner) return null;

  const texts = {
    title: {
      tr: "Çerez Kullanımı",
      de: "Cookie-Nutzung",
    },
    message: {
      tr: "Web sitemizde deneyiminizi geliştirmek ve trafiği analiz etmek için çerezler kullanıyoruz. Ayrıntılar için gizlilik politikamıza bakın.",
      de: "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern und den Traffic zu analysieren. Details finden Sie in unserer Datenschutzerklärung.",
    },
    accept: {
      tr: "Kabul Et",
      de: "Akzeptieren",
    },
    decline: {
      tr: "Reddet",
      de: "Ablehnen",
    },
    learnMore: {
      tr: "Daha Fazla Bilgi",
      de: "Mehr erfahren",
    },
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* İçerik */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {texts.title[lang]}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {texts.message[lang]}{" "}
              <a
                href="/privacy"
                className="text-kpf-teal underline hover:text-teal-600"
              >
                {texts.learnMore[lang]}
              </a>
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none bg-kpf-teal hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
            >
              {texts.accept[lang]}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
            >
              {texts.decline[lang]}
            </button>
          </div>

          {/* Kapat butonu */}
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
