import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface HeroContent {
  title_tr: string;
  title_de: string;
  subtitle_tr: string;
  subtitle_de: string;
  ctaPrimaryText_tr: string;
  ctaPrimaryText_de: string;
  cta2Text_tr: string;
  cta2Text_de: string;
}

interface Feature {
  id: string;
  title_tr: string;
  title_de: string;
  description_tr: string;
  description_de: string;
  icon: "users" | "sparkles" | "calendar";
}

interface InstagramSection {
  title_tr: string;
  title_de: string;
  description_tr: string;
  description_de: string;
  instagramHandle: string;
}

interface CTASection {
  title_tr: string;
  title_de: string;
  description_tr: string;
  description_de: string;
}

const AdminHome: React.FC = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title_tr: "KulturPlattform Freiburg",
    title_de: "KulturPlattform Freiburg",
    subtitle_tr: "Freiburg'un kültürü birleştiren platformu",
    subtitle_de: "Die Kulturplattform, die Freiburg verbindet",
    ctaPrimaryText_tr: "Etkinlikleri Gör",
    ctaPrimaryText_de: "Aktivitäten entdecken",
    cta2Text_tr: "Gönüllü Ol",
    cta2Text_de: "Freiwilliger werden",
  });

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title_tr: "Kültür ve Toplum",
      title_de: "Kultur und Gemeinschaft",
      description_tr: "Freiburg'da kültürün kalbi olmak",
      description_de: "Das Herz der Kultur in Freiburg sein",
      icon: "users",
    },
    {
      id: "2",
      title_tr: "Değerlerimiz",
      title_de: "Unsere Werte",
      description_tr: "Birlikte büyüyor, birlikte öğreniyoruz",
      description_de: "Zusammen wachsen, zusammen lernen",
      icon: "sparkles",
    },
    {
      id: "3",
      title_tr: "Etkinlikler",
      title_de: "Veranstaltungen",
      description_tr: "Tüm etkinlikleri keşfet",
      description_de: "Alle Veranstaltungen entdecken",
      icon: "calendar",
    },
  ]);

  const [instagramSection, setInstagramSection] = useState<InstagramSection>({
    title_tr: "Instagram'da Takip Et",
    title_de: "Folge uns auf Instagram",
    description_tr: "Son fotoğrafları ve güncelleri görmek için",
    description_de: "Siehe die neuesten Fotos und Updates",
    instagramHandle: "@kulturplattformfreiburg",
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title_tr: "Ailemize Katılın",
    title_de: "Werden Sie Teil unserer Familie",
    description_tr: "KulturPlattform Freiburg'un misyonuna katılın",
    description_de: "Treten Sie der Mission von KulturPlattform Freiburg bei",
  });

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  useEffect(() => {
    // API'den veri yükle
    loadHomeContent();
  }, []);

  const loadHomeContent = async () => {
    try {
      // TODO: API endpoint'inden verileri yükle
      console.log("Home content loading...");
    } catch (error) {
      console.error("Error loading home content:", error);
    }
  };

  const saveHeroContent = async () => {
    setSaving(true);
    try {
      // TODO: API'ye kaydet
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({
        type: "success",
        text:
          language === "tr"
            ? "Hero bölümü kaydedildi"
            : "Hero-Bereich gespeichert",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          language === "tr"
            ? "Kaydedilirken hata oluştu"
            : "Fehler beim Speichern",
      });
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      title_tr: "",
      title_de: "",
      description_tr: "",
      description_de: "",
      icon: "users",
    };
    setEditingFeature(newFeature);
  };

  const saveFeature = () => {
    if (!editingFeature) return;

    const isDuplicate = features.some(
      (f) => f.id === editingFeature.id && f.id !== editingFeature.id
    );

    if (editingFeature.id && features.find((f) => f.id === editingFeature.id)) {
      setFeatures(
        features.map((f) => (f.id === editingFeature.id ? editingFeature : f))
      );
    } else {
      setFeatures([...features, editingFeature]);
    }

    setEditingFeature(null);
    setMessage({
      type: "success",
      text: language === "tr" ? "Özellik kaydedildi" : "Funktion gespeichert",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const deleteFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
    setMessage({
      type: "success",
      text: language === "tr" ? "Özellik silindi" : "Funktion gelöscht",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveInstagramSection = async () => {
    setSaving(true);
    try {
      // TODO: API'ye kaydet
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({
        type: "success",
        text:
          language === "tr"
            ? "Instagram bölümü kaydedildi"
            : "Instagram-Bereich gespeichert",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          language === "tr"
            ? "Kaydedilirken hata oluştu"
            : "Fehler beim Speichern",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveCtaSection = async () => {
    setSaving(true);
    try {
      // TODO: API'ye kaydet
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({
        type: "success",
        text:
          language === "tr"
            ? "CTA bölümü kaydedildi"
            : "CTA-Bereich gespeichert",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          language === "tr"
            ? "Kaydedilirken hata oluştu"
            : "Fehler beim Speichern",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {language === "tr" ? "Anasayfa Yönetimi" : "Homepage-Verwaltung"}
        </h1>
        <p className="text-slate-600">
          {language === "tr"
            ? "Anasayfa içeriğini düzenle ve güncelle"
            : "Bearbeite und aktualisiere die Homepage"}
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Eye size={24} className="text-blue-600" />
          {language === "tr" ? "Hero Bölümü" : "Hero-Bereich"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (TR)" : "Titel (TR)"}
            </label>
            <input
              type="text"
              value={heroContent.title_tr}
              onChange={(e) =>
                setHeroContent({ ...heroContent, title_tr: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (DE)" : "Titel (DE)"}
            </label>
            <input
              type="text"
              value={heroContent.title_de}
              onChange={(e) =>
                setHeroContent({ ...heroContent, title_de: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Alt Başlık (TR)" : "Untertitel (TR)"}
            </label>
            <textarea
              value={heroContent.subtitle_tr}
              onChange={(e) =>
                setHeroContent({ ...heroContent, subtitle_tr: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Alt Başlık (DE)" : "Untertitel (DE)"}
            </label>
            <textarea
              value={heroContent.subtitle_de}
              onChange={(e) =>
                setHeroContent({ ...heroContent, subtitle_de: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr"
                ? "Ana Buton Metni (TR)"
                : "Primär-Schaltflächentext (TR)"}
            </label>
            <input
              type="text"
              value={heroContent.ctaPrimaryText_tr}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  ctaPrimaryText_tr: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr"
                ? "Ana Buton Metni (DE)"
                : "Primär-Schaltflächentext (DE)"}
            </label>
            <input
              type="text"
              value={heroContent.ctaPrimaryText_de}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  ctaPrimaryText_de: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>
        </div>

        <button
          onClick={saveHeroContent}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {language === "tr" ? "Kaydet" : "Speichern"}
        </button>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={24} className="text-green-600" />
            {language === "tr"
              ? "Özellikler (3 Pillar)"
              : "Features (3 Säulen)"}
          </h2>
          <button
            onClick={addFeature}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> {language === "tr" ? "Ekle" : "Hinzufügen"}
          </button>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="font-bold text-slate-800">
                  {feature.title_tr} / {feature.title_de}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {feature.description_tr}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingFeature(feature)}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title={language === "tr" ? "Düzenle" : "Bearbeiten"}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteFeature(feature.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title={language === "tr" ? "Sil" : "Löschen"}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit/Add Feature Modal */}
        {editingFeature && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  {language === "tr"
                    ? "Özelliği Düzenle"
                    : "Feature bearbeiten"}
                </h3>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {language === "tr" ? "İkon Türü" : "Icon-Typ"}
                  </label>
                  <select
                    value={editingFeature.icon}
                    onChange={(e) =>
                      setEditingFeature({
                        ...editingFeature,
                        icon: e.target.value as
                          | "users"
                          | "sparkles"
                          | "calendar",
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
                  >
                    <option value="users">
                      {language === "tr" ? "Kişiler" : "Personen"}
                    </option>
                    <option value="sparkles">
                      {language === "tr" ? "Parlak" : "Glitzernd"}
                    </option>
                    <option value="calendar">
                      {language === "tr" ? "Takvim" : "Kalender"}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "tr" ? "Başlık (TR)" : "Titel (TR)"}
                    </label>
                    <input
                      type="text"
                      value={editingFeature.title_tr}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          title_tr: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "tr" ? "Başlık (DE)" : "Titel (DE)"}
                    </label>
                    <input
                      type="text"
                      value={editingFeature.title_de}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          title_de: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "tr"
                        ? "Açıklama (TR)"
                        : "Beschreibung (TR)"}
                    </label>
                    <textarea
                      value={editingFeature.description_tr}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_tr: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "tr"
                        ? "Açıklama (DE)"
                        : "Beschreibung (DE)"}
                    </label>
                    <textarea
                      value={editingFeature.description_de}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_de: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveFeature}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {language === "tr" ? "Kaydet" : "Speichern"}
                </button>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="flex-1 bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-400 transition-colors"
                >
                  {language === "tr" ? "İptal" : "Abbrechen"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instagram Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Eye size={24} className="text-pink-600" />
          Instagram {language === "tr" ? "Bölümü" : "Bereich"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (TR)" : "Titel (TR)"}
            </label>
            <input
              type="text"
              value={instagramSection.title_tr}
              onChange={(e) =>
                setInstagramSection({
                  ...instagramSection,
                  title_tr: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (DE)" : "Titel (DE)"}
            </label>
            <input
              type="text"
              value={instagramSection.title_de}
              onChange={(e) =>
                setInstagramSection({
                  ...instagramSection,
                  title_de: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (TR)" : "Beschreibung (TR)"}
            </label>
            <textarea
              value={instagramSection.description_tr}
              onChange={(e) =>
                setInstagramSection({
                  ...instagramSection,
                  description_tr: e.target.value,
                })
              }
              rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (DE)" : "Beschreibung (DE)"}
            </label>
            <textarea
              value={instagramSection.description_de}
              onChange={(e) =>
                setInstagramSection({
                  ...instagramSection,
                  description_de: e.target.value,
                })
              }
              rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Instagram Hesabı" : "Instagram-Konto"}
            </label>
            <input
              type="text"
              value={instagramSection.instagramHandle}
              onChange={(e) =>
                setInstagramSection({
                  ...instagramSection,
                  instagramHandle: e.target.value,
                })
              }
              placeholder="@kulturplattformfreiburg"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>
        </div>

        <button
          onClick={saveInstagramSection}
          disabled={saving}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {language === "tr" ? "Kaydet" : "Speichern"}
        </button>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Heart size={24} className="text-red-600" />
          {language === "tr" ? "Çağrı Bölümü (CTA)" : "Call-to-Action-Bereich"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (TR)" : "Titel (TR)"}
            </label>
            <input
              type="text"
              value={ctaSection.title_tr}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, title_tr: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Başlık (DE)" : "Titel (DE)"}
            </label>
            <input
              type="text"
              value={ctaSection.title_de}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, title_de: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (TR)" : "Beschreibung (TR)"}
            </label>
            <textarea
              value={ctaSection.description_tr}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, description_tr: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (DE)" : "Beschreibung (DE)"}
            </label>
            <textarea
              value={ctaSection.description_de}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, description_de: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>
        </div>

        <button
          onClick={saveCtaSection}
          disabled={saving}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {language === "tr" ? "Kaydet" : "Speichern"}
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
