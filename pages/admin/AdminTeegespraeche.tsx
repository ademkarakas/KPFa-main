import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Clock,
  X,
  Image as ImageIcon,
  Mail,
  Layout,
  Globe,
  Info,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import { API_BASE_URL } from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog";

// --- 1. React 19 Uyumlu Modern Editör Bileşeni ---
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

// --- 2. Ana Admin Paneli Bileşeni ---
interface TeaEvent {
  id: string;
  titleTr: string;
  titleDe: string;
  introTr: string;
  introDe: string;
  heritageTextTr: string;
  heritageTextDe: string;
  participationTextTr: string;
  participationTextDe: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string; // Backend uses 'imageUrl' not 'imageUrl'
  contactEmail: string;
  isActive: boolean;
}

const AdminTeegespraeche: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [events, setEvents] = useState<TeaEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TeaEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const emptyEvent: TeaEvent = {
    id: "",
    titleTr: "",
    titleDe: "",
    introTr: "",
    introDe: "",
    heritageTextTr: "",
    heritageTextDe: "",
    participationTextTr: "",
    participationTextDe: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "", // Backend uses 'imageUrl' not 'imageUrl'
    contactEmail: "",
    isActive: true,
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/TeaEvent`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error("Veriler yüklenemedi");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // @ts-expect-error -- React 19 FormEvent type deprecation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const isUpdate = !!editingEvent.id;
      const url = isUpdate
        ? `${API_BASE_URL}/TeaEvent/${editingEvent.id}`
        : `${API_BASE_URL}/TeaEvent`;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editingEvent),
      });

      if (!response.ok) throw new Error("İşlem başarısız!");

      setMessage({
        type: "success",
        text: isUpdate
          ? t("admin_updated_success")
          : t("admin_created_success"),
      });
      setTimeout(() => setMessage(null), 3000);
      fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("TeaEvent kaydetme hatası:", error);
      setMessage({ type: "error", text: t("admin_try_again") });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("admin_teegespraeche_delete_title"),
      message: t("admin_teegespraeche_confirm_delete"),
      onConfirm: () => {
        void (async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/TeaEvent/${id}`, {
              method: "DELETE",
            });
            if (response.ok) {
              setEvents(events.filter((e) => e.id !== id));
              setMessage({ type: "success", text: t("admin_updated_success") });
              setTimeout(() => setMessage(null), 3000);
            }
          } catch (error) {
            console.error("TeaEvent silme hatası:", error);
            setMessage({ type: "error", text: t("admin_delete_failed") });
            setTimeout(() => setMessage(null), 3000);
          }
        })();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-10 mx-6 mt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-kpf-teal/10 rounded-2xl">
            <Layout className="text-kpf-teal" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {t("admin_teegespraeche_admin_title")}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} className="text-green-500" />
              {t("admin_teegespraeche_admin_subtitle")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {showForm && (
            <button
              type="submit"
              form="teaEventForm"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all font-bold shadow-xl shadow-kpf-teal/20 disabled:opacity-50"
            >
              <Save size={24} />
              {loading ? t("admin_saving") : t("admin_publish")}
            </button>
          )}
          {!showForm && (
            <button
              onClick={() => {
                setEditingEvent(emptyEvent);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-8 py-4 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all font-bold shadow-xl shadow-kpf-teal/20"
            >
              <Plus size={24} /> {t("admin_teegespraeche_add_new")}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 p-6 pb-20 mt-6">
        {showForm && editingEvent && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
              <span className="bg-white px-4 py-1.5 rounded-full text-xs font-black text-slate-500 border shadow-sm">
                {editingEvent.id ? t("admin_mode_edit") : t("admin_mode_new")}
              </span>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-kpf-teal/10 text-slate-400 hover:text-kpf-teal rounded-full transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <form
              id="teaEventForm"
              onSubmit={handleSubmit}
              className="p-8 space-y-10"
            >
              {/* Başlıklar */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="tea-title-tr"
                    className="text-sm font-bold text-slate-700 ml-1"
                  >
                    Başlık (Türkçe)
                  </label>
                  <input
                    id="tea-title-tr"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-kpf-teal/5 focus:border-kpf-teal outline-none transition-all font-medium"
                    value={editingEvent.titleTr}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        titleTr: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tea-title-de"
                    className="text-sm font-bold text-slate-700 ml-1"
                  >
                    Titel (Deutsch)
                  </label>
                  <input
                    id="tea-title-de"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-kpf-teal/5 focus:border-kpf-teal outline-none transition-all font-medium"
                    value={editingEvent.titleDe}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        titleDe: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </section>

              {/* Lojistik Bilgiler */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-2">
                  <label
                    htmlFor="tea-date"
                    className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"
                  >
                    <Calendar size={16} /> Tarih
                  </label>
                  <input
                    id="tea-date"
                    type="date"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                    value={editingEvent.date}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tea-time"
                    className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"
                  >
                    <Clock size={16} /> Saat
                  </label>
                  <input
                    id="tea-time"
                    type="time"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tea-location"
                    className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"
                  >
                    <MapPin size={16} /> Lokasyon
                  </label>
                  <input
                    id="tea-location"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
                    value={editingEvent.location}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </section>

              {/* Görsel ve E-posta */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label
                    htmlFor="imageUpload"
                    className="text-sm font-bold text-slate-700 ml-1 block"
                  >
                    Görsel Dosyası
                  </label>
                  <div className="relative">
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer hover:border-kpf-teal transition-colors file:mr-4 file:py-3 file:px-5 md:file:py-2 md:file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-kpf-teal/10 file:text-kpf-teal hover:file:bg-kpf-teal/20"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = event.target?.result as string;
                            setEditingEvent({
                              ...editingEvent,
                              imageBase64: base64,
                              imageFileName: file.name,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {editingEvent.imageFileName && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-bold text-blue-600">
                        ✓ Dosya:{" "}
                        <span className="font-normal">
                          {editingEvent.imageFileName}
                        </span>
                      </p>
                    </div>
                  )}
                  {editingEvent.imageBase64 && (
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        Yeni Resim Önizlemesi
                      </p>
                      <div className="relative rounded-2xl overflow-hidden border-2 border-green-300 shadow-lg">
                        <img
                          src={editingEvent.imageBase64}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  )}
                  {!editingEvent.imageBase64 && editingEvent.imageUrl && (
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        Mevcut Resim
                      </p>
                      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-lg">
                        <img
                          src={editingEvent.imageUrl}
                          alt="Current"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contactEmail"
                    className="text-sm font-bold text-slate-700 ml-1"
                  >
                    İletişim E-posta
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-4 text-slate-400"
                      size={20}
                    />
                    <input
                      id="contactEmail"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                      value={editingEvent.contactEmail}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="info@..."
                    />
                  </div>
                </div>
              </section>

              {/* Rich Text Editörler (Giriş Metinleri) */}
              <section className="space-y-8">
                <div className="flex items-center gap-2 text-slate-800 font-black border-b pb-4 uppercase tracking-widest text-xs">
                  <Globe size={18} className="text-kpf-teal" />{" "}
                  <span>Detaylı Açıklamalar</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2 border-l-4 border-kpf-teal pl-3">
                      Açıklama (Türkçe)
                    </div>
                    <QuillEditor
                      value={editingEvent.introTr}
                      onChange={(val) =>
                        setEditingEvent({ ...editingEvent, introTr: val })
                      }
                      placeholder={t("admin_editor_placeholder")}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2 border-l-4 border-slate-400 pl-3">
                      Beschreibung (Deutsch)
                    </div>
                    <QuillEditor
                      value={editingEvent.introDe}
                      onChange={(val) =>
                        setEditingEvent({ ...editingEvent, introDe: val })
                      }
                      placeholder={t("admin_editor_placeholder")}
                    />
                  </div>
                </div>
              </section>

              {/* Kültürel Miras Metinleri (Kendi Kodundaki Eksik Kısımlar) */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    Kültürel Miras (TR)
                  </div>
                  <QuillEditor
                    value={editingEvent.heritageTextTr}
                    onChange={(val) =>
                      setEditingEvent({
                        ...editingEvent,
                        heritageTextTr: val,
                      })
                    }
                    placeholder={t("admin_editor_placeholder")}
                  />
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    Kulturerbe (DE)
                  </div>
                  <QuillEditor
                    value={editingEvent.heritageTextDe}
                    onChange={(val) =>
                      setEditingEvent({
                        ...editingEvent,
                        heritageTextDe: val,
                      })
                    }
                    placeholder={t("admin_editor_placeholder")}
                  />
                </div>
              </section>

              {/* Katılım Metinleri (Kendi Kodundaki Eksik Kısımlar) */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label
                    htmlFor="tea-participation-tr"
                    className="text-sm font-bold text-slate-700"
                  >
                    Katılım Bilgisi (TR)
                  </label>
                  <input
                    id="tea-participation-tr"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={editingEvent.participationTextTr}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        participationTextTr: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="tea-participation-de"
                    className="text-sm font-bold text-slate-700"
                  >
                    Teilnahme Info (DE)
                  </label>
                  <input
                    id="tea-participation-de"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={editingEvent.participationTextDe}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        participationTextDe: e.target.value,
                      })
                    }
                  />
                </div>
              </section>

              {/* Butonlar */}
              <div className="flex gap-4 pt-10 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  İPTAL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste Bölümü */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        event.isActive
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {event.isActive ? t("admin_active") : t("admin_inactive")}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-slate-800 line-clamp-2 mb-4 group-hover:text-kpf-teal transition-colors">
                    {language === "tr" ? event.titleTr : event.titleDe}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                      <Calendar size={18} className="text-kpf-teal" />{" "}
                      {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                      <MapPin size={18} className="text-kpf-teal" />{" "}
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-auto flex gap-3 pt-6 border-t border-slate-50">
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setShowForm(true);
                      }}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Edit2 size={16} /> {t("admin_edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm && events.length === 0 && !loading && (
          <div className="bg-white rounded-[40px] border-4 border-dashed border-slate-100 p-20 text-center">
            <Info size={64} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-bold text-slate-400">
              {t("admin_no_content")}
            </h2>
            <button
              onClick={() => {
                setEditingEvent(emptyEvent);
                setShowForm(true);
              }}
              className="mt-4 text-kpf-teal font-black hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Plus size={20} /> {t("admin_teegespraeche_add_new")}
            </button>
          </div>
        )}

        {/* Editor Özelleştirme CSS */}
        <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: var(--color-primary-teal); }
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

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={language === "tr" ? "Sil" : "Löschen"}
          cancelText={language === "tr" ? "İptal" : "Abbrechen"}
          type="danger"
        />
      </div>
    </div>
  );
};

export default AdminTeegespraeche;
