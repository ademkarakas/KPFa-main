import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Save,
  Heart,
  CreditCard,
  Building2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  FileText,
  Globe,
} from "lucide-react";

interface DonatePageData {
  id: string;
  heroTitleTr: string;
  heroTitleDe: string;
  heroSubtitleTr: string;
  heroSubtitleDe: string;
  heroImageUrl: string;
  feature1TitleTr: string;
  feature1TitleDe: string;
  feature2TitleTr: string;
  feature2TitleDe: string;
  feature3TitleTr: string;
  feature3TitleDe: string;
  whyDonateTitleTr: string;
  whyDonateTitleDe: string;
  whyDonateDescriptionTr: string;
  whyDonateDescriptionDe: string;
  whereTitleTr: string;
  whereTitleDe: string;
  whereDescriptionTr: string;
  whereDescriptionDe: string;
  taxInfoTr: string;
  taxInfoDe: string;
  accountHolder: string;
  iban: string;
  bicSwift: string;
  bankName: string;
  payPalUrl: string;
  payPalHandle: string;
  contentTr: string;
  contentDe: string;
}

const AdminDonate: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DonatePageData>({
    id: "",
    heroTitleTr: "",
    heroTitleDe: "",
    heroSubtitleTr: "",
    heroSubtitleDe: "",
    heroImageUrl: "",
    feature1TitleTr: "",
    feature1TitleDe: "",
    feature2TitleTr: "",
    feature2TitleDe: "",
    feature3TitleTr: "",
    feature3TitleDe: "",
    whyDonateTitleTr: "",
    whyDonateTitleDe: "",
    whyDonateDescriptionTr: "",
    whyDonateDescriptionDe: "",
    whereTitleTr: "",
    whereTitleDe: "",
    whereDescriptionTr: "",
    whereDescriptionDe: "",
    taxInfoTr: "",
    taxInfoDe: "",
    accountHolder: "",
    iban: "",
    bicSwift: "",
    bankName: "",
    payPalUrl: "",
    payPalHandle: "",
    contentTr: "",
    contentDe: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    globalThis.location.href = "/admin/login";
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await fetch("https://localhost:7189/api/DonatePage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          handleUnauthorized();
          return;
        }

        if (res.ok) {
          const json: DonatePageData = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("DonatePage verisi yüklenemedi:", error);
        showNotification("error", t("adminDonate.notifications.loadFailed"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://localhost:7189/api/DonatePage/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        showNotification("success", t("adminDonate.notifications.updated"));
      } else {
        const errorText = await res.text();
        showNotification(
          "error",
          `${t("adminDonate.notifications.updateFailed")}: ${errorText}`,
        );
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      showNotification("error", t("adminDonate.notifications.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof DonatePageData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-teal mx-auto mb-4"></div>
          <p className="text-slate-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transform transition-all duration-500 animate-slide-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="text-emerald-500" size={24} />
          ) : (
            <AlertCircle className="text-red-500" size={24} />
          )}
          <span className="font-semibold">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Sticky Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Heart className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("adminDonate.pageTitle")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {t("adminDonate.pageSubtitle")}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Save size={18} />
            {saving ? t("common.saving") : t("common.publish")}
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-8">
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Heart size={24} className="text-kpf-teal" />
                {t("adminDonate.sections.hero")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.heroTitleTr")}
                  </label>
                  <input
                    type="text"
                    value={data.heroTitleTr}
                    onChange={(e) => updateField("heroTitleTr", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder={t("adminDonate.placeholders.heroTitleTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.heroTitleDe")}
                  </label>
                  <input
                    type="text"
                    value={data.heroTitleDe}
                    onChange={(e) => updateField("heroTitleDe", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder={t("adminDonate.placeholders.heroTitleDe")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.heroSubtitleTr")}
                  </label>
                  <input
                    type="text"
                    value={data.heroSubtitleTr}
                    onChange={(e) =>
                      updateField("heroSubtitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder={t("adminDonate.placeholders.heroSubtitleTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.heroSubtitleDe")}
                  </label>
                  <input
                    type="text"
                    value={data.heroSubtitleDe}
                    onChange={(e) =>
                      updateField("heroSubtitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder={t("adminDonate.placeholders.heroSubtitleDe")}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={18} />
                    {t("adminDonate.labels.heroImageUrl")}
                  </div>
                </label>
                <input
                  type="url"
                  value={data.heroImageUrl}
                  onChange={(e) => updateField("heroImageUrl", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder={t("adminDonate.placeholders.heroImageUrl")}
                />
                {data.heroImageUrl && (
                  <img
                    src={data.heroImageUrl}
                    alt={t("adminDonate.labels.heroImagePreviewAlt")}
                    className="mt-4 w-full max-w-md rounded-xl shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles size={24} className="text-amber-500" />
                {t("adminDonate.sections.features")}
              </h2>

              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    {t("adminDonate.labels.feature1")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.tr")}
                      </label>
                      <input
                        type="text"
                        value={data.feature1TitleTr}
                        onChange={(e) =>
                          updateField("feature1TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature1TitleTr",
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.de")}
                      </label>
                      <input
                        type="text"
                        value={data.feature1TitleDe}
                        onChange={(e) =>
                          updateField("feature1TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature1TitleDe",
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    {t("adminDonate.labels.feature2")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.tr")}
                      </label>
                      <input
                        type="text"
                        value={data.feature2TitleTr}
                        onChange={(e) =>
                          updateField("feature2TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature2TitleTr",
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.de")}
                      </label>
                      <input
                        type="text"
                        value={data.feature2TitleDe}
                        onChange={(e) =>
                          updateField("feature2TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature2TitleDe",
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    {t("adminDonate.labels.feature3")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.tr")}
                      </label>
                      <input
                        type="text"
                        value={data.feature3TitleTr}
                        onChange={(e) =>
                          updateField("feature3TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature3TitleTr",
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        {t("adminDonate.labels.de")}
                      </label>
                      <input
                        type="text"
                        value={data.feature3TitleDe}
                        onChange={(e) =>
                          updateField("feature3TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder={t(
                          "adminDonate.placeholders.feature3TitleDe",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Donate Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-purple-500" />
                {t("adminDonate.sections.whyDonate")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whyDonateTitleTr")}
                  </label>
                  <input
                    type="text"
                    value={data.whyDonateTitleTr}
                    onChange={(e) =>
                      updateField("whyDonateTitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.whyDonateTitleTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whyDonateTitleDe")}
                  </label>
                  <input
                    type="text"
                    value={data.whyDonateTitleDe}
                    onChange={(e) =>
                      updateField("whyDonateTitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.whyDonateTitleDe")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whyDonateDescriptionTr")}
                  </label>
                  <textarea
                    value={data.whyDonateDescriptionTr}
                    onChange={(e) =>
                      updateField("whyDonateDescriptionTr", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t(
                      "adminDonate.placeholders.whyDonateDescriptionTr",
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whyDonateDescriptionDe")}
                  </label>
                  <textarea
                    value={data.whyDonateDescriptionDe}
                    onChange={(e) =>
                      updateField("whyDonateDescriptionDe", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t(
                      "adminDonate.placeholders.whyDonateDescriptionDe",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Where Does It Go Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Globe size={24} className="text-teal-500" />
                {t("adminDonate.sections.where")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whereTitleTr")}
                  </label>
                  <input
                    type="text"
                    value={data.whereTitleTr}
                    onChange={(e) =>
                      updateField("whereTitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.whereTitleTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whereTitleDe")}
                  </label>
                  <input
                    type="text"
                    value={data.whereTitleDe}
                    onChange={(e) =>
                      updateField("whereTitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.whereTitleDe")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whereDescriptionTr")}
                  </label>
                  <textarea
                    value={data.whereDescriptionTr}
                    onChange={(e) =>
                      updateField("whereDescriptionTr", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t(
                      "adminDonate.placeholders.whereDescriptionTr",
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.whereDescriptionDe")}
                  </label>
                  <textarea
                    value={data.whereDescriptionDe}
                    onChange={(e) =>
                      updateField("whereDescriptionDe", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t(
                      "adminDonate.placeholders.whereDescriptionDe",
                    )}
                  />
                </div>
              </div>

              {/* Tax Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.taxInfoTr")}
                  </label>
                  <textarea
                    value={data.taxInfoTr}
                    onChange={(e) => updateField("taxInfoTr", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t("adminDonate.placeholders.taxInfoTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.taxInfoDe")}
                  </label>
                  <textarea
                    value={data.taxInfoDe}
                    onChange={(e) => updateField("taxInfoDe", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t("adminDonate.placeholders.taxInfoDe")}
                  />
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 size={24} className="text-kpf-teal" />
                {t("adminDonate.sections.bank")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="donate-accountHolder"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("adminDonate.labels.accountHolder")}
                  </label>
                  <input
                    id="donate-accountHolder"
                    type="text"
                    value={data.accountHolder}
                    onChange={(e) =>
                      updateField("accountHolder", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.accountHolder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="donate-bankName"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("adminDonate.labels.bankName")}
                  </label>
                  <input
                    id="donate-bankName"
                    type="text"
                    value={data.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.bankName")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="donate-iban"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard size={18} />
                      {t("adminDonate.labels.iban")}
                    </span>
                  </label>
                  <input
                    id="donate-iban"
                    type="text"
                    value={data.iban}
                    onChange={(e) => updateField("iban", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal font-mono"
                    placeholder={t("adminDonate.placeholders.iban")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="donate-bicSwift"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("adminDonate.labels.bicSwift")}
                  </label>
                  <input
                    id="donate-bicSwift"
                    type="text"
                    value={data.bicSwift}
                    onChange={(e) => updateField("bicSwift", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal font-mono"
                    placeholder={t("adminDonate.placeholders.bicSwift")}
                  />
                </div>
              </div>
            </div>

            {/* PayPal Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  className="h-6"
                />
                {t("adminDonate.sections.paypal")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="donate-payPalUrl"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("adminDonate.labels.payPalUrl")}
                  </label>
                  <input
                    id="donate-payPalUrl"
                    type="url"
                    value={data.payPalUrl}
                    onChange={(e) => updateField("payPalUrl", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.payPalUrl")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="donate-payPalHandle"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("adminDonate.labels.payPalHandle")}
                  </label>
                  <input
                    id="donate-payPalHandle"
                    type="text"
                    value={data.payPalHandle}
                    onChange={(e) =>
                      updateField("payPalHandle", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder={t("adminDonate.placeholders.payPalHandle")}
                  />
                </div>
              </div>

              {/* PayPal Content */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.payPalContentTr")}
                  </label>
                  <textarea
                    value={data.contentTr}
                    onChange={(e) => updateField("contentTr", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t("adminDonate.placeholders.payPalContentTr")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("adminDonate.labels.payPalContentDe")}
                  </label>
                  <textarea
                    value={data.contentDe}
                    onChange={(e) => updateField("contentDe", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder={t("adminDonate.placeholders.payPalContentDe")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminDonate;
