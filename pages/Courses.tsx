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
  ChevronRight,
  Palette,
  Users,
  Coffee,
  Globe,
  Mic,
  Camera,
  Utensils,
  Smile,
  Lightbulb,
  PenTool,
  Scroll,
} from "lucide-react";
import { Language, PageView, Course } from "../types";
import { TEXTS } from "../constants";
import { coursesApi } from "../services/api";
import { isRequestCancelled } from "../hooks/useCancelableRequest";

interface CoursesProps {
  lang: Language;
  setPage?: (page: PageView) => void;
  currentPage?: PageView;
}

const Courses: React.FC<CoursesProps> = ({ lang, setPage, currentPage }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: string) => TEXTS[key][lang];

  useEffect(() => {
    const abortController = new AbortController();
    loadCourses(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  // Sayfadan çıkıldığında detay modalını kapat
  useEffect(() => {
    if (currentPage !== "courses") {
      setSelectedCourse(null);
    }
  }, [currentPage]);

  const loadCourses = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll(false, signal);

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

      const formatAddress = (courseLocation: any) => {
        if (!courseLocation) return "";
        if (typeof courseLocation === "string") return courseLocation;

        const parts = [];
        // Support both camelCase and PascalCase
        const street = courseLocation.street || courseLocation.Street;
        const houseNo = courseLocation.houseNo || courseLocation.HouseNo;
        const zipCode = courseLocation.zipCode || courseLocation.ZipCode;
        const city = courseLocation.city || courseLocation.City;

        if (street) parts.push(street);
        if (houseNo) parts.push(houseNo);
        if (zipCode || city) {
          parts.push(`${zipCode || ""} ${city || ""}`.trim());
        }

        return parts.join(", ");
      };

      const formattedCourses: Course[] = data
        .filter((item: any) => item.isActive !== false)
        .map((item: any) => ({
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
          schedule: { tr: item.scheduleTr || "", de: item.scheduleDe || "" },
          instructor: item.instructor || "",
          date: item.date ? formatDate(item.date) : "",
          dateISO: item.date || "",
          address: formatAddress(item.courseLocation || item.address),
          duration: item.duration || "",
          capacity: item.capacity || 0,
          price: item.price || 0,
          imageUrl: item.imageUrl || "",
        }));

      setCourses(formattedCourses);
    } catch (error) {
      if (!isRequestCancelled(error)) {
        console.error("❌ Veri hatası:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const props = { size: 30 };
    switch (iconName) {
      case "MessageCircle":
        return <MessageCircle {...props} />;
      case "Languages":
        return <Languages {...props} />;
      case "Music":
        return <Music {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "Heart":
        return <Heart {...props} />;
      case "Palette":
        return <Palette {...props} />;
      case "Users":
        return <Users {...props} />;
      case "Coffee":
        return <Coffee {...props} />;
      case "Globe":
        return <Globe {...props} />;
      case "Mic":
        return <Mic {...props} />;
      case "Camera":
        return <Camera {...props} />;
      case "Utensils":
        return <Utensils {...props} />;
      case "Smile":
        return <Smile {...props} />;
      case "Lightbulb":
        return <Lightbulb {...props} />;
      case "PenTool":
        return <PenTool {...props} />;
      case "Scroll":
        return <Scroll {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  const handleContactClick = () => {
    if (setPage) setPage("contact");
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-kpf-teal rounded-full animate-spin"></div>
          <div className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-xs">
            {lang === "tr" ? "Yükleniyor" : "Laden"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Başlık Alanı */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-kpf-teal font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            {lang === "tr" ? "Eğitim Programlarımız" : "Bildungsprogramme"}
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
            {t("courses_title")}
          </h1>
          <div className="w-20 h-1 bg-kpf-teal mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            {t("courses_desc")}
          </p>
        </div>

        {/* Bento Grid Stilinde Kurslar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.15)] transition-all duration-500 hover:-translate-y-2 border border-slate-100 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 group-hover:bg-kpf-teal transition-colors duration-500"></div>

              <div className="flex justify-between items-start mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                    index % 2 === 0
                      ? "bg-kpf-teal shadow-teal-100"
                      : "bg-slate-800 shadow-slate-200"
                  }`}
                >
                  {getIcon(course.icon)}
                </div>
                <div className="bg-slate-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight size={20} className="text-kpf-teal" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-kpf-teal transition-colors duration-300">
                {course.title[lang]}
              </h3>

              <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed text-[15px]">
                {course.description[lang]}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                {course.schedule && (
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Clock size={16} className="text-kpf-teal" />
                    <span>
                      {typeof course.schedule === "object"
                        ? course.schedule[lang]
                        : course.schedule}
                    </span>
                  </div>
                )}
                <span className="text-xs font-black uppercase tracking-widest text-kpf-teal">
                  {lang === "tr" ? "İncele" : "Details"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modern CTA */}
        <div className="mt-24 text-center relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-kpf-teal/5 rounded-[3rem] -rotate-1 scale-105"></div>
          <div className="relative bg-white p-12 lg:p-16 rounded-[3rem] border border-kpf-teal/10 shadow-sm">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              {t("course_cta")}
            </h3>
            <p className="text-slate-600 mb-10 text-lg max-w-2xl mx-auto">
              {t("course_cta_desc")}
            </p>
            <button
              onClick={() => setPage && setPage("contact")}
              className="group inline-flex items-center gap-3 bg-kpf-teal text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-teal-100"
            >
              {lang === "tr" ? "İletişime Geç" : "Kontakt aufnehmen"}
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setSelectedCourse(null)}
          ></div>
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCourse(null)}
              className="sticky top-0 right-0 float-right bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all backdrop-blur-xl z-20 border border-white/30 m-4"
            >
              <X size={24} />
            </button>

            <div className="bg-gradient-to-br from-kpf-teal to-teal-700 px-6 sm:px-10 py-8 sm:py-12 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-[1.5rem] flex items-center justify-center bg-white/20 text-white shadow-2xl border border-white/30 backdrop-blur-md flex-shrink-0">
                  {getIcon(selectedCourse.icon)}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
                    {selectedCourse.title[lang]}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-teal-50">
                    <div className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-widest">
                      {lang === "tr" ? "Kurs Detayları" : "Kurs-Info"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 bg-white">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                {selectedCourse.details
                  ? selectedCourse.details[lang]
                  : selectedCourse.description[lang]}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: <Clock className="text-kpf-teal" />,
                    label: lang === "tr" ? "Zaman" : "Zeit",
                    value:
                      typeof selectedCourse.schedule === "object"
                        ? selectedCourse.schedule[lang]
                        : selectedCourse.schedule,
                    show: !!selectedCourse.schedule,
                  },
                  {
                    icon: <Calendar className="text-teal-600" />,
                    label: lang === "tr" ? "Başlangıç" : "Start",
                    value: selectedCourse.date,
                    show: !!selectedCourse.date,
                  },
                  {
                    icon: <User className="text-teal-600" />,
                    label: lang === "tr" ? "Eğitmen" : "Leiter",
                    value: selectedCourse.instructor,
                    show: !!selectedCourse.instructor,
                  },
                  {
                    icon: <MapPin className="text-teal-600" />,
                    label: lang === "tr" ? "Yer" : "Ort",
                    value: selectedCourse.address,
                    show: !!selectedCourse.address,
                    clickable: true,
                    onClick: () => {
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCourse.address || "")}`;
                      window.open(mapsUrl, "_blank");
                    },
                  },
                ].map(
                  (item, i) =>
                    item.show && (
                      <div
                        key={`${selectedCourse.id}-detail-${i}`}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 transition-all duration-300 ${
                          item.clickable
                            ? "cursor-pointer hover:bg-teal-50 hover:border-teal-200 hover:shadow-md hover:-translate-y-0.5"
                            : "hover:bg-teal-50/50"
                        }`}
                        onClick={item.clickable ? item.onClick : undefined}
                        onKeyDown={
                          item.clickable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  item.onClick?.();
                              }
                            : undefined
                        }
                        role={item.clickable ? "button" : undefined}
                        tabIndex={item.clickable ? 0 : undefined}
                      >
                        <div className="w-10 h-10 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-slate-800 font-bold text-xs sm:text-sm truncate sm:break-normal">
                            {item.value}
                          </p>
                        </div>
                        {item.clickable && (
                          <ChevronRight className="text-teal-500 w-5 h-5 flex-shrink-0" />
                        )}
                      </div>
                    ),
                )}
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6">
                {selectedCourse.dateISO && (
                  <button
                    onClick={() => {
                      const dateOnly = (selectedCourse.dateISO || "")
                        .split("T")[0]
                        .replaceAll("-", "");
                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        selectedCourse.title[lang],
                      )}&dates=${dateOnly}T100000Z/${dateOnly}T120000Z&details=${encodeURIComponent(
                        selectedCourse.description[lang],
                      )}&location=${encodeURIComponent(
                        selectedCourse.address || "",
                      )}&sf=true&output=xml`;
                      window.open(googleCalendarUrl, "_blank");
                    }}
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-all font-bold flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Calendar size={18} />
                    {lang === "tr" ? "Takvime Ekle" : "Kalender"}
                  </button>
                )}
                <button
                  onClick={handleContactClick}
                  className={`w-full px-6 sm:px-8 py-3 sm:py-4 bg-kpf-teal text-white rounded-xl sm:rounded-2xl hover:bg-slate-900 transition-all font-bold flex items-center justify-center gap-3 shadow-xl shadow-teal-100 text-sm sm:text-base ${
                    !selectedCourse.date ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!selectedCourse.date}
                >
                  {lang === "tr" ? "Kayıt Ol" : "Anmelden"}
                  <ArrowRight size={20} />
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
