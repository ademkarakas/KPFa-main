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
      setCourses(data);
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
          <p className="text-slate-600">Toplam {courses.length} kurs</p>
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
          placeholder="Kurs ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={course.imageUrl}
                alt={course.titleTr}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {course.isActive ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Eye size={14} />
                    Aktif
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <EyeOff size={14} />
                    Pasif
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {course.titleTr}
              </h3>
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Kapasite: {course.capacity}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit size={16} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
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
                {editingId ? "Kurs Düzenle" : "Yeni Kurs"}
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

export default AdminCourses;
