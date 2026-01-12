import React, { useState, useEffect } from "react";
import {
  Save,
  Heart,
  CreditCard,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface DonateContent {
  heroTitleTurkish: string;
  heroTitleGerman: string;
  heroSubtitleTurkish: string;
  heroSubtitleGerman: string;
  heroImageUrl: string;

  accountHolder: string;
  iban: string;
  bic: string;
  bankName: string;

  contentTurkish: string;
  contentGerman: string;
}

const AdminDonate: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const [content, setContent] = useState<DonateContent>({
    heroTitleTurkish: "Bize Destek Olun",
    heroTitleGerman: "Unterstützen Sie uns",
    heroSubtitleTurkish:
      "Kültürel faaliyetlerimizi destekleyerek topluma katkıda bulunun",
    heroSubtitleGerman:
      "Unterstützen Sie unsere kulturellen Aktivitäten und tragen Sie zur Gesellschaft bei",
    heroImageUrl: "",

    accountHolder: "Kultur Platform Frankfurt e.V.",
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
    bankName: "Commerzbank",

    contentTurkish: "",
    contentGerman: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call yapılacak
      console.log("Bağış sayfası güncellendi:", content);
      alert("Bağış sayfası başarıyla güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Bağış Sayfası / Spendenseite
        </h1>
        <p className="text-slate-600">
          Bağış sayfası içeriğini ve banka bilgilerini düzenleyin
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="pb-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Heart size={24} className="text-kpf-red" />
              Hero Bölümü
            </h2>

            <div className="space-y-4">
              {/* Turkish Hero Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ana Başlık (Türkçe)
                </label>
                <input
                  type="text"
                  value={content.heroTitleTurkish}
                  onChange={(e) =>
                    setContent({ ...content, heroTitleTurkish: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Bize Destek Olun"
                />
              </div>

              {/* German Hero Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Haupttitel (Deutsch)
                </label>
                <input
                  type="text"
                  value={content.heroTitleGerman}
                  onChange={(e) =>
                    setContent({ ...content, heroTitleGerman: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Unterstützen Sie uns"
                />
              </div>

              {/* Turkish Hero Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Alt Başlık (Türkçe)
                </label>
                <input
                  type="text"
                  value={content.heroSubtitleTurkish}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      heroSubtitleTurkish: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Kültürel faaliyetlerimizi destekleyin"
                />
              </div>

              {/* German Hero Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Untertitel (Deutsch)
                </label>
                <input
                  type="text"
                  value={content.heroSubtitleGerman}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      heroSubtitleGerman: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Unterstützen Sie unsere kulturellen Aktivitäten"
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={18} />
                    Arkaplan Görseli / Hintergrundbild
                  </div>
                </label>
                <input
                  type="url"
                  value={content.heroImageUrl}
                  onChange={(e) =>
                    setContent({ ...content, heroImageUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="https://example.com/hero-image.jpg"
                />
                {content.heroImageUrl && (
                  <img
                    src={content.heroImageUrl}
                    alt="Hero Preview"
                    className="mt-4 w-full max-w-2xl rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="pb-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 size={24} className="text-kpf-teal" />
              Banka Bilgileri / Bankverbindung
            </h2>

            <div className="space-y-4">
              {/* Account Holder */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hesap Sahibi / Kontoinhaber
                </label>
                <input
                  type="text"
                  value={content.accountHolder}
                  onChange={(e) =>
                    setContent({ ...content, accountHolder: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Kultur Platform Frankfurt e.V."
                />
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} />
                    IBAN
                  </div>
                </label>
                <input
                  type="text"
                  value={content.iban}
                  onChange={(e) =>
                    setContent({ ...content, iban: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all font-mono"
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
              </div>

              {/* BIC */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  BIC / SWIFT
                </label>
                <input
                  type="text"
                  value={content.bic}
                  onChange={(e) =>
                    setContent({ ...content, bic: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all font-mono"
                  placeholder="COBADEFFXXX"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Banka Adı / Bankname
                </label>
                <input
                  type="text"
                  value={content.bankName}
                  onChange={(e) =>
                    setContent({ ...content, bankName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Commerzbank"
                />
              </div>
            </div>
          </div>

          {/* Additional Content */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Ek İçerik / Zusätzlicher Inhalt
            </h2>

            {/* Turkish Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Açıklama (Türkçe)
              </label>
              <textarea
                value={content.contentTurkish}
                onChange={(e) =>
                  setContent({ ...content, contentTurkish: e.target.value })
                }
                rows={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                placeholder="Bağışlar hakkında ek bilgiler..."
              />
            </div>

            {/* German Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Beschreibung (Deutsch)
              </label>
              <textarea
                value={content.contentGerman}
                onChange={(e) =>
                  setContent({ ...content, contentGerman: e.target.value })
                }
                rows={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                placeholder="Zusätzliche Informationen über Spenden..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg"
          >
            <Save size={20} />
            {loading ? t("admin_loading") : t("admin_save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDonate;
