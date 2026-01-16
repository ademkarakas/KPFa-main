import React, { useState, useEffect, useRef } from "react";
import { Save, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
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

      // Enter tuşu yeni paragraf oluştur
      quill.on("key-bind", {
        key: "Enter",
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
  useLanguage();
  const [data, setData] = useState<GuelenContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Backend Veri Çekme ---
  useEffect(() => {
    const fetchGuelen = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7189/api/GuelenMovement");
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
    value: any
  ) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSectionChange = (
    sectionKey: "philosophy" | "dialog" | "network" | "spiritual" | "vision",
    field: keyof GuelenSection,
    value: any
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
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

      const res = await fetch(
        `https://localhost:7189/api/GuelenMovement/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Kaydetme başarısız");
      alert("Gülen Hareketi sayfası başarıyla güncellendi!");
    } catch (err) {
      alert(
        "Kaydetme başarısız: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-red"></div>
        <p className="mt-4 text-slate-500 font-medium">Veriler yükleniyor...</p>
      </div>
    );

  if (!data)
    return (
      <div className="text-center p-10 text-red-500 font-bold">
        Veri bulunamadı.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSave} className="space-y-10">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-red/10 rounded-2xl">
              <FileText className="text-kpf-red" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                Gülen Hareketi / Gülen-Bewegung
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" /> React 19
                Editor Mode
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

        {/* Ana Başlık ve Giriş Bölümü */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Türkçe İçerik */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                <span className="font-bold text-xs uppercase tracking-widest">
                  Türkçe (TR) İçerik
                </span>
              </div>
              <input
                type="text"
                value={data.titleTr}
                onChange={(e) => handleChange("titleTr", e.target.value)}
                placeholder="Başlık (TR)"
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  Giriş Metni
                </p>
                <QuillEditor
                  value={data.introductionTr}
                  onChange={(val) => handleChange("introductionTr", val)}
                  placeholder="Giriş metni (TR)"
                />
              </div>
            </div>

            {/* Almanca İçerik */}
            <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-16">
              <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                <span className="font-bold text-xs uppercase tracking-widest">
                  Almanca (DE) İçerik
                </span>
              </div>
              <input
                type="text"
                value={data.titleDe}
                onChange={(e) => handleChange("titleDe", e.target.value)}
                placeholder="Titel (DE)"
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  Einleitungstext
                </p>
                <QuillEditor
                  value={data.introductionDe}
                  onChange={(val) => handleChange("introductionDe", val)}
                  placeholder="Einleitungstext (DE)"
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
              Başlık Görseli / Header-Bild
            </h3>
          </div>
          <input
            type="url"
            value={data.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
          />
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt="Preview"
              className="mt-4 w-full max-w-2xl rounded-xl shadow-md object-cover h-64"
            />
          )}
        </div>

        {/* Dinamik Bölümler */}
        <div className="space-y-12">
          {(
            [
              { key: "philosophy", label: "Temel Felsefe / Grundphilosophie" },
              {
                key: "dialog",
                label:
                  "Diyalog ve Toplumsal Uzlaşı / Dialog und gesellschaftlicher Zusammenhalt",
              },
              { key: "network", label: "Küresel Ağ / Globales Netzwerk" },
              {
                key: "spiritual",
                label: "Manevi Derinlik / Spirituelle Wurzeln",
              },
              {
                key: "vision",
                label: "Gelecek Vizyonu / Vision für die Zukunft",
              },
            ] as const
          ).map(({ key, label }) => {
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
                      <span className="text-xs font-bold uppercase">TR</span>
                    </div>
                    <input
                      type="text"
                      value={section.titleTr}
                      onChange={(e) =>
                        handleSectionChange(key, "titleTr", e.target.value)
                      }
                      placeholder="Başlık (TR)"
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-red outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.contentTr}
                      onChange={(val) =>
                        handleSectionChange(key, "contentTr", val)
                      }
                      placeholder="İçerik yazın..."
                    />
                  </div>

                  {/* Almanca */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-amber-600 pb-2 border-b border-amber-50 italic">
                      <span className="text-xs font-bold uppercase">DE</span>
                    </div>
                    <input
                      type="text"
                      value={section.titleDe}
                      onChange={(e) =>
                        handleSectionChange(key, "titleDe", e.target.value)
                      }
                      placeholder="Titel (DE)"
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.contentDe}
                      onChange={(val) =>
                        handleSectionChange(key, "contentDe", val)
                      }
                      placeholder="Inhalt schreiben..."
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
        .quill-modern-container:focus-within { background: #fff; border-color: #ef4444; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
    </div>
  );
};

export default AdminGuelen;
