import React, { useEffect, useState, useRef } from "react";
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
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder: placeholder || "İçerik yazın...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
      });

      quill.on("text-change", () => {
        if (!isUpdating.current) {
          const html = quill.root.innerHTML;
          onChange(html === "<p><br></p>" ? "" : html);
        }
      });

      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      const normalizedValue = value || "";
      const normalizedCurrent =
        currentContent === "<p><br></p>" ? "" : currentContent;

      if (normalizedValue !== normalizedCurrent) {
        isUpdating.current = true;
        quillRef.current.root.innerHTML = normalizedValue;
        setTimeout(() => {
          isUpdating.current = false;
        }, 100);
      }
    }
  }, [value]);

  return (
    <div className="quill-modern-container">
      <div ref={containerRef} />
    </div>
  );
};

interface HeroContent {
  id: string;
  title_tr: string;
  title_de: string;
  subtitle_tr: string;
  subtitle_de: string;
  description_tr: string;
  description_de: string;
  backgroundImageUrl: string;
  primaryButtonText_tr: string;
  primaryButtonText_de: string;
  secondaryButtonText_tr: string;
  secondaryButtonText_de: string;
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
    id: "",
    title_tr: "",
    title_de: "",
    subtitle_tr: "",
    subtitle_de: "",
    description_tr: "",
    description_de: "",
    backgroundImageUrl: "",
    primaryButtonText_tr: "",
    primaryButtonText_de: "",
    secondaryButtonText_tr: "",
    secondaryButtonText_de: "",
  });

  const [features, setFeatures] = useState<Feature[]>([]);

  const [instagramSection, setInstagramSection] = useState<InstagramSection>({
    title_tr: "",
    title_de: "",
    description_tr: "",
    description_de: "",
    instagramHandle: "",
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title_tr: "",
    title_de: "",
    description_tr: "",
    description_de: "",
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
    loadHomeContent();
  }, []);

  const loadHomeContent = async () => {
    try {
      // Ana Home verilerini ve Hero verisini paralel olarak çek
      const [homeResponse, heroResponse] = await Promise.all([
        fetch("https://localhost:7189/api/Home"),
        fetch("https://localhost:7189/api/Home/hero"),
      ]);

      const data = homeResponse.ok ? await homeResponse.json() : {};
      const heroApiData = heroResponse.ok ? await heroResponse.json() : null;

      // Hero - önce /api/Home/hero endpoint'inden gelen veriyi kullan
      const heroSource = heroApiData || data.hero;
      setHeroContent({
        id: heroSource?.id || "",
        title_tr: heroSource?.titleTr || "",
        title_de: heroSource?.titleDe || "",
        subtitle_tr: heroSource?.subtitleTr || "",
        subtitle_de: heroSource?.subtitleDe || "",
        description_tr: heroSource?.descriptionTr || "",
        description_de: heroSource?.descriptionDe || "",
        backgroundImageUrl: heroSource?.backgroundImageUrl || "",
        primaryButtonText_tr: heroSource?.primaryButtonTextTr || "",
        primaryButtonText_de: heroSource?.primaryButtonTextDe || "",
        secondaryButtonText_tr: heroSource?.secondaryButtonTextTr || "",
        secondaryButtonText_de: heroSource?.secondaryButtonTextDe || "",
      });

      // Features
      setFeatures(
        (data.features || []).map((f: any, idx: number) => ({
          id: f.id || String(idx + 1),
          title_tr: f.titleTr || "",
          title_de: f.titleDe || "",
          description_tr: f.descriptionTr || "",
          description_de: f.descriptionDe || "",
          icon: f.icon || "users",
        }))
      );

      // Instagram
      setInstagramSection({
        title_tr: data.instagram?.titleTr || "",
        title_de: data.instagram?.titleDe || "",
        description_tr: data.instagram?.descriptionTr || "",
        description_de: data.instagram?.descriptionDe || "",
        instagramHandle: data.instagram?.instagramHandle || "",
      });

      // CTA
      setCtaSection({
        title_tr: data.cta?.titleTr || "",
        title_de: data.cta?.titleDe || "",
        description_tr: data.cta?.descriptionTr || "",
        description_de: data.cta?.descriptionDe || "",
      });
    } catch (error) {
      console.error("Error loading home content:", error);
    }
  };

  const saveHeroContent = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      // Hero ID varsa PUT ile güncelle, yoksa POST ile oluştur
      const url = heroContent.id
        ? `https://localhost:7189/api/Home/hero/${heroContent.id}`
        : "https://localhost:7189/api/Home/hero";
      const method = heroContent.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: heroContent.id || undefined,
          titleTr: heroContent.title_tr,
          titleDe: heroContent.title_de,
          subtitleTr: heroContent.subtitle_tr,
          subtitleDe: heroContent.subtitle_de,
          descriptionTr: heroContent.description_tr,
          descriptionDe: heroContent.description_de,
          backgroundImageUrl: heroContent.backgroundImageUrl,
          primaryButtonTextTr: heroContent.primaryButtonText_tr,
          primaryButtonTextDe: heroContent.primaryButtonText_de,
          secondaryButtonTextTr: heroContent.secondaryButtonText_tr,
          secondaryButtonTextDe: heroContent.secondaryButtonText_de,
        }),
      });
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("Save failed");

      // Kayıt başarılı ise verileri yeniden yükle
      await loadHomeContent();

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

  const saveFeature = async () => {
    if (!editingFeature) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const isNew = !features.find((f) => f.id === editingFeature.id);

      // Mevcut feature'dan color'ı al veya varsayılan kullan
      const existingFeature = features.find((f) => f.id === editingFeature.id);

      // Backend'e gönderilecek veri formatı
      const featureData = {
        id: editingFeature.id,
        titleTr: editingFeature.title_tr,
        titleDe: editingFeature.title_de,
        descriptionTr: editingFeature.description_tr,
        descriptionDe: editingFeature.description_de,
        color:
          (editingFeature as any).color || existingFeature?.color || "#FF6B35",
      };

      const response = await fetch("https://localhost:7189/api/Home/features", {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(featureData),
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Save failed");
      }

      // Verileri backend'den yeniden yükle
      const reloadResponse = await fetch("https://localhost:7189/api/Home", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reloadResponse.ok) {
        const data = await reloadResponse.json();
        setFeatures(
          (data.features || []).map((f: any, idx: number) => ({
            id: f.id,
            title_tr: f.titleTr || f.TitleTr || f.title_tr || "",
            title_de: f.titleDe || f.TitleDe || f.title_de || "",
            description_tr:
              f.descriptionTr || f.DescriptionTr || f.description_tr || "",
            description_de:
              f.descriptionDe || f.DescriptionDe || f.description_de || "",
            icon: (["users", "sparkles", "calendar"] as const)[idx % 3],
            color: f.color || f.Color || "#FF6B35",
          }))
        );
      }

      setEditingFeature(null);
      setMessage({
        type: "success",
        text: language === "tr" ? "Özellik kaydedildi" : "Funktion gespeichert",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Feature kaydetme hatası:", error);
      setMessage({
        type: "error",
        text:
          language === "tr"
            ? "Kaydedilirken hata oluştu"
            : "Fehler beim Speichern",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const deleteFeature = async (id: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://localhost:7189/api/Home/features/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setFeatures(features.filter((f) => f.id !== id));
      setMessage({
        type: "success",
        text: language === "tr" ? "Özellik silindi" : "Funktion gelöscht",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Feature silme hatası:", error);
      setMessage({
        type: "error",
        text:
          language === "tr" ? "Silinirken hata oluştu" : "Fehler beim Löschen",
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const saveInstagramSection = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://localhost:7189/api/Home/instagram",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titleTr: instagramSection.title_tr,
            titleDe: instagramSection.title_de,
            descriptionTr: instagramSection.description_tr,
            descriptionDe: instagramSection.description_de,
            instagramHandle: instagramSection.instagramHandle,
          }),
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("Save failed");
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
      const token = localStorage.getItem("adminToken");
      const response = await fetch("https://localhost:7189/api/Home/cta", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titleTr: ctaSection.title_tr,
          titleDe: ctaSection.title_de,
          descriptionTr: ctaSection.description_tr,
          descriptionDe: ctaSection.description_de,
        }),
      });
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("Save failed");
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
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 mb-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-kpf-red/10 rounded-2xl">
            <Sparkles className="text-kpf-red" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              {language === "tr" ? "Anasayfa Yönetimi" : "Homepage-Verwaltung"}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} className="text-green-500" />
              {language === "tr"
                ? "Anasayfa içeriğini düzenle"
                : "Homepage bearbeiten"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveHeroContent}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-red/20 font-bold"
          >
            <Save size={18} />
            {saving
              ? language === "tr"
                ? "Kaydediliyor..."
                : "Wird gespeichert..."
              : language === "tr"
              ? "Sitede Yayınla"
              : "Veröffentlichen"}
          </button>
        </div>
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
            <QuillEditor
              value={heroContent.subtitle_tr}
              onChange={(val) =>
                setHeroContent({ ...heroContent, subtitle_tr: val })
              }
              placeholder="Alt başlık (Türkçe)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Alt Başlık (DE)" : "Untertitel (DE)"}
            </label>
            <QuillEditor
              value={heroContent.subtitle_de}
              onChange={(val) =>
                setHeroContent({ ...heroContent, subtitle_de: val })
              }
              placeholder="Untertitel (Deutsch)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (TR)" : "Beschreibung (TR)"}
            </label>
            <QuillEditor
              value={heroContent.description_tr}
              onChange={(val) =>
                setHeroContent({ ...heroContent, description_tr: val })
              }
              placeholder="Açıklama (Türkçe)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (DE)" : "Beschreibung (DE)"}
            </label>
            <QuillEditor
              value={heroContent.description_de}
              onChange={(val) =>
                setHeroContent({ ...heroContent, description_de: val })
              }
              placeholder="Beschreibung (Deutsch)..."
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr"
                ? "Arka Plan Görsel URL"
                : "Hintergrundbild URL"}
            </label>
            <input
              type="text"
              value={heroContent.backgroundImageUrl}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  backgroundImageUrl: e.target.value,
                })
              }
              placeholder="https://..."
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
              value={heroContent.primaryButtonText_tr}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  primaryButtonText_tr: e.target.value,
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
              value={heroContent.primaryButtonText_de}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  primaryButtonText_de: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr"
                ? "İkincil Buton Metni (TR)"
                : "Sekundär-Schaltflächentext (TR)"}
            </label>
            <input
              type="text"
              value={heroContent.secondaryButtonText_tr}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  secondaryButtonText_tr: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr"
                ? "İkincil Buton Metni (DE)"
                : "Sekundär-Schaltflächentext (DE)"}
            </label>
            <input
              type="text"
              value={heroContent.secondaryButtonText_de}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  secondaryButtonText_de: e.target.value,
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
                    <QuillEditor
                      value={editingFeature.description_tr}
                      onChange={(val) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_tr: val,
                        })
                      }
                      placeholder="Açıklama (Türkçe)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === "tr"
                        ? "Açıklama (DE)"
                        : "Beschreibung (DE)"}
                    </label>
                    <QuillEditor
                      value={editingFeature.description_de}
                      onChange={(val) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_de: val,
                        })
                      }
                      placeholder="Beschreibung (Deutsch)..."
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
            <QuillEditor
              value={instagramSection.description_tr}
              onChange={(val) =>
                setInstagramSection({
                  ...instagramSection,
                  description_tr: val,
                })
              }
              placeholder="Açıklama (Türkçe)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (DE)" : "Beschreibung (DE)"}
            </label>
            <QuillEditor
              value={instagramSection.description_de}
              onChange={(val) =>
                setInstagramSection({
                  ...instagramSection,
                  description_de: val,
                })
              }
              placeholder="Beschreibung (Deutsch)..."
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
            <QuillEditor
              value={ctaSection.description_tr}
              onChange={(val) =>
                setCtaSection({ ...ctaSection, description_tr: val })
              }
              placeholder="Açıklama (Türkçe)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {language === "tr" ? "Açıklama (DE)" : "Beschreibung (DE)"}
            </label>
            <QuillEditor
              value={ctaSection.description_de}
              onChange={(val) =>
                setCtaSection({ ...ctaSection, description_de: val })
              }
              placeholder="Beschreibung (Deutsch)..."
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

      {/* Editor Özelleştirme CSS */}
      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #ef4444; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
    </div>
  );
};

export default AdminHome;
