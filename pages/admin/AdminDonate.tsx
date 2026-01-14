import React, { useState, useEffect } from "react";
import {
  Save,
  Heart,
  CreditCard,
  Building2,
  Image as ImageIcon,
  CheckCircle,
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
    <div className="max-w-7xl mx-auto pb-20 px-4">
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
                Bağış sayfası içeriğini ve banka bilgilerini düzenleyin
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-red text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-red/20 font-bold"
          >
            <Save size={18} />
            {loading ? "Kaydediliyor..." : "Sitede Yayınla"}
          </button>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-8">
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
                      setContent({
                        ...content,
                        heroTitleTurkish: e.target.value,
                      })
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
                      setContent({
                        ...content,
                        heroTitleGerman: e.target.value,
                      })
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminDonate;
