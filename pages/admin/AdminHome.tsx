import React, { useEffect, useState, useRef } from "react";
import {
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
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
        placeholder: placeholder,
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
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  subtitleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  backgroundImageUrl: string;
  backgroundImageBase64?: string;
  backgroundImageFileName?: string;
  primaryButtonTextTr: string;
  primaryButtonTextDe: string;
  secondaryButtonTextTr: string;
  secondaryButtonTextDe: string;
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
    titleTr: "",
    titleDe: "",
    subtitleTr: "",
    subtitleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    backgroundImageUrl: "",
    backgroundImageBase64: "",
    backgroundImageFileName: "",
    primaryButtonTextTr: "",
    primaryButtonTextDe: "",
    secondaryButtonTextTr: "",
    secondaryButtonTextDe: "",
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
        titleTr: heroSource?.titleTr || "",
        titleDe: heroSource?.titleDe || "",
        subtitleTr: heroSource?.subtitleTr || "",
        subtitleDe: heroSource?.subtitleDe || "",
        descriptionTr: heroSource?.descriptionTr || "",
        descriptionDe: heroSource?.descriptionDe || "",
        backgroundImageUrl: heroSource?.backgroundImageUrl || "",
        backgroundImageBase64: "", // Backend'den gelen veri yüklenince base64'ü temizle (url-based görseller için)
        backgroundImageFileName: "", // Dosya adını da temizle
        primaryButtonTextTr: heroSource?.primaryButtonTextTr || "",
        primaryButtonTextDe: heroSource?.primaryButtonTextDe || "",
        secondaryButtonTextTr: heroSource?.secondaryButtonTextTr || "",
        secondaryButtonTextDe: heroSource?.secondaryButtonTextDe || "",
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
        })),
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
          titleTr: heroContent.titleTr,
          titleDe: heroContent.titleDe,
          subtitleTr: heroContent.subtitleTr,
          subtitleDe: heroContent.subtitleDe,
          descriptionTr: heroContent.descriptionTr,
          descriptionDe: heroContent.descriptionDe,
          // Hem URL hem Base64 göndermeyin - sadece birini gönder
          backgroundImageUrl: heroContent.backgroundImageBase64
            ? null
            : heroContent.backgroundImageUrl,
          backgroundImageBase64: heroContent.backgroundImageBase64 || null,
          backgroundImageFileName: heroContent.backgroundImageFileName || null,
          primaryButtonTextTr: heroContent.primaryButtonTextTr,
          primaryButtonTextDe: heroContent.primaryButtonTextDe,
          secondaryButtonTextTr: heroContent.secondaryButtonTextTr,
          secondaryButtonTextDe: heroContent.secondaryButtonTextDe,
        }),
      });
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("Save failed");

      // Response'tan güncellenmiş verileri al
      if (heroContent.id) {
        // PUT işlemi - backend yeni URL'yi döndürüyor
        const updatedHero = await response.json();
        setHeroContent({
          id: updatedHero.id,
          titleTr: updatedHero.titleTr,
          titleDe: updatedHero.titleDe,
          subtitleTr: updatedHero.subtitleTr,
          subtitleDe: updatedHero.subtitleDe,
          descriptionTr: updatedHero.descriptionTr,
          descriptionDe: updatedHero.descriptionDe,
          backgroundImageUrl: updatedHero.backgroundImageUrl || "",
          backgroundImageBase64: "", // Kaydedildikten sonra base64'ü temizle
          backgroundImageFileName: "",
          primaryButtonTextTr: updatedHero.primaryButtonTextTr,
          primaryButtonTextDe: updatedHero.primaryButtonTextDe,
          secondaryButtonTextTr: updatedHero.secondaryButtonTextTr,
          secondaryButtonTextDe: updatedHero.secondaryButtonTextDe,
        });
        console.log("✅ Hero updated:", updatedHero);
      } else {
        // POST işlemi - verileri yeniden yükle
        await loadHomeContent();
      }

      setMessage({
        type: "success",
        text: t("admin_home_hero_saved"),
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Hero kaydetme hatası:", error);
      setMessage({
        type: "error",
        text: t("admin_save_failed"),
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
      const isNew = !features.some((f) => f.id === editingFeature.id);

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
          })),
        );
      }

      setEditingFeature(null);
      setMessage({
        type: "success",
        text: t("admin_feature_saved"),
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Feature kaydetme hatası:", error);
      setMessage({
        type: "error",
        text: t("admin_save_failed"),
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
        },
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
        text: t("admin_feature_deleted"),
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Feature silme hatası:", error);
      setMessage({
        type: "error",
        text: t("admin_delete_failed"),
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
        },
      );
      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        globalThis.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("Save failed");
      setMessage({
        type: "success",
        text: t("admin_home_instagram_saved"),
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Instagram kaydetme hatası:", error);
      setMessage({
        type: "error",
        text: t("admin_save_failed"),
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
        text: t("admin_home_cta_saved"),
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("CTA kaydetme hatası:", error);
      setMessage({
        type: "error",
        text: t("admin_save_failed"),
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
          <div className="p-3 bg-kpf-teal/10 rounded-2xl">
            <Sparkles className="text-kpf-teal" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              {t("admin_home_title")}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} className="text-green-500" />
              {t("admin_home_subtitle")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveHeroContent}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Save size={18} />
            {saving ? t("admin_saving") : t("admin_publish")}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Eye size={24} className="text-blue-600" />
          {t("admin_section_hero")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_tr")}
            </label>
            <input
              type="text"
              value={heroContent.titleTr}
              onChange={(e) =>
                setHeroContent({ ...heroContent, titleTr: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_de")}
            </label>
            <input
              type="text"
              value={heroContent.titleDe}
              onChange={(e) =>
                setHeroContent({ ...heroContent, titleDe: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_subtitle_tr")}
            </label>
            <QuillEditor
              value={heroContent.subtitleTr}
              onChange={(val) =>
                setHeroContent({ ...heroContent, subtitleTr: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_subtitle_de")}
            </label>
            <QuillEditor
              value={heroContent.subtitleDe}
              onChange={(val) =>
                setHeroContent({ ...heroContent, subtitleDe: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_tr")}
            </label>
            <QuillEditor
              value={heroContent.descriptionTr}
              onChange={(val) =>
                setHeroContent({ ...heroContent, descriptionTr: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_de")}
            </label>
            <QuillEditor
              value={heroContent.descriptionDe}
              onChange={(val) =>
                setHeroContent({ ...heroContent, descriptionDe: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_background_image_url")}
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
              placeholder={t("admin_url_placeholder")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_background_image_file")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    setHeroContent({
                      ...heroContent,
                      backgroundImageBase64: base64,
                      backgroundImageFileName: file.name,
                      backgroundImageUrl: "", // Yeni dosya yüklendiyse URL'yi temizle
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
            {heroContent.backgroundImageFileName && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {heroContent.backgroundImageFileName}
              </p>
            )}
            {heroContent.backgroundImageBase64 && (
              <div className="mt-4 rounded-lg overflow-hidden border-2 border-green-200">
                <img
                  src={heroContent.backgroundImageBase64}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            {!heroContent.backgroundImageBase64 &&
              heroContent.backgroundImageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border-2 border-slate-200">
                  <img
                    src={heroContent.backgroundImageUrl}
                    alt="Current"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_primary_button_text_tr")}
            </label>
            <input
              type="text"
              value={heroContent.primaryButtonTextTr}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  primaryButtonTextTr: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_primary_button_text_de")}
            </label>
            <input
              type="text"
              value={heroContent.primaryButtonTextDe}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  primaryButtonTextDe: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_secondary_button_text_tr")}
            </label>
            <input
              type="text"
              value={heroContent.secondaryButtonTextTr}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  secondaryButtonTextTr: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_secondary_button_text_de")}
            </label>
            <input
              type="text"
              value={heroContent.secondaryButtonTextDe}
              onChange={(e) =>
                setHeroContent({
                  ...heroContent,
                  secondaryButtonTextDe: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>
        </div>

        <button
          onClick={saveHeroContent}
          disabled={saving}
          className="bg-kpf-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-kpf-teal/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {t("admin_save")}
        </button>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={24} className="text-green-600" />
            {t("admin_home_features_title")}
          </h2>
          <button
            onClick={addFeature}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> {t("admin_add")}
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
                  title={t("admin_edit")}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteFeature(feature.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title={t("admin_delete")}
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
                  {t("admin_home_edit_feature")}
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
                    {t("admin_field_icon_type")}
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
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  >
                    <option value="users">{t("admin_icon_users")}</option>
                    <option value="sparkles">{t("admin_icon_sparkles")}</option>
                    <option value="calendar">{t("admin_icon_calendar")}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t("admin_field_title_tr")}
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t("admin_field_title_de")}
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t("admin_field_description_tr")}
                    </label>
                    <QuillEditor
                      value={editingFeature.description_tr}
                      onChange={(val) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_tr: val,
                        })
                      }
                      placeholder={t("admin_editor_placeholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t("admin_field_description_de")}
                    </label>
                    <QuillEditor
                      value={editingFeature.description_de}
                      onChange={(val) =>
                        setEditingFeature({
                          ...editingFeature,
                          description_de: val,
                        })
                      }
                      placeholder={t("admin_editor_placeholder")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveFeature}
                  className="flex-1 bg-kpf-teal text-white px-4 py-2 rounded-lg font-bold hover:bg-kpf-teal/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {t("admin_save")}
                </button>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="flex-1 bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-400 transition-colors"
                >
                  {t("admin_cancel")}
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
          {t("admin_section_instagram")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_tr")}
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_de")}
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_tr")}
            </label>
            <QuillEditor
              value={instagramSection.description_tr}
              onChange={(val) =>
                setInstagramSection({
                  ...instagramSection,
                  description_tr: val,
                })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_de")}
            </label>
            <QuillEditor
              value={instagramSection.description_de}
              onChange={(val) =>
                setInstagramSection({
                  ...instagramSection,
                  description_de: val,
                })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_instagram_handle")}
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>
        </div>

        <button
          onClick={saveInstagramSection}
          disabled={saving}
          className="bg-kpf-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-kpf-teal/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {t("admin_save")}
        </button>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Heart size={24} className="text-kpf-teal" />
          {t("admin_section_cta")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_tr")}
            </label>
            <input
              type="text"
              value={ctaSection.title_tr}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, title_tr: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_title_de")}
            </label>
            <input
              type="text"
              value={ctaSection.title_de}
              onChange={(e) =>
                setCtaSection({ ...ctaSection, title_de: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_tr")}
            </label>
            <QuillEditor
              value={ctaSection.description_tr}
              onChange={(val) =>
                setCtaSection({ ...ctaSection, description_tr: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin_field_description_de")}
            </label>
            <QuillEditor
              value={ctaSection.description_de}
              onChange={(val) =>
                setCtaSection({ ...ctaSection, description_de: val })
              }
              placeholder={t("admin_editor_placeholder")}
            />
          </div>
        </div>

        <button
          onClick={saveCtaSection}
          disabled={saving}
          className="bg-kpf-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-kpf-teal/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {t("admin_save")}
        </button>
      </div>

      {/* Editor Özelleştirme CSS */}
      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: var(--color-primary-teal); }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
    </div>
  );
};

export default AdminHome;
