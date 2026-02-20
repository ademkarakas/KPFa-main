import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import newsletterApi from "../services/newsletterApi";
import { Language, PageView } from "../types";
import { navigateTo } from "../utils/navigation";

interface NewsletterVerifyProps {
  lang: Language;
  setPage: (page: PageView) => void;
}

type VerifyStatus = "loading" | "success" | "error";

const NewsletterVerify: React.FC<NewsletterVerifyProps> = ({
  lang,
  setPage,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifySubscription = async () => {
      // Get token from URL query parameters
      const urlParams = new URLSearchParams(globalThis.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(t("newsletter.verify.errorMessage"));
        return;
      }

      try {
        const result = await newsletterApi.verify(token);

        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message || t("newsletter.verify.errorMessage"));
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(t("newsletter.verify.errorMessage"));
      }
    };

    verifySubscription();
  }, [t]);

  const handleBackToHome = () => {
    navigateTo("");
    setPage("home");
  };

  const handleSubscribeAgain = () => {
    navigateTo("");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Loading State */}
        {status === "loading" && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-kpf-teal">
            <div className="flex justify-center mb-6">
              <Loader2
                className="text-kpf-teal animate-spin"
                size={64}
                strokeWidth={2}
              />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              {t("newsletter.verify.loading")}
            </h1>
            <p className="text-slate-600">
              {lang === "tr" ? "Lütfen bekleyin..." : "Bitte warten Sie..."}
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-green-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircle
                  className="text-green-600"
                  size={64}
                  strokeWidth={2}
                />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              {t("newsletter.verify.successTitle")}
            </h1>
            <p className="text-lg text-slate-600 mb-8">{message}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-kpf-teal hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Mail size={20} />
                {t("newsletter.verify.backToHome")}
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
              {t("newsletter.verify.errorTitle")}
            </h1>
            <p className="text-lg text-slate-600 mb-8">{message}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackToHome}
                className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t("newsletter.verify.backToHome")}
              </button>
              <button
                onClick={handleSubscribeAgain}
                className="bg-kpf-teal hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Mail size={20} />
                {t("newsletter.verify.subscribeAgain")}
              </button>
            </div>
          </div>
        )}

        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-kpf-teal/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kpf-red/10 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default NewsletterVerify;
