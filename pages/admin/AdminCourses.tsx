import React, { useState, useEffect, useRef } from "react";
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
  MapPin,
} from "lucide-react";
import { coursesApi, uploadApi } from "../../services/api";
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

interface CourseFormData {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailsTr: string;
  detailsDe: string;
  scheduleTr: string;
  scheduleDe: string;
  icon: string;
  instructor: string;
  date: string;
  courseLocation?: {
    street?: string;
    houseNo?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  courseCategory: string;
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
    setTimeout(() => setNotification({ show: false, type, message: "" }), 3000);
  };
  const [formData, setFormData] = useState<CourseFormData>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    detailsTr: "",
    detailsDe: "",
    scheduleTr: "",
    scheduleDe: "",
    icon: "BookOpen",
    instructor: "",
    date: "",
    courseLocation: {
      street: "",
      houseNo: "",
      zipCode: "",
      city: "",
      state: "",
      country: "",
    },
    courseCategory: "",
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
      showNotification(
        "error",
        language === "tr"
          ? "Kurslar yüklenemedi!"
          : "Kurse konnten nicht geladen werden!"
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

  const formatAdminCourse = (item: any) => {
    const formatcourseLocation = (courseLocation: any) => {
      if (!courseLocation) return "";
      if (typeof courseLocation === "string") return courseLocation;

      const parts = [];
      if (courseLocation.street) parts.push(courseLocation.street);
      if (courseLocation.houseNo) parts.push(courseLocation.houseNo);
      if (courseLocation.zipCode) parts.push(courseLocation.zipCode);
      if (courseLocation.city) parts.push(courseLocation.city);
      if (courseLocation.state) parts.push(courseLocation.state);
      if (courseLocation.country) parts.push(courseLocation.country);
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

      // 🟢 Schedule - dile göre gösterilecek
      scheduleTr: item.scheduleTr || "",
      scheduleDe: item.scheduleDe || "",

      // 🟢 Adres / Lokasyon
      location:
        formatcourseLocation(item.courseLocation) ||
        formatcourseLocation(item.courseLocation) ||
        "",
      courseLocation: item.courseLocation || null,

      duration: item.duration || "",
      capacity: item.capacity ?? 0,
      price: item.price || "",
      courseCategory: item.courseCategory || "",
      imageUrl: item.imageUrl || "",
      isActive: item.isActive ?? true,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dto = {
        ...(editingId && { Id: editingId }),
        TitleTr: formData.titleTr,
        TitleDe: formData.titleDe,
        DescriptionTr: formData.descriptionTr,
        DescriptionDe: formData.descriptionDe,
        DetailsTr: formData.detailsTr || null,
        DetailsDe: formData.detailsDe || null,
        ScheduleTr: formData.scheduleTr || null,
        ScheduleDe: formData.scheduleDe || null,
        Icon: formData.icon || null,
        Instructor: formData.instructor || null,
        Date: formData.date ? new Date(formData.date).toISOString() : null,
        CourseLocation:
          formData.courseLocation?.street || formData.courseLocation?.city
            ? {
                Street: formData.courseLocation.street || null,
                HouseNo: formData.courseLocation.houseNo || null,
                ZipCode: formData.courseLocation.zipCode || null,
                City: formData.courseLocation.city || null,
                State: formData.courseLocation.state || null,
                Country: formData.courseLocation.country || null,
              }
            : null,
        CourseCategory: formData.courseCategory || null,
        ImageUrl: formData.imageUrl,
        IsActive: formData.isActive,
      };

      if (editingId) {
        await coursesApi.update(editingId, dto);
      } else {
        await coursesApi.create(dto);
      }

      await loadCourses();
      resetForm();
      showNotification(
        "success",
        editingId
          ? language === "tr"
            ? "Kurs güncellendi!"
            : "Kurs wurde aktualisiert!"
          : language === "tr"
          ? "Kurs oluşturuldu!"
          : "Kurs wurde erstellt!"
      );
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification(
        "error",
        language === "tr" ? "İşlem başarısız!" : "Vorgang fehlgeschlagen!"
      );
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      titleTr: course.titleTr || "",
      titleDe: course.titleDe || "",
      descriptionTr: course.descriptionTr || "",
      descriptionDe: course.descriptionDe || "",
      detailsTr: course.detailsTr || course.descriptionTr || "",
      detailsDe: course.detailsDe || course.descriptionDe || "",
      scheduleTr: course.scheduleTr || "",
      scheduleDe: course.scheduleDe || "",
      icon: course.icon || "BookOpen",
      instructor: course.instructor || "",
      date: course.date || "",
      courseLocation:
        course.courseLocation && typeof course.courseLocation === "object"
          ? {
              street: course.courseLocation.street || "",
              houseNo: course.courseLocation.houseNo || "",
              zipCode: course.courseLocation.zipCode || "",
              city: course.courseLocation.city || "",
              state: course.courseLocation.state || "",
              country: course.courseLocation.country || "",
            }
          : typeof course.courseLocation === "string"
          ? {
              street: course.courseLocation,
              houseNo: "",
              zipCode: "",
              city: "",
              state: "",
              country: "",
            }
          : {
              street: "",
              houseNo: "",
              zipCode: "",
              city: "",
              state: "",
              country: "",
            },
      courseCategory: course.courseCategory || "",
      imageUrl: course.imageUrl || "",
      isActive: course.isActive ?? true,
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kursu silmek istediğinizden emin misiniz?")) return;

    try {
      await coursesApi.delete(id);
      await loadCourses();
      showNotification(
        "success",
        language === "tr" ? "Kurs silindi!" : "Kurs wurde gelöscht!"
      );
    } catch (error) {
      console.error("Silme hatası:", error);
      showNotification(
        "error",
        language === "tr"
          ? "Silme işlemi başarısız!"
          : "Löschen fehlgeschlagen!"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      titleTr: "",
      titleDe: "",
      descriptionTr: "",
      descriptionDe: "",
      detailsTr: "",
      detailsDe: "",
      scheduleTr: "",
      scheduleDe: "",
      icon: "BookOpen",
      instructor: "",
      date: "",
      courseLocation: {
        street: "",
        houseNo: "",
        zipCode: "",
        city: "",
        state: "",
        country: "",
      },
      courseCategory: "",
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

  const toggleActive = async (id: any, currentStatus: boolean) => {
    try {
      const course = courses.find((c) => c.id === id);
      if (!course) {
        showNotification(
          "error",
          language === "tr" ? "Kurs bulunamadı!" : "Kurs nicht gefunden!"
        );
        return;
      }

      const dto: any = {
        ...(id && { Id: id }),
        TitleTr: course.titleTr,
        TitleDe: course.titleDe,
        DescriptionTr: course.descriptionTr,
        DescriptionDe: course.descriptionDe,
        DetailsTr: course.detailsTr || null,
        DetailsDe: course.detailsDe || null,
        ScheduleTr: course.scheduleTr || null,
        ScheduleDe: course.scheduleDe || null,
        Icon: course.icon || null,
        Instructor: course.instructor || null,
        Date: course.date ? new Date(course.date).toISOString() : null,
        CourseLocation: course.courseLocation || null,
        CourseCategory: course.courseCategory || null,
        ImageUrl: course.imageUrl || null,
        IsActive: !currentStatus,
      };

      await coursesApi.update(id as any, dto);
      await loadCourses();
      showNotification(
        "success",
        !currentStatus
          ? language === "tr"
            ? "Kurs aktif hale getirildi!"
            : "Kurs aktiviert!"
          : language === "tr"
          ? "Kurs pasif hale getirildi!"
          : "Kurs deaktiviert!"
      );
    } catch (error) {
      console.error("Durum değiştirme hatası:", error);
      showNotification(
        "error",
        language === "tr"
          ? "Durum değiştirilemedi!"
          : "Status konnte nicht geändert werden!"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-kpf-teal"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap size={36} className="text-kpf-red animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-slate-700">
          {language === "tr"
            ? "Kurslar yükleniyor..."
            : "Kurse werden geladen..."}
        </p>
        <p className="text-sm text-slate-500 mt-2">
          {language === "tr" ? "Lütfen bekleyin" : "Bitte warten Sie"}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-kpf-teal to-kpf-teal rounded-2xl p-6 shadow-lg text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            📚 {t("admin_courses_title")}
          </h1>
          <p className="text-lg font-semibold text-white/90">
            {language === "tr" ? "Toplam" : "Gesamt"}{" "}
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {courses.length}
            </span>{" "}
            {language === "tr" ? "kurs" : "Kurse"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 px-8 py-4 bg-white text-kpf-red rounded-xl hover:bg-gray-100 transition-all shadow-xl font-bold text-lg hover:scale-105 transform"
        >
          <Plus size={24} />
          <span>{t("admin_courses_new")}</span>
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
              ? "🔍 Kurs ara... (başlık, eğitmen veya kategoriye göre)"
              : "🔍 Kurs suchen... (nach Titel, Dozent oder Kategorie)"
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-kpf-teal/30 focus:border-kpf-teal text-base shadow-sm"
        />
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
              <Search size={40} className="text-slate-400" />
            </div>
            <p className="text-slate-600 text-xl font-semibold mb-2">
              {language === "tr"
                ? "🔍 Arama sonucunda kurs bulunamadı"
                : "🔍 Keine Kurse gefunden"}
            </p>
            <p className="text-slate-500 text-sm">
              {language === "tr"
                ? "Farklı anahtar kelimeler deneyin veya yeni bir kurs ekleyin"
                : "Versuchen Sie andere Schlüsselwörter oder fügen Sie einen neuen Kurs hinzu"}
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
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div
            className={
              `min-w-[300px] max-w-md rounded-xl shadow-2xl p-4 flex items-start gap-3 border-2 ` +
              (notification.type === "success"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800"
                : notification.type === "error"
                ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800")
            }
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

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-white bg-gradient-to-r from-kpf-teal to-kpf-teal uppercase tracking-wide">
          <div className="col-span-4">
            {language === "tr" ? "📚 Kurs" : "📚 Kurs"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "👨‍🏫 Eğitmen" : "👨‍🏫 Dozent"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "📅 Program" : "📅 Zeitplan"}
          </div>
          <div className="col-span-2">
            {language === "tr" ? "👥 Kapasite" : "👥 Kapazität"}
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
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gradient-to-r hover:from-kpf-teal/5 hover:to-kpf-red/5 transition-all duration-200 border-l-4 border-transparent hover:border-kpf-teal"
            >
              {/* Title + Image */}
              <div className="col-span-4 flex items-center gap-4">
                {course.imageUrl && (
                  <div className="relative">
                    <img
                      src={course.imageUrl}
                      alt={course.titleTr}
                      className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-white"
                    />
                    {!course.isActive && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <EyeOff size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 line-clamp-1 text-base">
                    {language === "tr" ? course.titleTr : course.titleDe}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {language === "tr"
                      ? course.descriptionTr
                      : course.descriptionDe}
                  </p>
                </div>
              </div>

              {/* Instructor */}
              <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                <GraduationCap size={16} className="text-kpf-red" />
                <span className="line-clamp-1">{course.instructor || "-"}</span>
              </div>

              {/* Schedule */}
              <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                <Calendar size={16} className="text-kpf-red" />
                <span className="line-clamp-1">
                  {language === "tr" ? course.scheduleTr : course.scheduleDe}
                </span>
              </div>

              {/* Capacity */}
              <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                <Users size={16} className="text-kpf-teal" />
                <span>{course.capacity || "-"}</span>
              </div>

              {/* Status */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => toggleActive(course.id, course.isActive)}
                  className="group relative"
                  title={
                    language === "tr"
                      ? course.isActive
                        ? "Pasif yap"
                        : "Aktif yap"
                      : course.isActive
                      ? "Deaktivieren"
                      : "Aktivieren"
                  }
                >
                  {course.isActive ? (
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
                  onClick={() => handleEdit(course)}
                  className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all hover:shadow-md"
                  title={language === "tr" ? "Düzenle" : "Bearbeiten"}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all hover:shadow-md"
                  title={language === "tr" ? "Sil" : "Löschen"}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto my-8 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-kpf-teal to-kpf-red text-white p-6 flex items-center justify-between z-10 shadow-lg">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {editingId ? (
                    <>
                      <Edit size={28} />
                      {language === "tr" ? "Kurs Düzenle" : "Kurs bearbeiten"}
                    </>
                  ) : (
                    <>
                      <Plus size={28} />
                      {language === "tr"
                        ? "Yeni Kurs Oluştur"
                        : "Neuen Kurs erstellen"}
                    </>
                  )}
                </h2>
                <p className="text-sm mt-1 text-white/80">
                  {language === "tr"
                    ? "Tüm alanları dikkatle doldurun"
                    : "Füllen Sie alle Felder sorgfältig aus"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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

              {/* Detaylı Açıklama */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detaylı Açıklama (Türkçe)
                  </label>
                  <QuillEditor
                    value={formData.detailsTr}
                    onChange={(val) =>
                      setFormData({ ...formData, detailsTr: val })
                    }
                    placeholder="Detay sayfasında gösterilecek içerik..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detaillierte Beschreibung (Deutsch)
                  </label>
                  <QuillEditor
                    value={formData.detailsDe}
                    onChange={(val) =>
                      setFormData({ ...formData, detailsDe: val })
                    }
                    placeholder="Inhalt für Detailseite..."
                  />
                </div>
              </div>

              {/* Program */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Program (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.scheduleTr}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduleTr: e.target.value })
                    }
                    placeholder="örn: Pazartesi 18:00-20:00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Zeitplan (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.scheduleDe}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduleDe: e.target.value })
                    }
                    placeholder="z.B: Montag 18:00-20:00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* İkon, Eğitmen, Tarih */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    İkon *
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  >
                    <option value="BookOpen">BookOpen</option>
                    <option value="MessageCircle">MessageCircle</option>
                    <option value="Languages">Languages</option>
                    <option value="Music">Music</option>
                    <option value="Heart">Heart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Eğitmen
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
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
                      value={formData.courseLocation?.street || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: e.target.value,
                            houseNo: formData.courseLocation?.houseNo || "",
                            zipCode: formData.courseLocation?.zipCode || "",
                            city: formData.courseLocation?.city || "",
                            state: formData.courseLocation?.state || "",
                            country: formData.courseLocation?.country || "",
                          },
                          location: `${e.target.value}${
                            formData.courseLocation?.houseNo
                              ? " " + formData.courseLocation.houseNo
                              : ""
                          }, ${formData.courseLocation?.zipCode || ""} ${
                            formData.courseLocation?.city || ""
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
                      value={formData.courseLocation?.houseNo || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: formData.courseLocation?.street || "",
                            houseNo: e.target.value,
                            zipCode: formData.courseLocation?.zipCode || "",
                            city: formData.courseLocation?.city || "",
                            state: formData.courseLocation?.state || "",
                            country: formData.courseLocation?.country || "",
                          },
                          location: `${formData.courseLocation?.street || ""} ${
                            e.target.value
                          }, ${formData.courseLocation?.zipCode || ""} ${
                            formData.courseLocation?.city || ""
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
                      value={formData.courseLocation?.zipCode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: formData.courseLocation?.street || "",
                            houseNo: formData.courseLocation?.houseNo || "",
                            zipCode: e.target.value,
                            city: formData.courseLocation?.city || "",
                            state: formData.courseLocation?.state || "",
                            country: formData.courseLocation?.country || "",
                          },
                          location: `${formData.courseLocation?.street || ""} ${
                            formData.courseLocation?.houseNo || ""
                          }, ${e.target.value} ${
                            formData.courseLocation?.city || ""
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
                      value={formData.courseLocation?.city || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: formData.courseLocation?.street || "",
                            houseNo: formData.courseLocation?.houseNo || "",
                            zipCode: formData.courseLocation?.zipCode || "",
                            city: e.target.value,
                            state: formData.courseLocation?.state || "",
                            country: formData.courseLocation?.country || "",
                          },
                          location: `${formData.courseLocation?.street || ""} ${
                            formData.courseLocation?.houseNo || ""
                          }, ${formData.courseLocation?.zipCode || ""} ${
                            e.target.value
                          }`.trim(),
                        })
                      }
                      placeholder={
                        language === "tr" ? "örn: Darmstadt" : "z.B: Darmstadt"
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
                      value={formData.courseLocation?.state || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: formData.courseLocation?.street || "",
                            houseNo: formData.courseLocation?.houseNo || "",
                            zipCode: formData.courseLocation?.zipCode || "",
                            city: formData.courseLocation?.city || "",
                            state: e.target.value,
                            country: formData.courseLocation?.country || "",
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
                      value={formData.courseLocation?.country || "Deutschland"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseLocation: {
                            street: formData.courseLocation?.street || "",
                            houseNo: formData.courseLocation?.houseNo || "",
                            zipCode: formData.courseLocation?.zipCode || "",
                            city: formData.courseLocation?.city || "",
                            state: formData.courseLocation?.state || "",
                            country: e.target.value,
                          },
                        })
                      }
                      placeholder={
                        language === "tr" ? "örn: Almanya" : "z.B: Deutschland"
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kategori / Kategorie
                </label>
                <input
                  type="text"
                  value={formData.courseCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, courseCategory: e.target.value })
                  }
                  placeholder="örn: Dil Kursu, Sprachkurs"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
              </div>

              {/* Resim */}
              <div className="bg-gradient-to-br from-kpf-teal/5 to-kpf-red/5 p-6 rounded-xl border-2 border-dashed border-slate-300">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  📷 {language === "tr" ? "Kurs Resmi" : "Kursbild"} *
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
                        ? "Kurs web sitesinde görünsün mü?"
                        : "Soll der Kurs auf der Website sichtbar sein?"}
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
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
                  disabled={
                    uploadingImage || (!editingId && !formData.imageUrl)
                  }
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-kpf-teal to-blue-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                >
                  <Save size={22} />
                  <span>
                    {editingId
                      ? language === "tr"
                        ? "✓ Değişiklikleri Kaydet"
                        : "✓ Änderungen speichern"
                      : language === "tr"
                      ? "✓ Kursu Oluştur"
                      : "✓ Kurs erstellen"}
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

      {/* Editor Özelleştirme CSS */}
      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
    </div>
  );
};

export default AdminCourses;
