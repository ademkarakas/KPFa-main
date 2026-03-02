import React, { useState, useEffect, useRef } from "react";
import { Save, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// --- React 19 Uyumlu Modern Editör Bileşeni ---
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
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder: placeholder ?? "",
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
          let html = quill.root.innerHTML;
          // Boş paragraflı durumda temizle
          html = html === "<p><br></p>" ? "" : html;
          onChangeRef.current(html);
        }
      });

      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }
    }
  }, [placeholder, value]);

  useEffect(() => {
    if (quillRef.current && !isUpdating.current) {
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

// --- Tip Tanımlamaları ---
interface GuelenSection {
  titleTr: string;
  titleDe: string;
  contentTr: string;
  contentDe: string;
}

type GuelenSectionKey =
  | "philosophy"
  | "dialog"
  | "network"
  | "spiritual"
  | "vision";

interface GuelenContent {
  id: string;
  titleTr: string;
  titleDe: string;
  introductionTr: string;
  introductionDe: string;
  imageUrl: string;
  philosophy: GuelenSection;
  dialog: GuelenSection;
  network: GuelenSection;
  spiritual: GuelenSection;
  vision: GuelenSection;
}

const AdminGuelen: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<GuelenContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- Backend Veri Çekme ---
  useEffect(() => {
    const fetchGuelen = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/GuelenMovement`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json: any = await res.json();

        setData({
          id: json[0]?.id || "",
          titleTr: json[0]?.titleTr || "",
          titleDe: json[0]?.titleDe || "",
          introductionTr: json[0]?.introductionTr || "",
          introductionDe: json[0]?.introductionDe || "",
          imageUrl: json[0]?.imageUrl || "",
          philosophy: {
            titleTr: json[0]?.philosophyTitleTr || "",
            titleDe: json[0]?.philosophyTitleDe || "",
            contentTr: json[0]?.philosophyContentTr || "",
            contentDe: json[0]?.philosophyContentDe || "",
          },
          dialog: {
            titleTr: json[0]?.dialogTitleTr || "",
            titleDe: json[0]?.dialogTitleDe || "",
            contentTr: json[0]?.dialogContentTr || "",
            contentDe: json[0]?.dialogContentDe || "",
          },
          network: {
            titleTr: json[0]?.networkTitleTr || "",
            titleDe: json[0]?.networkTitleDe || "",
            contentTr: json[0]?.networkContentTr || "",
            contentDe: json[0]?.networkContentDe || "",
          },
          spiritual: {
            titleTr: json[0]?.spiritualTitleTr || "",
            titleDe: json[0]?.spiritualTitleDe || "",
            contentTr: json[0]?.spiritualContentTr || "",
            contentDe: json[0]?.spiritualContentDe || "",
          },
          vision: {
            titleTr: json[0]?.visionTitleTr || "",
            titleDe: json[0]?.visionTitleDe || "",
            contentTr: json[0]?.visionContentTr || "",
            contentDe: json[0]?.visionContentDe || "",
          },
        });
      } catch (err) {
        console.error("Fetch hatası:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGuelen();
  }, []);

  // --- Değişiklik Yönetimi ---
  const handleChange = (
    field: keyof Omit<
      GuelenContent,
      "philosophy" | "dialog" | "network" | "spiritual" | "vision"
    >,
    value: any,
  ) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSectionChange = (
    sectionKey: GuelenSectionKey,
    field: keyof GuelenSection,
    value: any,
  ) => {
    if (!data) return;
    setData({
      ...data,
      [sectionKey]: { ...data[sectionKey], [field]: value },
    });
  };

  // HTML içeriği düzenle - paragrafları düzgün formatla
  const normalizeContent = (html: string): string => {
    if (!html) return "";

    // Boşluk satırlarını temizle
    let normalized = html.trim();

    // Eğer HTML etiketleri yoksa (düz metin), satırlara böl
    if (!normalized.includes("<")) {
      const paragraphs = normalized
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map((p) => `<p>${p}</p>`);
      return paragraphs.join("");
    }

    // Quill HTML'ini temizle
    // Boş <p><br></p> satırlarını kaldır
    normalized = normalized.replaceAll("<p><br></p>", "");

    // Ardışık <p> etiketlerini ayır
    normalized = normalized.replaceAll("><p>", ">\n<p>");

    return normalized;
  };

  // @ts-expect-error -- React 19 FormEvent type deprecation
  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage({
          type: "error",
          text: t("adminGuelen.alerts.sessionExpired"),
        });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Backend veri formatına dönüştür
      const payload = {
        id: data.id,
        titleTr: data.titleTr,
        titleDe: data.titleDe,
        introductionTr: normalizeContent(data.introductionTr),
        introductionDe: normalizeContent(data.introductionDe),
        imageUrl: data.imageUrl,
        philosophyTitleTr: data.philosophy.titleTr,
        philosophyTitleDe: data.philosophy.titleDe,
        philosophyContentTr: normalizeContent(data.philosophy.contentTr),
        philosophyContentDe: normalizeContent(data.philosophy.contentDe),
        dialogTitleTr: data.dialog.titleTr,
        dialogTitleDe: data.dialog.titleDe,
        dialogContentTr: normalizeContent(data.dialog.contentTr),
        dialogContentDe: normalizeContent(data.dialog.contentDe),
        networkTitleTr: data.network.titleTr,
        networkTitleDe: data.network.titleDe,
        networkContentTr: normalizeContent(data.network.contentTr),
        networkContentDe: normalizeContent(data.network.contentDe),
        spiritualTitleTr: data.spiritual.titleTr,
        spiritualTitleDe: data.spiritual.titleDe,
        spiritualContentTr: normalizeContent(data.spiritual.contentTr),
        spiritualContentDe: normalizeContent(data.spiritual.contentDe),
        visionTitleTr: data.vision.titleTr,
        visionTitleDe: data.vision.titleDe,
        visionContentTr: normalizeContent(data.vision.contentTr),
        visionContentDe: normalizeContent(data.vision.contentDe),
      };

      const res = await fetch(`${API_BASE_URL}/GuelenMovement/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Kaydetme başarısız");
      setMessage({ type: "success", text: t("adminGuelen.alerts.updated") });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("common.unknownError");
      setMessage({
        type: "error",
        text: `${t("adminGuelen.alerts.saveFailed")}: ${message}`,
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-teal"></div>
        <p className="mt-4 text-slate-500 font-medium">{t("common.loading")}</p>
      </div>
    );

  if (!data)
    return (
      <div className="text-center p-10 text-red-500 font-bold">
        {t("adminGuelen.noData")}
      </div>
    );

  const sectionMeta: Array<{
    key: GuelenSectionKey;
    label: string;
  }> = [
    { key: "philosophy", label: t("adminGuelen.sections.philosophy") },
    { key: "dialog", label: t("adminGuelen.sections.dialog") },
    { key: "network", label: t("adminGuelen.sections.network") },
    { key: "spiritual", label: t("adminGuelen.sections.spiritual") },
    { key: "vision", label: t("adminGuelen.sections.vision") },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSave} className="space-y-10">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <FileText className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("adminGuelen.pageTitle")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" /> React 19
                {t("adminGuelen.editorMode")}
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

        {/* Ana Başlık ve Giriş Bölümü */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Türkçe İçerik */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                <span className="font-bold text-xs uppercase tracking-widest">
                  {t("adminGuelen.labels.contentTr")}
                </span>
              </div>
              <input
                type="text"
                value={data.titleTr}
                onChange={(e) => handleChange("titleTr", e.target.value)}
                placeholder={t("adminGuelen.placeholders.titleTr")}
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  {t("adminGuelen.labels.introductionTr")}
                </p>
                <QuillEditor
                  value={data.introductionTr}
                  onChange={(val) => handleChange("introductionTr", val)}
                  placeholder={t("adminGuelen.placeholders.introductionTr")}
                />
              </div>
            </div>

            {/* Almanca İçerik */}
            <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-16">
              <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                <span className="font-bold text-xs uppercase tracking-widest">
                  {t("adminGuelen.labels.contentDe")}
                </span>
              </div>
              <input
                type="text"
                value={data.titleDe}
                onChange={(e) => handleChange("titleDe", e.target.value)}
                placeholder={t("adminGuelen.placeholders.titleDe")}
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  {t("adminGuelen.labels.introductionDe")}
                </p>
                <QuillEditor
                  value={data.introductionDe}
                  onChange={(val) => handleChange("introductionDe", val)}
                  placeholder={t("adminGuelen.placeholders.introductionDe")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Görsel URL */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="text-kpf-teal" size={24} />
            <h3 className="text-lg font-bold text-slate-800">
              {t("adminGuelen.labels.headerImage")}
            </h3>
          </div>
          <input
            type="url"
            value={data.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder={t("adminGuelen.placeholders.imageUrl")}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
          />
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt={t("adminGuelen.labels.imagePreviewAlt")}
              className="mt-4 w-full max-w-2xl rounded-xl shadow-md object-cover h-64"
            />
          )}
        </div>

        {/* Dinamik Bölümler */}
        <div className="space-y-12">
          {sectionMeta.map(({ key, label }) => {
            const section = data[key];
            return (
              <div key={key} className="group">
                <div className="flex items-center gap-4 mb-6 ml-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-2xl transition-transform group-hover:scale-110">
                    ℹ
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">
                    {label}
                  </h2>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Türkçe */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-blue-600 pb-2 border-b border-blue-50 italic">
                      <span className="text-xs font-bold uppercase">
                        {t("adminGuelen.labels.trAbbr")}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={section.titleTr}
                      onChange={(e) =>
                        handleSectionChange(key, "titleTr", e.target.value)
                      }
                      placeholder={t("adminGuelen.placeholders.sectionTitleTr")}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.contentTr}
                      onChange={(val) =>
                        handleSectionChange(key, "contentTr", val)
                      }
                      placeholder={t(
                        "adminGuelen.placeholders.sectionContentTr",
                      )}
                    />
                  </div>

                  {/* Almanca */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-amber-600 pb-2 border-b border-amber-50 italic">
                      <span className="text-xs font-bold uppercase">
                        {t("adminGuelen.labels.deAbbr")}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={section.titleDe}
                      onChange={(e) =>
                        handleSectionChange(key, "titleDe", e.target.value)
                      }
                      placeholder={t("adminGuelen.placeholders.sectionTitleDe")}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.contentDe}
                      onChange={(val) =>
                        handleSectionChange(key, "contentDe", val)
                      }
                      placeholder={t(
                        "adminGuelen.placeholders.sectionContentDe",
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </form>

      {/* Editor Özelleştirme CSS */}
      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>

      {/* Notification */}
      {message && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl font-bold z-50 animate-slide-in ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AdminGuelen;
