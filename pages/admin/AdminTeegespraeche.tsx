import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

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
  const t = (key: string) => TEXTS[key]?.[language] || key;

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

  // 🔹 Backend’den veri çek
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("https://localhost:7189/api/TeaEvent", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(
            `API isteği başarısız! Status: ${response.status} - ${errText}`
          );
        }
        const data: TeaEvent[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
        alert(
          "Etkinlikler yüklenemedi! " +
            (error instanceof Error ? error.message : "")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (editingEvent.id) {
        // 🔹 Update
        const response = await fetch(
          `https://localhost:7189/api/TeaEvent/${editingEvent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(editingEvent),
          }
        );
        if (!response.ok) throw new Error("Güncelleme başarısız!");
        setEvents(
          events.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev))
        );
        alert("Tee-Gespräch başarıyla güncellendi!");
      } else {
        // 🔹 Create
        const response = await fetch("https://localhost:7189/api/TeaEvent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(editingEvent),
        });
        if (!response.ok) throw new Error("Ekleme başarısız!");
        const createdEvent: TeaEvent = await response.json();
        setEvents([...events, createdEvent]);
        alert("Tee-Gespräch başarıyla eklendi!");
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error(error);
      alert("İşlem başarısız!");
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
      if (!response.ok) throw new Error("Silme işlemi başarısız!");
      setEvents(events.filter((ev) => ev.id !== id));
    } catch (error) {
      console.error(error);
      alert("Silme işlemi başarısız!");
    }
  };

  const handleEdit = (event: TeaEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingEvent(emptyEvent);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Tee-Gespräche / Çay Sohbetleri
          </h1>
          <p className="text-slate-600">Çay sohbeti etkinliklerini yönetin</p>
        </div>
        {!showForm && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            Yeni Ekle
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && editingEvent && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Başlık (Türkçe)
                </label>
                <input
                  type="text"
                  value={editingEvent.titleTr}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      titleTr: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Çay Sohbeti"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Titel (Deutsch)
                </label>
                <input
                  type="text"
                  value={editingEvent.titleDe}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      titleDe: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Tee-Gespräch"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} /> Tarih / Datum
                  </div>
                </label>
                <input
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={18} /> Saat / Uhrzeit
                  </div>
                </label>
                <input
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, time: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} /> Yer / Ort
                  </div>
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  placeholder="Frankfurt"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Görsel URL
              </label>
              <input
                type="url"
                value={editingEvent.imageUrl}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, imageUrl: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Turkish Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Açıklama (Türkçe)
              </label>
              <textarea
                value={editingEvent.introTr}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, introTr: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* German Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Beschreibung (Deutsch)
              </label>
              <textarea
                value={editingEvent.introDe}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, introDe: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* Heritage Text TR */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kültürel Miras Açıklaması (Türkçe)
              </label>
              <textarea
                value={editingEvent.heritageTextTr}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    heritageTextTr: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* Heritage Text DE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kulturerbe Beschreibung (Deutsch)
              </label>
              <textarea
                value={editingEvent.heritageTextDe}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    heritageTextDe: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* Participation Text TR */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Katılım Açıklaması (Türkçe)
              </label>
              <textarea
                value={editingEvent.participationTextTr}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    participationTextTr: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* Participation Text DE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Teilnahme Beschreibung (Deutsch)
              </label>
              <textarea
                value={editingEvent.participationTextDe}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    participationTextDe: e.target.value,
                  })
                }
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                İletişim E-posta
              </label>
              <input
                type="email"
                value={editingEvent.contactEmail}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    contactEmail: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                placeholder="info@kulturplattformfreiburg.org"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg"
              >
                <Save size={20} /> {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.titleTr}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {language === "tr" ? event.titleTr : event.titleDe}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {language === "tr" ? event.introTr : event.introDe}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Calendar size={16} /> {event.date} - {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <MapPin size={16} /> {event.location}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <Edit2 size={16} /> Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm && events.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-slate-500 text-lg">
            Henüz Tee-Gespräch eklenmedi. Yeni eklemek için yukarıdaki butonu
            kullanın.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminTeegespraeche;
