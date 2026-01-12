import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { activitiesApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface ActivityFormData {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailedContentTr: string;
  detailedContentDe: string;
  dateTr: string;
  dateDe: string;
  dateISO: string;
  location: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  galleryImages: string[];
  isActive: boolean;
}

const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [formData, setFormData] = useState<ActivityFormData>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    detailedContentTr: "",
    detailedContentDe: "",
    dateTr: "",
    dateDe: "",
    dateISO: "",
    location: "",
    category: "music",
    imageUrl: "",
    videoUrl: "",
    galleryImages: [],
    isActive: true,
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesApi.getAll(true);
      setActivities(data);
    } catch (error) {
      console.error("Etkinlikler yüklenirken hata:", error);
      alert("Etkinlikler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadApi.uploadFile(file);
      setFormData({ ...formData, imageUrl });
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      alert("Resim yüklenemedi!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const uploadPromises = Array.from(files).map((file: File) =>
        uploadApi.uploadFile(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        galleryImages: [...formData.galleryImages, ...uploadedUrls],
      });
    } catch (error) {
      console.error("Galeri resimleri yüklenirken hata:", error);
      alert("Galeri resimleri yüklenemedi!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dto = {
        titleTr: formData.titleTr,
        titleDe: formData.titleDe,
        descriptionTr: formData.descriptionTr,
        descriptionDe: formData.descriptionDe,
        detailedContentTr: formData.detailedContentTr,
        detailedContentDe: formData.detailedContentDe,
        dateTr: formData.dateTr,
        dateDe: formData.dateDe,
        dateISO: formData.dateISO,
        location: formData.location,
        category: formData.category,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl || null,
        galleryImages: formData.galleryImages,
        isActive: formData.isActive,
      };

      if (editingId) {
        await activitiesApi.update(editingId, dto);
      } else {
        await activitiesApi.create(dto);
      }

      await loadActivities();
      resetForm();
      alert(editingId ? "Etkinlik güncellendi!" : "Etkinlik oluşturuldu!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("İşlem başarısız!");
    }
  };

  const handleEdit = (activity: any) => {
    setFormData({
      titleTr: activity.titleTr,
      titleDe: activity.titleDe,
      descriptionTr: activity.descriptionTr,
      descriptionDe: activity.descriptionDe,
      detailedContentTr: activity.detailedContentTr || "",
      detailedContentDe: activity.detailedContentDe || "",
      dateTr: activity.dateTr,
      dateDe: activity.dateDe,
      dateISO: activity.dateISO,
      location: activity.location,
      category: activity.category,
      imageUrl: activity.imageUrl,
      videoUrl: activity.videoUrl || "",
      galleryImages: activity.galleryImages || [],
      isActive: activity.isActive,
    });
    setEditingId(activity.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) return;

    try {
      await activitiesApi.delete(id);
      await loadActivities();
      alert("Etkinlik silindi!");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi başarısız!");
    }
  };

  const resetForm = () => {
    setFormData({
      titleTr: "",
      titleDe: "",
      descriptionTr: "",
      descriptionDe: "",
      detailedContentTr: "",
      detailedContentDe: "",
      dateTr: "",
      dateDe: "",
      dateISO: "",
      location: "",
      category: "music",
      imageUrl: "",
      videoUrl: "",
      galleryImages: [],
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredActivities = activities.filter(
    (a) =>
      a.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.titleDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t("admin_activities_title")}
          </h1>
          <p className="text-slate-600">Toplam {activities.length} etkinlik</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span className="font-semibold">{t("admin_activities_new")}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder={t("admin_search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Activities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={activity.imageUrl}
                alt={activity.titleTr}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {activity.isActive ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Eye size={14} />
                    {t("admin_active")}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <EyeOff size={14} />
                    {t("admin_inactive")}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-kpf-teal text-white text-xs font-bold rounded-full">
                  {activity.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {activity.titleTr}
              </h3>
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{activity.dateTr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{activity.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit size={16} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Etkinlik Düzenle" : "Yeni Etkinlik"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Başlık - Türkçe/Almanca */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Başlık (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleTr}
                    onChange={(e) =>
                      setFormData({ ...formData, titleTr: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Titel (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleDe}
                    onChange={(e) =>
                      setFormData({ ...formData, titleDe: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* Kısa Açıklama */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Kısa Açıklama (Türkçe) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.descriptionTr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionTr: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Kurzbeschreibung (Deutsch) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.descriptionDe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionDe: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                  />
                </div>
              </div>

              {/* Detaylı İçerik */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detaylı İçerik (Türkçe)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.detailedContentTr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        detailedContentTr: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Detay sayfasında gösterilecek içerik..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detaillierter Inhalt (Deutsch)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.detailedContentDe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        detailedContentDe: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                    placeholder="Inhalt für Detailseite..."
                  />
                </div>
              </div>

              {/* Tarih ve Lokasyon */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tarih (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dateTr}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTr: e.target.value })
                    }
                    placeholder="örn: 15 Aralık 2024"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Datum (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dateDe}
                    onChange={(e) =>
                      setFormData({ ...formData, dateDe: e.target.value })
                    }
                    placeholder="z.B: 15. Dezember 2024"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ISO Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateISO}
                    onChange={(e) =>
                      setFormData({ ...formData, dateISO: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lokasyon *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  >
                    <option value="music">Müzik / Musik</option>
                    <option value="art">Sanat / Kunst</option>
                    <option value="education">Eğitim / Bildung</option>
                  </select>
                </div>
              </div>

              {/* Ana Resim */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ana Resim *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="mt-3 h-32 w-auto rounded-lg"
                  />
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Video URL (YouTube, Vimeo)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
              </div>

              {/* Galeri */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Galeri Resimleri (Çoklu seçim)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
                {formData.galleryImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {formData.galleryImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              galleryImages: formData.galleryImages.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aktif/Pasif */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-kpf-teal focus:ring-kpf-teal border-slate-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-slate-700"
                >
                  Etkinlik Aktif
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 font-semibold"
                >
                  <Save size={20} />
                  {editingId ? "Güncelle" : "Oluştur"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivities;
