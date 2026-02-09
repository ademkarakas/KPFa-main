import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import newsletterApi from "../services/newsletterApi";
import { Language } from "../types";

interface NewsletterUnsubscribeProps {
  lang: Language;
  setPage: (page: string) => void;
}

type UnsubscribeStatus = "loading" | "success" | "error";

const NewsletterUnsubscribe: React.FC<NewsletterUnsubscribeProps> = ({
  lang,
  setPage,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<UnsubscribeStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribeFromNewsletter = async () => {
      // Get token from URL query parameters
      const urlParams = new URLSearchParams(globalThis.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(t("newsletter.unsubscribe.errorMessage"));
        return;
      }

      try {
        const result = await newsletterApi.unsubscribe(token);

        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(
            result.message || t("newsletter.unsubscribe.errorMessage"),
          );
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        setMessage(t("newsletter.unsubscribe.errorMessage"));
      }
    };

    unsubscribeFromNewsletter();
  }, [t]);

  const handleBackToHome = () => {
    globalThis.location.hash = "";
    setPage("home");
  };

  const handleResubscribe = () => {
    globalThis.location.hash = "";
    setPage("home");
    // Scroll to footer after a short delay
    setTimeout(() => {
      globalThis.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full relative">
        {/* Loading State */}
        {status === "loading" && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-orange-500">
            <div className="flex justify-center mb-6">
              <Loader2
                className="text-orange-500 animate-spin"
                size={64}
                strokeWidth={2}
              />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              {t("newsletter.unsubscribe.loading")}
            </h1>
            <p className="text-slate-600">
              {lang === "tr" ? "Lütfen bekleyin..." : "Bitte warten Sie..."}
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-orange-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 rounded-full p-6">
                <CheckCircle
                  className="text-orange-600"
                  size={64}
                  strokeWidth={2}
                />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              {t("newsletter.unsubscribe.successTitle")}
            </h1>
            <p className="text-lg text-slate-600 mb-4">{message}</p>
            <p className="text-sm text-slate-500 mb-8">
              {lang === "tr"
                ? "Fikrini değiştirirsen, her zaman tekrar abone olabilirsin."
                : "Sie können jederzeit wieder abonnieren, wenn Sie Ihre Meinung ändern."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t("newsletter.unsubscribe.backToHome")}
              </button>
              <button
                onClick={handleResubscribe}
                className="bg-kpf-teal hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Heart size={20} />
                {t("newsletter.unsubscribe.resubscribe")}
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-red-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-6">
                <XCircle className="text-red-600" size={64} strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              {t("newsletter.unsubscribe.errorTitle")}
            </h1>
            <p className="text-lg text-slate-600 mb-8">{message}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t("newsletter.unsubscribe.backToHome")}
              </button>
              <button
                onClick={handleResubscribe}
                className="bg-kpf-teal hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Mail size={20} />
                {lang === "tr" ? "Tekrar Abone Ol" : "Erneut abonnieren"}
              </button>
            </div>
          </div>
        )}

        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kpf-teal/10 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe;
