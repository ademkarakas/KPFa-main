import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Languages,
  Music,
  BookOpen,
  Heart,
  Clock,
  X,
  ArrowRight,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import { Language, PageView, Course } from "../types";
import { TEXTS, COURSES_DATA } from "../constants";
import { coursesApi } from "../services/api";

interface CoursesProps {
  lang: Language;
  setPage?: (page: PageView) => void;
}

const Courses: React.FC<CoursesProps> = ({ lang, setPage }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: string) => TEXTS[key][lang];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll(false); // Sadece aktif olanlar

      if (!data || data.length === 0) {
        console.warn("API'den boş veri döndü, mock data kullanılıyor");
        setCourses(COURSES_DATA);
        return;
      }

      // Tarih formatı (ISO formatını Türkçe ve Almanca'ya çevir)
      const formatDate = (dateISO: string) => {
        try {
          const date = new Date(dateISO);
          return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        } catch {
          return dateISO;
        }
      };

      // Backend'den gelen verileri frontend formatına çevir
      const formattedCourses: Course[] = data.map((item: any) => ({
        id: item.id,
        icon: item.icon || "BookOpen",
        title: { tr: item.titleTr || "", de: item.titleDe || "" },
        description: {
          tr: item.descriptionTr || "",
          de: item.descriptionDe || "",
        },
        details: {
          tr: item.detailsTr || item.descriptionTr || "",
          de: item.detailsDe || item.descriptionDe || "",
        },
        schedule: {
          tr: item.scheduleTr || "",
          de: item.scheduleDe || "",
        },
        instructor: item.instructor || "",
        date: item.date ? formatDate(item.date) : "",
        dateISO: item.date || "",
        address: item.courseLocation || "",
        duration: item.duration || "",
        capacity: item.capacity || 0,
        price: item.price || 0,
        imageUrl: item.imageUrl || "",
      }));

      setCourses(formattedCourses);
      console.log(`✅ ${formattedCourses.length} kurs başarıyla yüklendi`);
    } catch (error) {
      console.error("❌ Kurslar yüklenemedi, mock data kullanılıyor:", error);
      setCourses(COURSES_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Helper to map string icon names to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "MessageCircle":
        return <MessageCircle size={32} />;
      case "Languages":
        return <Languages size={32} />;
      case "Music":
        return <Music size={32} />;
      case "BookOpen":
        return <BookOpen size={32} />;
      case "Heart":
        return <Heart size={32} />;
      default:
        return <BookOpen size={32} />;
    }
  };

  const handleContactClick = () => {
    if (setPage) {
      setPage("contact");
    } else {
      console.warn("setPage prop is missing in Courses component");
    }
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red mx-auto mb-4"></div>
          <p className="text-slate-600">
            {lang === "tr"
              ? "Kurslar yükleniyor..."
              : "Kurse werden geladen..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-kpf-dark mb-4">
            {t("courses_title")}
          </h1>
          <div className="w-24 h-1.5 bg-kpf-red mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-slate-600">{t("courses_desc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 group relative overflow-hidden cursor-pointer"
            >
              {/* Decorative Background */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-bl-full transition-transform group-hover:scale-150 ${
                  index % 2 === 0
                    ? "from-kpf-red to-orange-500"
                    : "from-kpf-teal to-blue-500"
                }`}
              ></div>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:rotate-6 transition-transform ${
                  index % 2 === 0 ? "bg-kpf-red" : "bg-kpf-teal"
                }`}
              >
                {getIcon(course.icon)}
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-kpf-teal transition-colors">
                {course.title[lang]}
              </h3>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {course.description[lang]}
              </p>

              {course.schedule && (
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-lg inline-block">
                  <Clock size={16} className="text-kpf-teal" />
                  {typeof course.schedule === "object"
                    ? course.schedule[lang]
                    : course.schedule}
                </div>
              )}

              <div className="mt-4 flex items-center text-kpf-teal font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                {lang === "tr" ? "Detaylar" : "Details"}{" "}
                <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA for Courses */}
        <div className="mt-20 text-center bg-white p-10 rounded-3xl border border-slate-200 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-2xl font-bold text-kpf-dark mb-4">
            {t("course_cta")}
          </h3>
          <p className="text-slate-600 mb-8">{t("course_cta_desc")}</p>
          <button
            onClick={() => setPage && setPage("contact")}
            className="inline-block bg-kpf-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            {lang === "tr" ? "İletişime Geç" : "Kontakt aufnehmen"}
          </button>
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedCourse(null)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 bg-white/50 hover:bg-white text-slate-800 p-2 rounded-full transition-all backdrop-blur-md z-20"
            >
              <X size={24} />
            </button>

            {/* Header with gradient background */}
            <div className="bg-gradient-to-br from-kpf-teal to-teal-600 px-8 py-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20 text-white shadow-lg">
                  {getIcon(selectedCourse.icon)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedCourse.title[lang]}
                  </h3>
                  <p className="text-white/90">
                    {lang === "tr" ? "Kurs Detayları" : "Kursdetails"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Description */}
              <div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {selectedCourse.details
                    ? selectedCourse.details[lang]
                    : selectedCourse.description[lang]}
                </p>
              </div>

              {/* Schedule & Date Combined */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCourse.schedule && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Clock className="text-kpf-teal flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {lang === "tr" ? "Zaman" : "Zeit"}
                      </p>
                      <p className="text-slate-800 font-semibold">
                        {typeof selectedCourse.schedule === "object"
                          ? selectedCourse.schedule[lang]
                          : selectedCourse.schedule}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCourse.date && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Calendar
                      className="text-kpf-red flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {lang === "tr" ? "Başlangıç" : "Start"}
                      </p>
                      <p className="text-slate-800 font-semibold">
                        {selectedCourse.date}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor & Address Combined */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCourse.instructor && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <User className="text-kpf-red flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {lang === "tr" ? "Eğitmeni" : "Leiter"}
                      </p>
                      <p className="text-slate-800 font-semibold">
                        {selectedCourse.instructor}
                      </p>
                    </div>
                  </div>
                )}

                {selectedCourse.address && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <MapPin className="text-kpf-red flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {lang === "tr" ? "Yer" : "Ort"}
                      </p>
                      <p className="text-slate-800 font-semibold text-sm">
                        {selectedCourse.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                {selectedCourse.dateISO && (
                  <button
                    onClick={() => {
                      // Add to Google Calendar
                      const courseTitle = selectedCourse.title[lang];
                      const dateISO = selectedCourse.dateISO;
                      // ISO formatını YYYYMMDD'ye çevir
                      const dateOnly = dateISO.split("T")[0].replace(/-/g, "");
                      const startTime = `${dateOnly}T100000Z`;
                      const endTime = `${dateOnly}T120000Z`;
                      const courseDescription = selectedCourse.details
                        ? selectedCourse.details[lang]
                        : selectedCourse.description[lang];
                      const courseAddress = selectedCourse.address || "";

                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        courseTitle
                      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
                        courseDescription
                      )}&location=${encodeURIComponent(
                        courseAddress
                      )}&sf=true&output=xml`;

                      window.open(googleCalendarUrl, "_blank");
                    }}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    {lang === "tr" ? "Takvime Ekle" : "Kalender"}
                  </button>
                )}
                <button
                  onClick={handleContactClick}
                  className={`flex-1 px-4 py-3 bg-kpf-dark text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold flex items-center justify-center gap-2 ${
                    !selectedCourse.date ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!selectedCourse.date}
                >
                  {lang === "tr" ? "Kayıt Ol" : "Anmelden"}{" "}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
