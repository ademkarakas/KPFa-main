import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  GraduationCap,
  Calendar,
  Users,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { coursesApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface CourseFormData {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  instructor: string;
  schedule: string;
  duration: string;
  capacity: number;
  price: string;
  imageUrl: string;
  isActive: boolean;
}

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [formData, setFormData] = useState<CourseFormData>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    instructor: "",
    schedule: "",
    duration: "",
    capacity: 20,
    price: "",
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll(true);
      const formatted = data.map(formatAdminCourse);
      setCourses(formatted);
    } catch (error) {
      console.error("Kurslar yüklenirken hata:", error);
      alert("Kurslar yüklenemedi!");
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

  const formatAdminCourse = (item: any) => {
    const formatAddress = (address: any) => {
      if (!address) return "";
      if (typeof address === "string") return address;

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

      instructor: item.instructor || "",

      // 🟢 Admin listede gösterilecek tarih
      date: item.date ? item.date.split("T")[0] : "",

      // 🟢 Schedule (backend’te farklı olabilir)
      schedule: item.scheduleTr || item.scheduleDe || item.schedule || "",

      // 🟢 Adres / Lokasyon
      location:
        formatAddress(item.courseLocation) || formatAddress(item.address) || "",

      duration: item.duration || "",
      capacity: item.capacity ?? 0,
      price: item.price || "",
      imageUrl: item.imageUrl || "",
      isActive: item.isActive ?? true,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dto = {
        titleTr: formData.titleTr,
        titleDe: formData.titleDe,
        descriptionTr: formData.descriptionTr,
        descriptionDe: formData.descriptionDe,
        instructor: formData.instructor,
        schedule: formData.schedule,
        duration: formData.duration,
        capacity: formData.capacity,
        price: formData.price,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      };

      if (editingId) {
        await coursesApi.update(editingId, dto);
      } else {
        await coursesApi.create(dto);
      }

      await loadCourses();
      resetForm();
      alert(editingId ? "Kurs güncellendi!" : "Kurs oluşturuldu!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("İşlem başarısız!");
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      titleTr: course.titleTr,
      titleDe: course.titleDe,
      descriptionTr: course.descriptionTr,
      descriptionDe: course.descriptionDe,
      instructor: course.instructor,
      schedule: course.schedule,
      duration: course.duration,
      capacity: course.capacity,
      price: course.price,
      imageUrl: course.imageUrl,
      isActive: course.isActive,
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kursu silmek istediğinizden emin misiniz?")) return;

    try {
      await coursesApi.delete(id);
      await loadCourses();
      alert("Kurs silindi!");
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
      instructor: "",
      schedule: "",
      duration: "",
      capacity: 20,
      price: "",
      imageUrl: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
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
            {t("admin_courses_title")}
          </h1>
          <p className="text-slate-600">
            {language === "tr" ? "Toplam" : "Gesamt"} {courses.length}{" "}
            {language === "tr" ? "kurs" : "Kurse"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span className="font-semibold">{t("admin_courses_new")}</span>
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
          placeholder={language === "tr" ? "Kurs ara..." : "Kurs suchen..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            {language === "tr"
              ? "Arama sonucunda kurs bulunamadı."
              : "Keine Kurse gefunden."}
          </p>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-slate-500 bg-slate-50">
          <div className="col-span-4">
            {language === "tr" ? "Kurs / Etkinlik" : "Kurs / Veranstaltung"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Eğitmen" : "Dozent"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Tarih" : "Termin"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "Kapasite" : "Kapazität"}
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
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors"
            >
              {/* Title + Image */}
              <div className="col-span-4 flex items-center gap-4">
                <div>
                  <p className="font-semibold text-slate-800 line-clamp-1">
                    {language === "tr" ? course.titleTr : course.titleDe}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {language === "tr"
                      ? course.descriptionTr
                      : course.descriptionDe}
                  </p>
                </div>
              </div>

              {/* Instructor */}
              <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                <GraduationCap size={14} className="text-kpf-teal" />
                <span className="line-clamp-1">{course.instructor}</span>
              </div>

              {/* Schedule */}
              <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                <Calendar size={14} className="text-kpf-teal" />
                <span className="line-clamp-1">{course.schedule}</span>
              </div>

              {/* Capacity */}
              <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                <Users size={14} className="text-kpf-teal" />
                <span>{course.capacity}</span>
              </div>

              {/* Status */}
              <div className="col-span-1 flex justify-center">
                {course.isActive ? (
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
                  onClick={() => handleEdit(course)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                  title={language === "tr" ? "Düzenle" : "Bearbeiten"}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
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
                    ? "Kurs Düzenle"
                    : "Kurs bearbeiten"
                  : language === "tr"
                  ? "Yeni Kurs"
                  : "Neuer Kurs"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Başlık */}
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

              {/* Açıklama */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Açıklama (Türkçe) *
                  </label>
                  <textarea
                    required
                    rows={4}
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
                    Beschreibung (Deutsch) *
                  </label>
                  <textarea
                    required
                    rows={4}
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

              {/* Eğitmen ve Program */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Eğitmen *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    placeholder="örn: Pazartesi 18:00-20:00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* Süre, Kapasite, Fiyat */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Süre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="örn: 12 Hafta"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Kapasite *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fiyat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="örn: Ücretsiz / 50€"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* Resim */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resim *
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
                  Kurs Aktif
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

export default AdminCourses;
