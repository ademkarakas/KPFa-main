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
  date: string;
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
    date: "",
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
      const formatted = data.map(formatAdminActivity);
      setActivities(formatted);
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
        date: formData.date,
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
      date: activity.date,
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
      date: "",
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

  const formatAdminActivity = (item: any) => {
    const formatAddress = (address: any) => {
      if (!address) return "";
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.houseNo) parts.push(address.houseNo);
      if (address.zipCode) parts.push(address.zipCode);
      if (address.city) parts.push(address.city);
      return parts.join(", ");
    };

    return {
      id: item.id,

      titleTr: item.titleTr || "",
      titleDe: item.titleDe || "",

      descriptionTr: item.descriptionTr || "",
      descriptionDe: item.descriptionDe || "",

      detailedContentTr: item.detailedContentTr || item.descriptionTr || "",
      detailedContentDe: item.detailedContentDe || item.descriptionDe || "",

      // input[type="date"] uyumlu ISO (YYYY-MM-DD)
      date: item.date ? item.date.split("T")[0] : "",

      location: formatAddress(item.address) || item.location || "",

      category: item.category || "music",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      galleryImages: item.galleryImages || [],
      isActive: item.isActive ?? true,
    };
  };

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
          <p className="text-slate-600">
            {language === "tr" ? "Toplam" : "Gesamt"} {activities.length}{" "}
            {language === "tr" ? "etkinlik" : "Aktivitäten"}
          </p>
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
          placeholder={
            language === "tr" ? "Etkinlik ara..." : "Aktivität suchen..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* No Results */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            {language === "tr"
              ? "Arama sonucunda etkinlik bulunamadı."
              : "Keine Aktivitäten gefunden."}
          </p>
        </div>
      )}

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-slate-500 bg-slate-50">
          <div className="col-span-4">
            {language === "tr" ? "Etkinlik" : "Aktivität"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Kategori" : "Kategorie"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Tarih" : "Datum"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Konum" : "Ort"}
          </div>
          <div className="col-span-1 text-center">
            {language === "tr" ? "Durum" : "Status"}
          </div>
          <div className="col-span-1 text-right">
            {language === "tr" ? "İşlemler" : "Aktionen"}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors"
            >
              {/* Title + Image */}
              <div className="col-span-4 flex items-center gap-4">
                <img
                  src={activity.imageUrl}
                  alt={activity.titleTr}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-800 line-clamp-1">
                    {language === "tr" ? activity.titleTr : activity.titleDe}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {language === "tr"
                      ? activity.descriptionTr
                      : activity.descriptionDe}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span className="inline-block px-3 py-1 bg-kpf-teal/10 text-kpf-teal text-xs font-semibold rounded-full">
                  {activity.category}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                <Calendar size={14} className="text-kpf-teal" />
                <span>{activity.date}</span>
              </div>

              {/* Location */}
              <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                <MapPin size={14} className="text-kpf-teal" />
                <span className="line-clamp-1">{activity.location}</span>
              </div>

              {/* Status */}
              <div className="col-span-1 flex justify-center">
                {activity.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Eye size={12} />
                    {language === "tr" ? "Aktif" : "Aktiv"}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-semibold rounded-full flex items-center gap-1">
                    <EyeOff size={12} />
                    {language === "tr" ? "Pasif" : "Inaktiv"}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title={language === "tr" ? "Düzenle" : "Bearbeiten"}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  title={language === "tr" ? "Sil" : "Löschen"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId
                  ? language === "tr"
                    ? "Etkinlik Düzenle"
                    : "Aktivität bearbeiten"
                  : language === "tr"
                  ? "Yeni Etkinlik"
                  : "Neue Aktivität"}
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
                  {language === "tr" ? "Etkinlik Aktif" : "Aktivität aktiv"}
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
                  {editingId
                    ? language === "tr"
                      ? "Güncelle"
                      : "Aktualisieren"
                    : language === "tr"
                    ? "Oluştur"
                    : "Erstellen"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  {language === "tr" ? "İptal" : "Abbrechen"}
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
