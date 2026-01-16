import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  Languages,
} from "lucide-react";
import { activitiesApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
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

interface ActivityFormData {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailedContentTr: string;
  detailedContentDe: string;
  date: string;
  location: string;
  address?: {
    street?: string;
    houseNo?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
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

  // Modern bildirim sistemi
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 3000);
  };

  const [formData, setFormData] = useState<ActivityFormData>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    detailedContentTr: "",
    detailedContentDe: "",
    date: "",
    location: "",
    address: undefined,
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
      showNotification(
        "error",
        language === "tr"
          ? "Etkinlikler yüklenemedi!"
          : "Aktivitäten konnten nicht geladen werden!"
      );
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
      showNotification(
        "success",
        language === "tr"
          ? "Resim başarıyla yüklendi!"
          : "Bild erfolgreich hochgeladen!"
      );
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      showNotification(
        "error",
        language === "tr"
          ? "Resim yüklenemedi!"
          : "Bild konnte nicht hochgeladen werden!"
      );
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
      // Location string'inden address objesi oluştur (yeni etkinlik için)
      let addressObj = formData.address;
      if (!addressObj && formData.location) {
        // Yeni etkinlik - location'dan basit bir address objesi oluştur
        addressObj = {
          street: formData.location,
          houseNo: "",
          zipCode: "",
          city: "",
          state: "",
          country: "Deutschland", // Varsayılan ülke
        };
      }

      // Backend'in beklediği PascalCase formatına dönüştür
      const addressDto = addressObj
        ? {
            Street: addressObj.street || "",
            HouseNo: addressObj.houseNo || "",
            ZipCode: addressObj.zipCode || "",
            City: addressObj.city || "",
            State: addressObj.state || "",
            Country: addressObj.country || "Deutschland",
          }
        : null;

      const dto = {
        ...(editingId && { id: editingId }), // Edit modunda ID ekle
        titleTr: formData.titleTr,
        titleDe: formData.titleDe,
        descriptionTr: formData.descriptionTr,
        descriptionDe: formData.descriptionDe,
        detailedContentTr: formData.detailedContentTr,
        detailedContentDe: formData.detailedContentDe,
        date: formData.date,
        address: addressDto, // Backend'in beklediği PascalCase formatında
        category: formData.category,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl || null,
        galleryImages: formData.galleryImages,
        isActive: formData.isActive,
      };

      if (editingId) {
        await activitiesApi.update(editingId, dto);
        showNotification(
          "success",
          language === "tr"
            ? "✓ Etkinlik başarıyla güncellendi!"
            : "✓ Aktivität erfolgreich aktualisiert!"
        );
      } else {
        await activitiesApi.create(dto);
        showNotification(
          "success",
          language === "tr"
            ? "✓ Yeni etkinlik oluşturuldu!"
            : "✓ Neue Aktivität erstellt!"
        );
      }

      await loadActivities();
      resetForm();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification(
        "error",
        language === "tr" ? "❌ İşlem başarısız!" : "❌ Vorgang fehlgeschlagen!"
      );
    }
  };

  const handleEdit = (activity: any) => {
    // Backend'den gelen tarihi aynen kullan (YYYY-MM-DD formatında)
    setFormData({
      titleTr: activity.titleTr,
      titleDe: activity.titleDe,
      descriptionTr: activity.descriptionTr,
      descriptionDe: activity.descriptionDe,
      detailedContentTr: activity.detailedContentTr || "",
      detailedContentDe: activity.detailedContentDe || "",
      date: activity.date, // Backend'den gelen ISO formatı kullan
      location: activity.location,
      address: activity.address, // Orijinal address objesini sakla
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
    if (
      !confirm(
        language === "tr"
          ? "Bu etkinliği silmek istediğinizden emin misiniz?"
          : "Sind Sie sicher, dass Sie diese Aktivität löschen möchten?"
      )
    )
      return;

    try {
      await activitiesApi.delete(id);
      await loadActivities();
      showNotification(
        "success",
        language === "tr" ? "✓ Etkinlik silindi!" : "✓ Aktivität gelöscht!"
      );
    } catch (error) {
      console.error("Silme hatası:", error);
      showNotification(
        "error",
        language === "tr"
          ? "❌ Silme işlemi başarısız!"
          : "❌ Löschvorgang fehlgeschlagen!"
      );
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      console.log("Toggle Active çağrıldı:", { id, currentStatus });
      const activity = activities.find((a) => a.id === id);
      if (!activity) {
        console.error("Etkinlik bulunamadı:", id);
        showNotification(
          "error",
          language === "tr"
            ? "❌ Etkinlik bulunamadı!"
            : "❌ Aktivität nicht gefunden!"
        );
        return;
      }

      console.log("Bulunan etkinlik:", activity);

      const addressDto = activity.address
        ? {
            Street: activity.address.street || "",
            HouseNo: activity.address.houseNo || "",
            ZipCode: activity.address.zipCode || "",
            City: activity.address.city || "",
            State: activity.address.state || "",
            Country: activity.address.country || "Deutschland",
          }
        : null;

      const dto = {
        id: id,
        titleTr: activity.titleTr,
        titleDe: activity.titleDe,
        descriptionTr: activity.descriptionTr,
        descriptionDe: activity.descriptionDe,
        detailedContentTr: activity.detailedContentTr,
        detailedContentDe: activity.detailedContentDe,
        date: activity.originalDate || activity.date, // Orijinal ISO formatını kullan
        address: addressDto,
        category: activity.category,
        imageUrl: activity.imageUrl,
        videoUrl: activity.videoUrl || null,
        galleryImages: activity.galleryImages,
        isActive: !currentStatus,
      };

      console.log("Backend'e gönderilecek DTO:", dto);

      await activitiesApi.update(id, dto);
      await loadActivities();
      showNotification(
        "success",
        !currentStatus
          ? language === "tr"
            ? "✓ Etkinlik aktif hale getirildi!"
            : "✓ Aktivität aktiviert!"
          : language === "tr"
          ? "✓ Etkinlik pasif hale getirildi!"
          : "✓ Aktivität deaktiviert!"
      );
    } catch (error) {
      console.error("Durum değiştirme hatası detayı:", error);
      showNotification(
        "error",
        language === "tr"
          ? "❌ Durum değişirilemedi!"
          : "❌ Status konnte nicht geändert werden!"
      );
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
      address: undefined,
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
      // Backend PascalCase kullanıyor, camelCase'e çevir
      const street = address.Street || address.street;
      const houseNo = address.HouseNo || address.houseNo;
      const zipCode = address.ZipCode || address.zipCode;
      const city = address.City || address.city;
      const state = address.State || address.state;
      const country = address.Country || address.country;

      if (street) parts.push(street);
      if (houseNo) parts.push(houseNo);
      if (zipCode) parts.push(zipCode);
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (country) parts.push(country);
      return parts.join(", ");
    };

    // Backend'den gelen PascalCase address'i camelCase'e dönüştür
    const convertAddress = (address: any) => {
      if (!address) return undefined;
      return {
        street: address.Street || address.street || "",
        houseNo: address.HouseNo || address.houseNo || "",
        zipCode: address.ZipCode || address.zipCode || "",
        city: address.City || address.city || "",
        state: address.State || address.state || "",
        country: address.Country || address.country || "",
      };
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
      originalDate: item.date, // Backend için orijinal ISO formatı

      location: formatAddress(item.address) || item.location || "",
      address: convertAddress(item.address), // PascalCase -> camelCase

      category: item.category || "music",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      galleryImages: item.galleryImages || [],
      isActive: item.isActive ?? true,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-teal"></div>
        <p className="mt-4 text-slate-500 font-medium">
          {language === "tr"
            ? "Etkinlikler yükleniyor..."
            : "Aktivitäten werden geladen..."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="space-y-6">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Calendar className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("admin_activities_title")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {language === "tr" ? "Toplam" : "Gesamt"} {activities.length}{" "}
                {language === "tr" ? "etkinlik" : "Aktivitäten"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Plus size={18} />
            {t("admin_activities_new")}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-kpf-teal"
            size={22}
          />
          <input
            type="text"
            placeholder={
              language === "tr"
                ? "🔍 Etkinlik ara... (başlık, konum veya kategoriye göre)"
                : "🔍 Aktivität suchen... (nach Titel, Ort oder Kategorie)"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-kpf-teal/30 focus:border-kpf-teal text-base shadow-sm"
          />
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Search size={40} className="text-slate-400" />
              </div>
              <p className="text-slate-600 text-xl font-semibold mb-2">
                {language === "tr"
                  ? "🔍 Arama sonuçunda etkinlik bulunamadı"
                  : "🔍 Keine Aktivitäten gefunden"}
              </p>
              <p className="text-slate-500 text-sm">
                {language === "tr"
                  ? "Farklı anahtar kelimeler deneyin veya yeni bir etkinlik ekleyin"
                  : "Versuchen Sie andere Schlüsselwörter oder fügen Sie eine neue Aktivität hinzu"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/80 transition-all font-semibold"
                >
                  {language === "tr" ? "Aramayı Temizle" : "Suche zurücksetzen"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-white bg-gradient-to-r from-kpf-teal to-kpf-teal uppercase tracking-wide">
            <div className="col-span-4">
              {language === "tr" ? "📋 Etkinlik" : "📋 Aktivität"}
            </div>
            <div className="col-span-2">
              {language === "tr" ? "🏷️ Kategori" : "🏷️ Kategorie"}
            </div>
            <div className="col-span-2">
              {language === "tr" ? "📅 Tarih" : "📅 Datum"}
            </div>
            <div className="col-span-2">
              {language === "tr" ? "📍 Konum" : "📍 Ort"}
            </div>
            <div className="col-span-1 text-center">
              {language === "tr" ? "👁️ Durum" : "👁️ Status"}
            </div>
            <div className="col-span-1 text-right">
              {language === "tr" ? "⚙️ İşlemler" : "⚙️ Aktionen"}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filteredActivities.map((activity) => {
              const categoryIcons: Record<string, string> = {
                music: "🎵",
                art: "🎨",
                education: "📚",
                culture: "🌍",
                sport: "⚽",
                social: "🤝",
              };
              const categoryIcon = categoryIcons[activity.category] || "📌";

              return (
                <div
                  key={activity.id}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gradient-to-r hover:from-kpf-teal/5 hover:to-kpf-red/5 transition-all duration-200 border-l-4 border-transparent hover:border-kpf-teal"
                >
                  {/* Title + Image */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={activity.imageUrl}
                        alt={activity.titleTr}
                        className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-white"
                      />
                      {!activity.isActive && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <EyeOff size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 line-clamp-1 text-base">
                        {language === "tr"
                          ? activity.titleTr
                          : activity.titleDe}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {language === "tr"
                          ? activity.descriptionTr
                          : activity.descriptionDe}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-kpf-teal/10 to-blue-500/10 text-kpf-teal text-xs font-bold rounded-full border border-kpf-teal/20">
                      <span>{categoryIcon}</span>
                      <span className="capitalize">{activity.category}</span>
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                    <Calendar size={16} className="text-kpf-red" />
                    <span>{activity.date}</span>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={16} className="text-kpf-teal flex-shrink-0" />
                    <span className="line-clamp-1" title={activity.location}>
                      {activity.location}
                    </span>
                  </div>

                  {/* Status - Tıklanabilir Toggle */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() =>
                        toggleActive(activity.id, activity.isActive)
                      }
                      className="group relative"
                      title={
                        language === "tr"
                          ? activity.isActive
                            ? "Pasif yap"
                            : "Aktif yap"
                          : activity.isActive
                          ? "Deaktivieren"
                          : "Aktivieren"
                      }
                    >
                      {activity.isActive ? (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-green-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                          <Eye size={14} />
                          {language === "tr" ? "Aktif" : "Aktiv"}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 text-xs font-bold rounded-full flex items-center gap-1.5 border border-slate-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                          <EyeOff size={14} />
                          {language === "tr" ? "Pasif" : "Inaktiv"}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all hover:shadow-md"
                      title={language === "tr" ? "Düzenle" : "Bearbeiten"}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all hover:shadow-md"
                      title={language === "tr" ? "Sil" : "Löschen"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8 shadow-2xl border border-slate-100">
              {/* Üst Bar - AdminVolunteerPage tarzı */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 rounded-t-[2.5rem] border-b border-slate-100 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-kpf-teal/10 rounded-2xl">
                    <Calendar className="text-kpf-teal" size={28} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-800">
                      {editingId
                        ? language === "tr"
                          ? "Etkinlik Düzenle"
                          : "Aktivität bearbeiten"
                        : language === "tr"
                        ? "Yeni Etkinlik Oluştur"
                        : "Neue Aktivität erstellen"}
                    </h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle size={10} className="text-green-500" />
                      {language === "tr"
                        ? "Tüm alanları doldurun"
                        : "Füllen Sie alle Felder aus"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
                {/* Başlık Bölümü */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Türkçe */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                        <Languages size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          Türkçe (TR) İçerik
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.titleTr}
                        onChange={(e) =>
                          setFormData({ ...formData, titleTr: e.target.value })
                        }
                        placeholder="Etkinlik Başlığı *"
                        className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                      />
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          Kısa Açıklama *
                        </span>
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
                          placeholder="Etkinlik hakkında kısa açıklama..."
                          className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                        />
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          Detaylı İçerik
                        </span>
                        <QuillEditor
                          value={formData.detailedContentTr}
                          onChange={(val) =>
                            setFormData({ ...formData, detailedContentTr: val })
                          }
                          placeholder="Detay sayfasında gösterilecek içerik..."
                        />
                      </div>
                    </div>

                    {/* Almanca */}
                    <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-12">
                      <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                        <Languages size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          Almanca (DE) İçerik
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.titleDe}
                        onChange={(e) =>
                          setFormData({ ...formData, titleDe: e.target.value })
                        }
                        placeholder="Aktivität Titel *"
                        className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                      />
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          Kurzbeschreibung *
                        </span>
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
                          placeholder="Kurze Beschreibung der Aktivität..."
                          className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                        />
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          Detaillierter Inhalt
                        </span>
                        <QuillEditor
                          value={formData.detailedContentDe}
                          onChange={(val) =>
                            setFormData({ ...formData, detailedContentDe: val })
                          }
                          placeholder="Inhalt für Detailseite..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarih ve Kategori */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest flex items-center gap-2">
                      <Calendar size={14} className="text-kpf-teal" />
                      {language === "tr"
                        ? "Etkinlik Tarihi"
                        : "Aktivitätsdatum"}{" "}
                      *
                    </span>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest">
                      {language === "tr" ? "Kategori" : "Kategorie"} *
                    </span>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                    >
                      <option value="music">🎵 Müzik / Musik</option>
                      <option value="art">🎨 Sanat / Kunst</option>
                      <option value="education">📚 Eğitim / Bildung</option>
                      <option value="culture">🌍 Kültür / Kultur</option>
                      <option value="sport">⚽ Spor / Sport</option>
                      <option value="social">🤝 Sosyal / Sozial</option>
                    </select>
                  </div>
                </div>

                {/* Adres Bilgileri */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-kpf-teal" />
                    {language === "tr"
                      ? "📍 Adres Bilgileri"
                      : "📍 Adressinformationen"}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sokak */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Sokak" : "Straße"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.street || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              street: e.target.value,
                            },
                            location: `${e.target.value}${
                              formData.address?.houseNo
                                ? " " + formData.address.houseNo
                                : ""
                            }, ${formData.address?.zipCode || ""} ${
                              formData.address?.city || ""
                            }`.trim(),
                          })
                        }
                        placeholder={
                          language === "tr"
                            ? "örn: Rheinstraße"
                            : "z.B: Rheinstraße"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Ev Numarası */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Ev No" : "Hausnummer"}
                      </label>
                      <input
                        type="text"
                        value={formData.address?.houseNo || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              houseNo: e.target.value,
                            },
                            location: `${formData.address?.street || ""} ${
                              e.target.value
                            }, ${formData.address?.zipCode || ""} ${
                              formData.address?.city || ""
                            }`.trim(),
                          })
                        }
                        placeholder={language === "tr" ? "örn: 45" : "z.B: 45"}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Posta Kodu */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Posta Kodu" : "Postleitzahl"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.zipCode || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              zipCode: e.target.value,
                            },
                            location: `${formData.address?.street || ""} ${
                              formData.address?.houseNo || ""
                            }, ${e.target.value} ${
                              formData.address?.city || ""
                            }`.trim(),
                          })
                        }
                        placeholder={
                          language === "tr" ? "örn: 64283" : "z.B: 64283"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Şehir */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Şehir" : "Stadt"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.city || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              city: e.target.value,
                            },
                            location: `${formData.address?.street || ""} ${
                              formData.address?.houseNo || ""
                            }, ${formData.address?.zipCode || ""} ${
                              e.target.value
                            }`.trim(),
                          })
                        }
                        placeholder={
                          language === "tr"
                            ? "örn: Darmstadt"
                            : "z.B: Darmstadt"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Eyalet */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Eyalet" : "Bundesland"}
                      </label>
                      <input
                        type="text"
                        value={formData.address?.state || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              state: e.target.value,
                            },
                          })
                        }
                        placeholder={
                          language === "tr" ? "örn: Hessen" : "z.B: Hessen"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Ülke */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "tr" ? "Ülke" : "Land"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.country || "Deutschland"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              country: e.target.value,
                            },
                          })
                        }
                        placeholder={
                          language === "tr"
                            ? "örn: Deutschland"
                            : "z.B: Deutschland"
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 bg-white/50 p-3 rounded-lg">
                    💡{" "}
                    {language === "tr"
                      ? "Adres bilgileri otomatik olarak birleştirilerek görüntülenir"
                      : "Adressinformationen werden automatisch kombiniert angezeigt"}
                  </p>
                </div>

                {/* Ana Resim */}
                <div className="bg-gradient-to-br from-kpf-teal/5 to-kpf-red/5 p-6 rounded-xl border-2 border-dashed border-slate-300">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    📷 {language === "tr" ? "Ana Kapak Resmi" : "Hauptbild"} *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-kpf-teal file:text-white hover:file:bg-kpf-teal/80 file:cursor-pointer"
                  />
                  {formData.imageUrl && (
                    <div className="mt-4 relative">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        ✓ {language === "tr" ? "Yüklendi" : "Hochgeladen"}
                      </div>
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="mt-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-kpf-teal"></div>
                      <p className="text-sm text-slate-600 mt-2">
                        {language === "tr"
                          ? "Yükleniyor..."
                          : "Wird hochgeladen..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🎬{" "}
                    {language === "tr"
                      ? "Video URL (Opsiyonel)"
                      : "Video URL (Optional)"}
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder={
                      language === "tr"
                        ? "https://youtube.com/watch?v=... veya Vimeo URL"
                        : "https://youtube.com/watch?v=... oder Vimeo URL"
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {language === "tr"
                      ? "YouTube veya Vimeo video bağlantısı ekleyebilirsiniz"
                      : "Sie können YouTube- oder Vimeo-Videolinks hinzufügen"}
                  </p>
                </div>

                {/* Galeri */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    🖼️{" "}
                    {language === "tr"
                      ? "Galeri Resimleri (Çoklu Seçim)"
                      : "Galerie-Bilder (Mehrfachauswahl)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-kpf-red file:text-white hover:file:bg-red-700 file:cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {language === "tr"
                      ? "Birden fazla resim seçebilirsiniz. Her resmi silmek için üzerindeki X'e tıklayın."
                      : "Sie können mehrere Bilder auswählen. Klicken Sie auf X, um ein Bild zu entfernen."}
                  </p>
                  {formData.galleryImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.galleryImages.map((url, index) => (
                        <div
                          key={`gallery-${index}-${url.substring(
                            url.length - 10
                          )}`}
                          className="relative group"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
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
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                            title={language === "tr" ? "Sil" : "Löschen"}
                          >
                            <X size={14} />
                          </button>
                          <div className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Aktif/Pasif */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="isActive"
                        className="text-base font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        {formData.isActive ? (
                          <Eye size={20} className="text-green-600" />
                        ) : (
                          <EyeOff size={20} className="text-slate-400" />
                        )}
                        {language === "tr"
                          ? "Yayın Durumu"
                          : "Veröffentlichungsstatus"}
                      </label>
                      <p className="text-sm text-slate-600 mt-1">
                        {language === "tr"
                          ? "Etkinlik web sitesinde görünsün mü?"
                          : "Soll die Aktivität auf der Website sichtbar sein?"}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-16 h-8 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-kpf-teal/30 rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-500 cursor-pointer"></div>
                      <span className="absolute top-1.5 left-2 text-xs font-bold text-white pointer-events-none">
                        {formData.isActive
                          ? language === "tr"
                            ? "AÇIK"
                            : "AN"
                          : language === "tr"
                          ? "KAPALI"
                          : "AUS"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                  <button
                    type="submit"
                    disabled={uploadingImage || !formData.imageUrl}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-kpf-teal to-blue-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                  >
                    <Save size={22} />
                    <span>
                      {editingId
                        ? language === "tr"
                          ? "✓ Değişiklikleri Kaydet"
                          : "✓ Änderungen speichern"
                        : language === "tr"
                        ? "✓ Etkinliği Oluştur"
                        : "✓ Aktivität erstellen"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-bold text-lg flex items-center gap-2"
                  >
                    <X size={20} />
                    {language === "tr" ? "İptal" : "Abbrechen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modern Bildirim Penceresi */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
            <div
              className={`
              min-w-[300px] max-w-md rounded-xl shadow-2xl p-4 flex items-start gap-3 border-2
              ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800"
                  : notification.type === "error"
                  ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800"
              }
            `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === "success" ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : notification.type === "error" ? (
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setNotification({ show: false, type: "success", message: "" })
                }
                className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Editor Özelleştirme CSS */}
        <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
      </div>
    </div>
  );
};

export default AdminActivities;
