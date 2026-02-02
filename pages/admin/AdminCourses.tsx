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
  CheckCircle,
  Languages,
} from "lucide-react";
import { coursesApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type NotificationType = "success" | "error" | "info";

const byLanguage = (language: string, tr: string, de: string) =>
  language === "tr" ? tr : de;

const notificationThemeByType: Record<NotificationType, string> = {
  success:
    "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800",
  error: "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800",
  info: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800",
};

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  if (type === "success") {
    return (
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
    );
  }

  if (type === "error") {
    return (
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
    );
  }

  return (
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
  );
};

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
        placeholder: placeholder ?? "",
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
  time: string; // Backend requires Time field for UpdateCourseCommand
  address?: {
    street?: string;
    houseNo?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  category: string; // Backend uses 'Category' not 'CourseCategory'
  imageUrl: string;
  isActive: boolean;
}

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [notification, setNotification] = useState<{
    show: boolean;
    type: NotificationType;
    message: string;
  }>({ show: false, type: "success", message: "" });

  const showNotification = (type: NotificationType, message: string) => {
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
    time: "", // Backend Time field
    address: {
      street: "",
      houseNo: "",
      zipCode: "",
      city: "",
      state: "",
      country: "",
    },
    category: "",
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
      showNotification("error", t("admin_courses_load_failed"));
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
      showNotification("error", t("admin_courses_image_upload_failed"));
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
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
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

      // 🟢 Adres / Lokasyon - Backend returns address in courseLocation field
      location: formatAddress(item.address || item.courseLocation) || "",
      address: item.address || item.courseLocation || null,

      duration: item.duration || "",
      capacity: item.capacity ?? 0,
      price: item.price || "",
      category: item.courseCategory || item.category || "",
      imageUrl: item.imageUrl || "",
      isActive: item.isActive ?? true,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Backend Command structure - camelCase for JSON
      const dto = {
        ...(editingId && { id: editingId }),
        titleTr: formData.titleTr,
        titleDe: formData.titleDe,
        descriptionTr: formData.descriptionTr,
        descriptionDe: formData.descriptionDe,
        detailsTr: formData.detailsTr || null,
        detailsDe: formData.detailsDe || null,
        scheduleTr: formData.scheduleTr || null,
        scheduleDe: formData.scheduleDe || null,
        icon: formData.icon || null,
        instructor: formData.instructor || null,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        // Backend UpdateCourseCommand requires Time field
        ...(editingId && {
          time: formData.time
            ? new Date(`1970-01-01T${formData.time}:00`).toISOString()
            : new Date().toISOString(),
        }),
        // Backend uses 'Address' not 'CourseLocation'
        address:
          formData.address?.street || formData.address?.city
            ? {
                street: formData.address.street || null,
                houseNo: formData.address.houseNo || null,
                zipCode: formData.address.zipCode || null,
                city: formData.address.city || null,
                state: formData.address.state || null,
                country: formData.address.country || null,
              }
            : null,
        // Backend uses 'Category' not 'CourseCategory'
        category: formData.category || null,
        isActive: formData.isActive,
      };

      if (editingId) {
        await coursesApi.update(editingId, dto);
      } else {
        await coursesApi.create(dto);
      }

      await loadCourses();
      resetForm();

      const successMessage = editingId
        ? t("admin_courses_update_success")
        : t("admin_courses_create_success");
      showNotification("success", successMessage);
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification("error", t("admin_operation_failed"));
    }
  };

  // Helper function to normalize address data from backend (courseLocation) to form (address)
  const normalizeAddressFormValue = (course: any) => {
    // Backend returns courseLocation, we map to address
    const location = course.courseLocation || course.address;
    if (location && typeof location === "object") {
      return {
        street: location.street || "",
        houseNo: location.houseNo || "",
        zipCode: location.zipCode || "",
        city: location.city || "",
        state: location.state || "",
        country: location.country || "",
      };
    }

    if (typeof location === "string") {
      return {
        street: location,
        houseNo: "",
        zipCode: "",
        city: "",
        state: "",
        country: "",
      };
    }

    return {
      street: "",
      houseNo: "",
      zipCode: "",
      city: "",
      state: "",
      country: "",
    };
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
      time: course.time || "",
      address: normalizeAddressFormValue(course),
      category: course.courseCategory || course.category || "",
      imageUrl: course.imageUrl || "",
      isActive: course.isActive ?? true,
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin_courses_delete_confirm"))) return;

    try {
      await coursesApi.delete(id);
      await loadCourses();
      showNotification("success", t("admin_courses_delete_success"));
    } catch (error) {
      console.error("Silme hatası:", error);
      showNotification("error", t("admin_courses_delete_failed"));
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
      time: "",
      address: {
        street: "",
        houseNo: "",
        zipCode: "",
        city: "",
        state: "",
        country: "",
      },
      category: "",
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
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const course = courses.find((c) => c.id === id);
      if (!course) {
        showNotification("error", t("admin_courses_not_found"));
        return;
      }

      const nextIsActive = !currentStatus;

      // Backend Command structure - camelCase for JSON
      const dto: any = {
        id: id,
        titleTr: course.titleTr,
        titleDe: course.titleDe,
        descriptionTr: course.descriptionTr,
        descriptionDe: course.descriptionDe,
        detailsTr: course.detailsTr || null,
        detailsDe: course.detailsDe || null,
        scheduleTr: course.scheduleTr || null,
        scheduleDe: course.scheduleDe || null,
        icon: course.icon || null,
        instructor: course.instructor || null,
        date: course.date ? new Date(course.date).toISOString() : null,
        time: new Date().toISOString(), // Required by UpdateCourseCommand
        address: course.courseLocation || null, // Backend uses 'Address'
        category: course.courseCategory || null, // Backend uses 'Category'
        isActive: nextIsActive,
      };

      await coursesApi.update(id, dto);
      await loadCourses();

      const toggleMessage = nextIsActive
        ? t("admin_courses_activated_success")
        : t("admin_courses_deactivated_success");
      showNotification("success", toggleMessage);
    } catch (error) {
      console.error("Durum değiştirme hatası:", error);
      showNotification("error", t("admin_courses_toggle_failed"));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-teal"></div>
        <p className="mt-4 text-slate-500 font-medium">
          {t("admin_courses_loading")}
        </p>
      </div>
    );
  }

  const searchPlaceholder = t("admin_courses_search_placeholder");
  const noResultsTitle = t("admin_courses_no_results_title");
  const noResultsSubtitle = t("admin_courses_no_results_subtitle");
  const clearSearchLabel = t("admin_clear_search");
  const statusActivateLabel = t("admin_courses_activate");
  const statusDeactivateLabel = t("admin_courses_deactivate");
  const modalTitle = editingId
    ? t("admin_courses_edit")
    : t("admin_courses_create");
  const modalSubtitle = t("admin_fill_all_fields");
  const submitLabel = editingId
    ? t("admin_courses_submit_update")
    : t("admin_courses_submit_create");
  const cancelLabel = t("admin_cancel");
  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="space-y-6">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <GraduationCap className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("admin_courses_title")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {language === "tr" ? "Toplam" : "Gesamt"} {courses.length}{" "}
                {language === "tr" ? "kurs" : "Kurse"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Plus size={18} />
            {t("admin_courses_new")}
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
            placeholder={searchPlaceholder}
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
                {noResultsTitle}
              </p>
              <p className="text-slate-500 text-sm">{noResultsSubtitle}</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/80 transition-all font-semibold"
                >
                  {clearSearchLabel}
                </button>
              )}
            </div>
          </div>
        )}
        {/* Notification */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
            <div
              className={`min-w-[300px] max-w-md rounded-xl shadow-2xl p-4 flex items-start gap-3 border-2 ${
                notificationThemeByType[notification.type]
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <NotificationIcon type={notification.type} />
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
            <div className="col-span-4">{t("admin_courses_header_course")}</div>
            <div className="col-span-2">
              {t("admin_courses_header_instructor")}
            </div>
            <div className="col-span-2">
              {t("admin_courses_header_schedule")}
            </div>
            <div className="col-span-2">
              {t("admin_courses_header_capacity")}
            </div>
            <div className="col-span-1 text-center">
              {t("admin_courses_header_status")}
            </div>
            <div className="col-span-1 text-right">
              {t("admin_courses_header_actions")}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gradient-to-r hover:from-kpf-teal/5 hover:to-kpf-teal/5 transition-all duration-200 border-l-4 border-transparent hover:border-kpf-teal"
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
                      {byLanguage(language, course.titleTr, course.titleDe)}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {byLanguage(
                        language,
                        course.descriptionTr,
                        course.descriptionDe,
                      )}
                    </p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                  <GraduationCap size={16} className="text-kpf-teal" />
                  <span className="line-clamp-1">
                    {course.instructor || "-"}
                  </span>
                </div>

                {/* Schedule */}
                <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                  <Calendar size={16} className="text-kpf-teal" />
                  <span className="line-clamp-1">
                    {byLanguage(language, course.scheduleTr, course.scheduleDe)}
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
                      course.isActive
                        ? statusDeactivateLabel
                        : statusActivateLabel
                    }
                  >
                    {course.isActive ? (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-green-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                        <Eye size={14} />
                        {t("admin_active")}
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 text-xs font-bold rounded-full flex items-center gap-1.5 border border-slate-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                        <EyeOff size={14} />
                        {t("admin_inactive")}
                      </span>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all hover:shadow-md"
                    title={t("admin_edit")}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all hover:shadow-md"
                    title={t("admin_delete")}
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8 shadow-2xl border border-slate-100">
              {/* Üst Bar - AdminVolunteerPage tarzı */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 rounded-t-[2.5rem] border-b border-slate-100 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-kpf-teal/10 rounded-2xl">
                    <GraduationCap className="text-kpf-teal" size={28} />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-800">
                      {modalTitle}
                    </h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle size={10} className="text-green-500" />
                      {modalSubtitle}
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
                {/* Başlık ve Açıklama Bölümü */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Türkçe */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                        <Languages size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          {t("admin_content_tr")}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.titleTr}
                        onChange={(e) =>
                          setFormData({ ...formData, titleTr: e.target.value })
                        }
                        placeholder={t(
                          "admin_courses_form_title_tr_placeholder",
                        )}
                        className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                      />
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          {t("admin_courses_short_description_label")} *
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
                          placeholder={t(
                            "admin_courses_short_description_tr_placeholder",
                          )}
                          className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                        />
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          {t("admin_courses_detailed_description_label")}
                        </span>
                        <QuillEditor
                          value={formData.detailsTr}
                          onChange={(val) =>
                            setFormData({ ...formData, detailsTr: val })
                          }
                          placeholder={t(
                            "admin_courses_details_tr_placeholder",
                          )}
                        />
                      </div>
                    </div>

                    {/* Almanca */}
                    <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-12">
                      <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                        <Languages size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          {t("admin_content_de")}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.titleDe}
                        onChange={(e) =>
                          setFormData({ ...formData, titleDe: e.target.value })
                        }
                        placeholder={t(
                          "admin_courses_form_title_de_placeholder",
                        )}
                        className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                      />
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          {t("admin_courses_short_description_label")} *
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
                          placeholder={t(
                            "admin_courses_short_description_de_placeholder",
                          )}
                          className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                        />
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          {t("admin_courses_detailed_description_label")}
                        </span>
                        <QuillEditor
                          value={formData.detailsDe}
                          onChange={(val) =>
                            setFormData({ ...formData, detailsDe: val })
                          }
                          placeholder={t(
                            "admin_courses_details_de_placeholder",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Bölümü */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Türkçe Program */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                        <Calendar size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          {t("admin_courses_schedule_tr_label")}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.scheduleTr}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduleTr: e.target.value,
                          })
                        }
                        placeholder={t("admin_courses_schedule_tr_placeholder")}
                        className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                      />
                    </div>
                    {/* Almanca Program */}
                    <div className="space-y-4 lg:border-l lg:border-slate-50 lg:pl-12">
                      <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                        <Calendar size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">
                          {t("admin_courses_schedule_de_label")}
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.scheduleDe}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduleDe: e.target.value,
                          })
                        }
                        placeholder={t("admin_courses_schedule_de_placeholder")}
                        className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Eğitmen ve Tarih */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest flex items-center gap-2">
                      <Users size={14} className="text-kpf-teal" />
                      {t("admin_courses_instructor_label")}
                    </span>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      placeholder={t("admin_courses_instructor_placeholder")}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest flex items-center gap-2">
                      <Calendar size={14} className="text-kpf-teal" />
                      {t("admin_courses_start_date_label")}
                    </span>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                    />
                  </div>
                </div>

                {/* İkon, Eğitmen, Tarih */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="courseIcon"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      {t("admin_courses_icon_label")} *
                    </label>
                    <select
                      id="courseIcon"
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
                    <label
                      htmlFor="courseInstructor"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      {t("admin_courses_instructor_label")}
                    </label>
                    <input
                      id="courseInstructor"
                      type="text"
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="courseDate"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      {t("admin_courses_start_date_label")}
                    </label>
                    <input
                      id="courseDate"
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
                    {t("admin_courses_address_section_title")}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sokak */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_street")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.street || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: e.target.value,
                              houseNo: formData.address?.houseNo || "",
                              zipCode: formData.address?.zipCode || "",
                              city: formData.address?.city || "",
                              state: formData.address?.state || "",
                              country: formData.address?.country || "",
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
                        placeholder={t(
                          "admin_courses_address_street_placeholder",
                        )}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Ev Numarası */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_houseNo")}
                      </label>
                      <input
                        type="text"
                        value={formData.address?.houseNo || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: formData.address?.street || "",
                              houseNo: e.target.value,
                              zipCode: formData.address?.zipCode || "",
                              city: formData.address?.city || "",
                              state: formData.address?.state || "",
                              country: formData.address?.country || "",
                            },
                            location: `${
                              formData.address?.street || ""
                            } ${e.target.value}, ${
                              formData.address?.zipCode || ""
                            } ${formData.address?.city || ""}`.trim(),
                          })
                        }
                        placeholder={t(
                          "admin_courses_address_house_placeholder",
                        )}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Posta Kodu */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_postalCode")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.zipCode || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: formData.address?.street || "",
                              houseNo: formData.address?.houseNo || "",
                              zipCode: e.target.value,
                              city: formData.address?.city || "",
                              state: formData.address?.state || "",
                              country: formData.address?.country || "",
                            },
                            location: `${
                              formData.address?.street || ""
                            } ${formData.address?.houseNo || ""}, ${
                              e.target.value
                            } ${formData.address?.city || ""}`.trim(),
                          })
                        }
                        placeholder={t("admin_courses_address_zip_placeholder")}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Şehir */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_city")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.city || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: formData.address?.street || "",
                              houseNo: formData.address?.houseNo || "",
                              zipCode: formData.address?.zipCode || "",
                              city: e.target.value,
                              state: formData.address?.state || "",
                              country: formData.address?.country || "",
                            },
                            location: `${
                              formData.address?.street || ""
                            } ${formData.address?.houseNo || ""}, ${
                              formData.address?.zipCode || ""
                            } ${e.target.value}`.trim(),
                          })
                        }
                        placeholder={t(
                          "admin_courses_address_city_placeholder",
                        )}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Eyalet */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_state")}
                      </label>
                      <input
                        type="text"
                        value={formData.address?.state || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: formData.address?.street || "",
                              houseNo: formData.address?.houseNo || "",
                              zipCode: formData.address?.zipCode || "",
                              city: formData.address?.city || "",
                              state: e.target.value,
                              country: formData.address?.country || "",
                            },
                          })
                        }
                        placeholder={t(
                          "admin_courses_address_state_placeholder",
                        )}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>

                    {/* Ülke */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("admin_address_country")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address?.country || "Deutschland"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              street: formData.address?.street || "",
                              houseNo: formData.address?.houseNo || "",
                              zipCode: formData.address?.zipCode || "",
                              city: formData.address?.city || "",
                              state: formData.address?.state || "",
                              country: e.target.value,
                            },
                          })
                        }
                        placeholder={t(
                          "admin_courses_address_country_placeholder",
                        )}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                    </div>
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label
                    htmlFor="courseCategory"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {t("admin_courses_category_label")}
                  </label>
                  <input
                    id="courseCategory"
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    placeholder={t("admin_courses_category_placeholder")}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>

                {/* Resim */}
                <div className="bg-gradient-to-br from-kpf-teal/5 to-kpf-teal/5 p-6 rounded-xl border-2 border-dashed border-slate-300">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    📷 {t("admin_courses_image_label")} *
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
                        ✓ {t("admin_uploaded")}
                      </div>
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="mt-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-kpf-teal"></div>
                      <p className="text-sm text-slate-600 mt-2">
                        {t("admin_loading")}
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
                        {t("admin_courses_publish_status_label")}
                      </label>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("admin_courses_publish_status_help")}
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
                          ? t("admin_toggle_on")
                          : t("admin_toggle_off")}
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
                    <span>{submitLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-bold text-lg flex items-center gap-2"
                  >
                    <X size={20} />
                    {cancelLabel}
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
    </div>
  );
};

export default AdminCourses;
