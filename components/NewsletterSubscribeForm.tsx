import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import newsletterApi from "../services/newsletterApi";

const NewsletterSubscribeForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error(t("newsletter.messages.invalidEmail"));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t("newsletter.messages.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      const result = await newsletterApi.subscribe(email);

      if (result.success) {
        setSubscribed(true);
        setEmail("");
        toast.success(t("newsletter.messages.subscribeSuccess"), {
          duration: 5000,
          icon: "📧",
        });

        // Reset success state after 5 seconds
        setTimeout(() => {
          setSubscribed(false);
        }, 5000);
      } else {
        toast.error(result.message || t("newsletter.messages.subscribeError"));
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error(t("newsletter.messages.subscribeError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
        <Mail size={20} />
        {t("newsletter.footer.title")}
      </h4>
      <p className="text-sm text-slate-400 mb-6">
        {t("newsletter.footer.subtitle")}
      </p>

      {subscribed ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
          <p className="text-sm text-green-100">
            {t("newsletter.messages.subscribeSuccess")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.footer.emailPlaceholder")}
              disabled={loading}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kpf-teal hover:bg-teal-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 hover:shadow-xl hover:shadow-teal-900/30 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {t("newsletter.footer.subscribing")}
              </>
            ) : (
              <>
                <Mail size={18} />
                {t("newsletter.footer.subscribeButton")}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default React.memo(NewsletterSubscribeForm);
