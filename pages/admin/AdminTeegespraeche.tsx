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
  Type,
  Layout,
  Globe,
  Info,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

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
  imageUrl: string;
  contactEmail: string;
  isActive: boolean;
}

const AdminTeegespraeche: React.FC = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<TeaEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TeaEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

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
    imageUrl: "",
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
      const response = await fetch("https://localhost:7189/api/TeaEvent", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const isUpdate = !!editingEvent.id;
      const url = isUpdate
        ? `https://localhost:7189/api/TeaEvent/${editingEvent.id}`
        : "https://localhost:7189/api/TeaEvent";

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editingEvent),
      });

      if (!response.ok) throw new Error("İşlem başarısız!");

      alert(isUpdate ? "Başarıyla güncellendi!" : "Başarıyla eklendi!");
      fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      alert("Hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu Tee-Gespräch'i silmek istediğinize emin misiniz?")) return;
    try {
      const response = await fetch(
        `https://localhost:7189/api/TeaEvent/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      alert("Silme işlemi başarısız!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-20">
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 gap-4 sticky top-4 z-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-kpf-red/10 rounded-2xl">
            <Layout className="text-kpf-red" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Tee-Gespräche Yönetimi
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} className="text-green-500" />
              Çay Sohbetleri etkinlik içeriklerini buradan güncelleyebilirsiniz
            </p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingEvent(emptyEvent);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-kpf-red text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-xl shadow-kpf-red/20"
          >
            <Plus size={24} /> Yeni Etkinlik Ekle
          </button>
        )}
      </div>

      {showForm && editingEvent && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
            <span className="bg-white px-4 py-1.5 rounded-full text-xs font-black text-slate-500 border shadow-sm">
              {editingEvent.id ? "DÜZENLEME MODU" : "YENİ KAYIT MODU"}
            </span>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Başlıklar */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Başlık (Türkçe)
                </label>
                <input
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
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Titel (Deutsch)
                </label>
                <input
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
                <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                  <Calendar size={16} /> Tarih
                </label>
                <input
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
                <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                  <Clock size={16} /> Saat
                </label>
                <input
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
                <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                  <MapPin size={16} /> Lokasyon
                </label>
                <input
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
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Görsel URL
                </label>
                <div className="relative">
                  <ImageIcon
                    className="absolute left-4 top-4 text-slate-400"
                    size={20}
                  />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={editingEvent.imageUrl}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        imageUrl: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  İletişim E-posta
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-slate-400"
                    size={20}
                  />
                  <input
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
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 border-l-4 border-kpf-teal pl-3">
                    Açıklama (Türkçe)
                  </label>
                  <QuillEditor
                    value={editingEvent.introTr}
                    onChange={(val) =>
                      setEditingEvent({ ...editingEvent, introTr: val })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 border-l-4 border-slate-400 pl-3">
                    Beschreibung (Deutsch)
                  </label>
                  <QuillEditor
                    value={editingEvent.introDe}
                    onChange={(val) =>
                      setEditingEvent({ ...editingEvent, introDe: val })
                    }
                  />
                </div>
              </div>
            </section>

            {/* Kültürel Miras Metinleri (Kendi Kodundaki Eksik Kısımlar) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  Kültürel Miras (TR)
                </label>
                <QuillEditor
                  value={editingEvent.heritageTextTr}
                  onChange={(val) =>
                    setEditingEvent({
                      ...editingEvent,
                      heritageTextTr: val,
                    })
                  }
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  Kulturerbe (DE)
                </label>
                <QuillEditor
                  value={editingEvent.heritageTextDe}
                  onChange={(val) =>
                    setEditingEvent({
                      ...editingEvent,
                      heritageTextDe: val,
                    })
                  }
                />
              </div>
            </section>

            {/* Katılım Metinleri (Kendi Kodundaki Eksik Kısımlar) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">
                  Katılım Bilgisi (TR)
                </label>
                <input
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
                <label className="text-sm font-bold text-slate-700">
                  Teilnahme Info (DE)
                </label>
                <input
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
                type="submit"
                disabled={loading}
                className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                <Save size={24} />{" "}
                {loading ? "KAYDEDİLİYOR..." : "TÜMÜNÜ KAYDET"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
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
                    {event.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 line-clamp-2 mb-4 group-hover:text-kpf-red transition-colors">
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
                    <Edit2 size={16} /> Düzenle
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
            Henüz etkinlik eklenmemiş.
          </h2>
          <button
            onClick={() => {
              setEditingEvent(emptyEvent);
              setShowForm(true);
            }}
            className="mt-4 text-kpf-red font-black hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <Plus size={20} /> İLK ETKİNLİĞİ OLUŞTURUN
          </button>
        </div>
      )}

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

export default AdminTeegespraeche;
