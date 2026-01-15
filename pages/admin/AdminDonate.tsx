import React, { useState, useEffect } from "react";
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
    window.location.href = "/admin/login";
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
        showNotification("error", "Veriler yüklenirken hata oluştu!");
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
        }
      );

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        showNotification("success", "Bağış sayfası başarıyla güncellendi!");
      } else {
        const errorText = await res.text();
        showNotification("error", `Güncelleme başarısız: ${errorText}`);
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      showNotification("error", "Güncelleme sırasında hata oluştu!");
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-red mx-auto mb-4"></div>
          <p className="text-slate-600">Yükleniyor...</p>
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
            <div className="p-3 bg-kpf-red/10 rounded-2xl">
              <Heart className="text-kpf-red" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                Bağış Sayfası / Spendenseite
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                Bağış sayfası içeriğini düzenleyin
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-red text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-red/20 font-bold"
          >
            <Save size={18} />
            {saving ? "Kaydediliyor..." : "Sitede Yayınla"}
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-8">
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Heart size={24} className="text-kpf-red" />
                Hero Bölümü
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Ana Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={data.heroTitleTr}
                    onChange={(e) => updateField("heroTitleTr", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder="Bize Destek Olun"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Haupttitel (Deutsch)
                  </label>
                  <input
                    type="text"
                    value={data.heroTitleDe}
                    onChange={(e) => updateField("heroTitleDe", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder="Unterstützen Sie uns"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Alt Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={data.heroSubtitleTr}
                    onChange={(e) =>
                      updateField("heroSubtitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder="Kültürel faaliyetlerimizi destekleyin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Untertitel (Deutsch)
                  </label>
                  <input
                    type="text"
                    value={data.heroSubtitleDe}
                    onChange={(e) =>
                      updateField("heroSubtitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    placeholder="Unterstützen Sie unsere kulturellen Aktivitäten"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={18} />
                    Hero Görseli URL
                  </div>
                </label>
                <input
                  type="url"
                  value={data.heroImageUrl}
                  onChange={(e) => updateField("heroImageUrl", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="https://example.com/hero-image.jpg"
                />
                {data.heroImageUrl && (
                  <img
                    src={data.heroImageUrl}
                    alt="Hero Preview"
                    className="mt-4 w-full max-w-md rounded-xl shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles size={24} className="text-amber-500" />
                Öne Çıkan Özellikler (3 Kutu)
              </h2>

              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Özellik 1
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇹🇷 Türkçe
                      </label>
                      <input
                        type="text"
                        value={data.feature1TitleTr}
                        onChange={(e) =>
                          updateField("feature1TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Güvenli Bağış"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇩🇪 Deutsch
                      </label>
                      <input
                        type="text"
                        value={data.feature1TitleDe}
                        onChange={(e) =>
                          updateField("feature1TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Sichere Spende"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Özellik 2
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇹🇷 Türkçe
                      </label>
                      <input
                        type="text"
                        value={data.feature2TitleTr}
                        onChange={(e) =>
                          updateField("feature2TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Vergi Makbuzu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇩🇪 Deutsch
                      </label>
                      <input
                        type="text"
                        value={data.feature2TitleDe}
                        onChange={(e) =>
                          updateField("feature2TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Spendenquittung"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Özellik 3
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇹🇷 Türkçe
                      </label>
                      <input
                        type="text"
                        value={data.feature3TitleTr}
                        onChange={(e) =>
                          updateField("feature3TitleTr", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Şeffaflık"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        🇩🇪 Deutsch
                      </label>
                      <input
                        type="text"
                        value={data.feature3TitleDe}
                        onChange={(e) =>
                          updateField("feature3TitleDe", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        placeholder="Transparenz"
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
                Neden Bağış? Bölümü
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={data.whyDonateTitleTr}
                    onChange={(e) =>
                      updateField("whyDonateTitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Neden Bağış Yapmalısınız?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Titel (Deutsch)
                  </label>
                  <input
                    type="text"
                    value={data.whyDonateTitleDe}
                    onChange={(e) =>
                      updateField("whyDonateTitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Warum spenden?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Açıklama (Türkçe)
                  </label>
                  <textarea
                    value={data.whyDonateDescriptionTr}
                    onChange={(e) =>
                      updateField("whyDonateDescriptionTr", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Neden bağış yapılmalı açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Beschreibung (Deutsch)
                  </label>
                  <textarea
                    value={data.whyDonateDescriptionDe}
                    onChange={(e) =>
                      updateField("whyDonateDescriptionDe", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Beschreibung warum spenden..."
                  />
                </div>
              </div>
            </div>

            {/* Where Does It Go Section */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Globe size={24} className="text-teal-500" />
                Bağışlar Nereye Gidiyor? Bölümü
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={data.whereTitleTr}
                    onChange={(e) =>
                      updateField("whereTitleTr", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Bağışlarınız Nereye Gidiyor?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Titel (Deutsch)
                  </label>
                  <input
                    type="text"
                    value={data.whereTitleDe}
                    onChange={(e) =>
                      updateField("whereTitleDe", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Wohin gehen Ihre Spenden?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Açıklama (Türkçe)
                  </label>
                  <textarea
                    value={data.whereDescriptionTr}
                    onChange={(e) =>
                      updateField("whereDescriptionTr", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Bağışlar nereye gidiyor açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Beschreibung (Deutsch)
                  </label>
                  <textarea
                    value={data.whereDescriptionDe}
                    onChange={(e) =>
                      updateField("whereDescriptionDe", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Beschreibung wohin gehen Spenden..."
                  />
                </div>
              </div>

              {/* Tax Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 Vergi Bilgisi (Türkçe)
                  </label>
                  <textarea
                    value={data.taxInfoTr}
                    onChange={(e) => updateField("taxInfoTr", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Bağışlar vergiden düşülebilir..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 Steuerinfo (Deutsch)
                  </label>
                  <textarea
                    value={data.taxInfoDe}
                    onChange={(e) => updateField("taxInfoDe", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Spenden sind steuerlich absetzbar..."
                  />
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 size={24} className="text-kpf-teal" />
                Banka Bilgileri / Bankverbindung
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hesap Sahibi / Kontoinhaber
                  </label>
                  <input
                    type="text"
                    value={data.accountHolder}
                    onChange={(e) =>
                      updateField("accountHolder", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Kultur Platform Frankfurt e.V."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Banka Adı / Bankname
                  </label>
                  <input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="Commerzbank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} />
                      IBAN
                    </div>
                  </label>
                  <input
                    type="text"
                    value={data.iban}
                    onChange={(e) => updateField("iban", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal font-mono"
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    BIC / SWIFT
                  </label>
                  <input
                    type="text"
                    value={data.bicSwift}
                    onChange={(e) => updateField("bicSwift", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal font-mono"
                    placeholder="COBADEFFXXX"
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
                PayPal Bilgileri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    PayPal URL
                  </label>
                  <input
                    type="url"
                    value={data.payPalUrl}
                    onChange={(e) => updateField("payPalUrl", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="https://paypal.me/kulturplatform"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    PayPal Handle
                  </label>
                  <input
                    type="text"
                    value={data.payPalHandle}
                    onChange={(e) =>
                      updateField("payPalHandle", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    placeholder="@kulturplatform"
                  />
                </div>
              </div>

              {/* PayPal Content */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇹🇷 PayPal Açıklama (Türkçe)
                  </label>
                  <textarea
                    value={data.contentTr}
                    onChange={(e) => updateField("contentTr", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="PayPal ile hızlı ve güvenli bağış yapın..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🇩🇪 PayPal Beschreibung (Deutsch)
                  </label>
                  <textarea
                    value={data.contentDe}
                    onChange={(e) => updateField("contentDe", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Spenden Sie schnell und sicher mit PayPal..."
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
