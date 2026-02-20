import React, { useEffect, useState, useRef } from "react";
import { Heart, Save, Languages, CheckCircle, List } from "lucide-react";
import { useTranslation } from "react-i18next";
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

  // onChange'i ref'te sakla
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder: placeholder || "",
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
          onChangeRef.current(html === "<p><br></p>" ? "" : html);
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
interface VolunteerSectionItem {
  titleTr: string;
  titleDe: string;
  icon: string;
}
interface VolunteerSection {
  headingTr: string;
  headingDe: string;
  bodyTr: string;
  bodyDe: string;
  items: VolunteerSectionItem[];
}
interface VolunteerData {
  id: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  subtitleDe: string;
  introTr: string;
  introDe: string;
  nameAndPurpose: VolunteerSection;
  why: VolunteerSection;
  who: VolunteerSection;
  how: VolunteerSection;
  ctaButtonTr: string;
  ctaButtonDe: string;
}

const AdminVolunteerPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Backend Veri Çekme Mantığı (Eski Kod Korundu) ---
  useEffect(() => {
    const fetchVolunteer = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://localhost:7189/api/ValueItems/8eeb81f3-3fde-44bc-9b38-7058cf240b4d",
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json: any = await res.json();

        const emptySection = {
          headingTr: "",
          headingDe: "",
          bodyTr: "",
          bodyDe: "",
          items: [],
        };

        // Eğer sections dizisi varsa, sırayla map'le
        let nameAndPurpose = emptySection,
          why = emptySection,
          who = emptySection,
          how = emptySection;

        if (Array.isArray(json.sections)) {
          nameAndPurpose = json.sections[0] ?? emptySection;
          why = json.sections[1] ?? emptySection;
          who = json.sections[2] ?? emptySection;
          how = json.sections[3] ?? emptySection;
        }

        setData({
          ...json,
          nameAndPurpose:
            json.nameAndPurpose && typeof json.nameAndPurpose === "object"
              ? json.nameAndPurpose
              : nameAndPurpose,
          why: json.why && typeof json.why === "object" ? json.why : why,
          who: json.who && typeof json.who === "object" ? json.who : who,
          how: json.how && typeof json.how === "object" ? json.how : how,
        });
      } catch (err) {
        console.error("Fetch hatası:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, []);

  // --- Değişiklik Yönetimi ---
  const handleChange = (field: keyof VolunteerData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSectionChange = (
    sectionKey: keyof Pick<
      VolunteerData,
      "nameAndPurpose" | "why" | "who" | "how"
    >,
    field: keyof VolunteerSection,
    value: any,
  ) => {
    if (!data) return;
    setData({ ...data, [sectionKey]: { ...data[sectionKey], [field]: value } });
  };

  const handleItemChange = (
    sectionKey: keyof Pick<
      VolunteerData,
      "nameAndPurpose" | "why" | "who" | "how"
    >,
    iidx: number,
    field: keyof VolunteerSectionItem,
    value: any,
  ) => {
    if (!data) return;
    const updatedItems = [...data[sectionKey].items];
    updatedItems[iidx] = { ...updatedItems[iidx], [field]: value };
    setData({
      ...data,
      [sectionKey]: { ...data[sectionKey], items: updatedItems },
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }
      const res = await fetch(
        `https://localhost:7189/api/ValueItems/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) throw new Error("Kaydetme başarısız");
      alert("Gönüllü Ol sayfası başarıyla güncellendi!");
    } catch (err) {
      alert(
        "Kaydetme başarısız: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata"),
      );
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
        {t("admin.errors.loadFailed")}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSave} className="space-y-10">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Heart className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("volunteer.pageTitle")}
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
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Save size={18} />
            {saving ? t("common.saving") : t("common.publish")}
          </button>
        </div>

        {/* Ana Başlık ve Giriş Bölümü */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                <Languages size={20} />
                <span className="font-bold text-xs uppercase tracking-widest">
                  {t("volunteer.admin.trContent")}
                </span>
              </div>
              <input
                type="text"
                value={data.titleTr}
                onChange={(e) => handleChange("titleTr", e.target.value)}
                placeholder={t("volunteer.admin.placeholders.titleTr")}
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <input
                type="text"
                value={data.subtitleTr}
                onChange={(e) => handleChange("subtitleTr", e.target.value)}
                placeholder={t("volunteer.admin.placeholders.subtitleTr")}
                className="w-full text-lg text-slate-500 font-medium border-none focus:ring-0 p-0"
              />
              <div className="pt-4 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  {t("volunteer.admin.labels.introTr")}
                </label>
                <QuillEditor
                  value={data.introTr}
                  onChange={(val) => handleChange("introTr", val)}
                  placeholder={t("volunteer.admin.placeholders.editor")}
                />
              </div>
            </div>

            <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-16">
              <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                <Languages size={20} />
                <span className="font-bold text-xs uppercase tracking-widest">
                  {t("volunteer.admin.deContent")}
                </span>
              </div>
              <input
                type="text"
                value={data.titleDe}
                onChange={(e) => handleChange("titleDe", e.target.value)}
                placeholder={t("volunteer.admin.placeholders.titleDe")}
                className="w-full text-4xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200"
              />
              <input
                type="text"
                value={data.subtitleDe}
                onChange={(e) => handleChange("subtitleDe", e.target.value)}
                placeholder={t("volunteer.admin.placeholders.subtitleDe")}
                className="w-full text-lg text-slate-500 font-medium border-none focus:ring-0 p-0"
              />
              <div className="pt-4 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                  {t("volunteer.admin.labels.introDe")}
                </label>
                <QuillEditor
                  value={data.introDe}
                  onChange={(val) => handleChange("introDe", val)}
                  placeholder={t("volunteer.admin.placeholders.editor")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dinamik Alt Bölümler */}
        <div className="space-y-12">
          {(
            [
              { key: "nameAndPurpose", label: "İsim ve Amaç / Name & Zweck" },
              { key: "why", label: "Neden Katılmalısın? / Warum?" },
              { key: "who", label: "Kimler Gelebilir? / Wer?" },
              { key: "how", label: "Nasıl Çalışırız? / Wie?" },
            ] as const
          ).map(({ key, label }) => {
            const section = data[key];
            return (
              <div key={key} className="group">
                <div className="flex items-center gap-4 mb-6 ml-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-2xl transition-transform group-hover:scale-110">
                    <List size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">
                    {label}
                  </h2>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <input
                      type="text"
                      value={section.headingTr}
                      onChange={(e) =>
                        handleSectionChange(key, "headingTr", e.target.value)
                      }
                      placeholder={t(
                        "volunteer.admin.placeholders.sectionHeadingTr",
                      )}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.bodyTr}
                      onChange={(val) =>
                        handleSectionChange(key, "bodyTr", val)
                      }
                      placeholder={t("volunteer.admin.placeholders.editor")}
                    />
                  </div>

                  <div className="space-y-5">
                    <input
                      type="text"
                      value={section.headingDe}
                      onChange={(e) =>
                        handleSectionChange(key, "headingDe", e.target.value)
                      }
                      placeholder={t(
                        "volunteer.admin.placeholders.sectionHeadingDe",
                      )}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-50 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                    <QuillEditor
                      value={section.bodyDe}
                      onChange={(val) =>
                        handleSectionChange(key, "bodyDe", val)
                      }
                      placeholder={t("volunteer.admin.placeholders.editor")}
                    />
                  </div>

                  {/* Maddeler */}
                  {Array.isArray(section.items) && section.items.length > 0 && (
                    <div className="lg:col-span-2 mt-4 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.items.map((item, iidx) => (
                        <div
                          key={`${key}-${item.icon}-${item.titleTr}-${item.titleDe}`}
                          className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-center"
                        >
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) =>
                              handleItemChange(
                                key,
                                iidx,
                                "icon",
                                e.target.value,
                              )
                            }
                            className="w-12 h-12 text-center rounded-xl bg-white border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-kpf-teal"
                            placeholder={t("volunteer.admin.placeholders.icon")}
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={item.titleTr}
                              onChange={(e) =>
                                handleItemChange(
                                  key,
                                  iidx,
                                  "titleTr",
                                  e.target.value,
                                )
                              }
                              className="w-full px-2 py-1 bg-white rounded-lg text-sm border-none shadow-sm"
                              placeholder={t(
                                "volunteer.admin.placeholders.itemTr",
                              )}
                            />
                            <input
                              type="text"
                              value={item.titleDe}
                              onChange={(e) =>
                                handleItemChange(
                                  key,
                                  iidx,
                                  "titleDe",
                                  e.target.value,
                                )
                              }
                              className="w-full px-2 py-1 bg-white rounded-lg text-sm border-none shadow-sm"
                              placeholder={t(
                                "volunteer.admin.placeholders.itemDe",
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </form>

      {/* Editor Özelleştirme CSS */}
      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #006778; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
    </div>
  );
};

export default AdminVolunteerPage;
