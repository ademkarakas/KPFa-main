import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Play,
  X,
  Share2,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEXTS } from "../constants";
import { Activity, Language } from "../types";
import { activitiesApi } from "../services/api";

interface ActivityDetailProps {
  activityId?: string;
  activity?: Activity;
  lang: Language;
  onBack: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  activityId,
  activity: providedActivity,
  lang,
  onBack,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [activity, setActivity] = useState<Activity | null>(
    providedActivity || null,
  );
  const [loading, setLoading] = useState(!providedActivity);

  // ID ile activity yükle
  useEffect(() => {
    if (activityId && !providedActivity) {
      loadActivity(activityId);
    }
  }, [activityId, providedActivity]);

  const loadActivity = async (id: string) => {
    try {
      setLoading(true);
      const data = await activitiesApi.getAll(false);

      // ID'ye göre activity'i bul
      const foundActivity = data.find((item: any) => item.id === id);

      if (foundActivity) {
        // Backend formatını frontend formatına çevir
        const formatDate = (dateISO: string, lang: "tr" | "de") => {
          try {
            const date = new Date(dateISO);
            if (lang === "tr") {
              return date.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            } else {
              return date.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            }
          } catch {
            return dateISO;
          }
        };

        const formatAddress = (address: any) => {
          if (!address) return "";
          const parts = [];
          if (address.street) parts.push(address.street);
          if (address.houseNo) parts.push(address.houseNo);
          if (address.zipCode) parts.push(address.zipCode);
          if (address.city) parts.push(address.city);
          return parts.join(", ");
        };

        const formattedActivity: Activity = {
          id: foundActivity.id,
          title: {
            tr: foundActivity.titleTr || "",
            de: foundActivity.titleDe || "",
          },
          description: {
            tr: foundActivity.descriptionTr || "",
            de: foundActivity.descriptionDe || "",
          },
          detailedContent: {
            tr:
              foundActivity.detailedContentTr ||
              foundActivity.descriptionTr ||
              "",
            de:
              foundActivity.detailedContentDe ||
              foundActivity.descriptionDe ||
              "",
          },
          date: {
            tr: formatDate(foundActivity.date, "tr"),
            de: formatDate(foundActivity.date, "de"),
          },
          location: formatAddress(foundActivity.address) || "TBD",
          imageUrl:
            foundActivity.imageSource ||
            foundActivity.imageUrl ||
            "/api/placeholder/800/600",
          galleryImages: foundActivity.galleryImages || [],
          videoUrl: foundActivity.videoUrl || "",
          dateISO: foundActivity.date,
          category: foundActivity.category || "social",
        };

        setActivity(formattedActivity);
      }
    } catch (error) {
      console.error("Activity yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard event listener (her zaman çalışmalı)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    globalThis.addEventListener("keydown", handleEsc);
    return () => globalThis.removeEventListener("keydown", handleEsc);
  }, []);

  const t = (key: string) => {
    const value = TEXTS[key]?.[lang];
    return value || key; // Eğer TEXTS'te anahtar yoksa, anahtarı döndür
  };

  // Loading durumunu göster
  if (loading || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kpf-teal mx-auto mb-4"></div>
          <p className="text-slate-600">
            {lang === "tr" ? "Yükleniyor..." : "Wird geladen..."}
          </p>
        </div>
      </div>
    );
  }

  // Etkinlik tarihinin geçip geçmediğini kontrol eden fonksiyon
  const isPastActivity = (dateObj: { tr: string; de: string }): boolean => {
    try {
      // Örnek format: "12.05.2024" -> "2024-05-12" formatına çeviriyoruz
      const parts = dateObj.tr.split(".");
      if (parts.length !== 3) return false;
      const eventDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const today = new Date();
      // Saati sıfırlayarak sadece gün bazlı karşılaştırma yapıyoruz
      today.setHours(0, 0, 0, 0);
      return eventDate < today;
    } catch (e) {
      return false;
    }
  };

  const isPast = isPastActivity(activity.date);

  // Video Yardımcı Fonksiyonları
  const isYouTubeVideo = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8fafc] pb-20"
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 transition-all">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center text-slate-600">
          <button
            onClick={() => {
              globalThis.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                onBack();
              }, 50);
            }}
            className="group flex items-center gap-2 hover:text-kpf-teal transition-all font-semibold"
          >
            <div className="p-2 rounded-full group-hover:bg-kpf-teal/10 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span>{lang === "tr" ? "Geri Dön" : "Zurück"}</span>
          </button>
          <div className="flex gap-2 text-sm font-medium italic opacity-60">
            {activity.title[lang]}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="relative h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 group">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            src={activity.imageUrl}
            alt={activity.title[lang]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-lg ${
                  isPast
                    ? "bg-slate-500 shadow-slate-500/30"
                    : "bg-kpf-teal shadow-kpf-teal/30"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                {activity.category
                  ? t(`activities_filter_${activity.category}`)
                  : lang === "tr"
                    ? "Etkinlik"
                    : "Veranstaltung"}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                {activity.title[lang]}
              </h1>

              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20">
                  <Calendar size={20} className="text-kpf-teal" />
                  <span className="font-medium">{activity.date[lang]}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20">
                  <MapPin size={20} className="text-kpf-teal" />
                  <span className="font-medium">{activity.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Ana İçerik */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-kpf-teal rounded-full" />
                {lang === "tr" ? "Etkinlik Hakkında" : "Über die Veranstaltung"}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {activity.description[lang]}
              </p>
            </section>

            {activity.videoUrl && (
              <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video border-[8px] border-white shadow-slate-200">
                <iframe
                  src={
                    isYouTubeVideo(activity.videoUrl)
                      ? getYouTubeEmbedUrl(activity.videoUrl)
                      : activity.videoUrl
                  }
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Sağ Sidebar - Dinamik Durum Paneli */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {lang === "tr" ? "İşlem Merkezi" : "Aktion"}
              </h3>

              <div className="space-y-4">
                {/* Dinamik Durum Kartı */}
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl border ${
                    isPast
                      ? "bg-slate-50 border-slate-100"
                      : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Clock
                      size={20}
                      className={isPast ? "text-slate-400" : "text-emerald-500"}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      {lang === "tr" ? "Durum" : "Status"}
                    </p>
                    <p
                      className={`font-semibold ${
                        isPast ? "text-slate-600" : "text-emerald-700"
                      }`}
                    >
                      {isPast
                        ? lang === "tr"
                          ? "Tamamlandı"
                          : "Abgeschlossen"
                        : lang === "tr"
                          ? "Gelecek Etkinlik"
                          : "Bevorstehend"}
                    </p>
                  </div>
                </div>

                {/* Dinamik Buton veya Mesaj */}
                {!isPast ? (
                  <button
                    onClick={() => {
                      // Google Calendar'a ekle
                      const activityTitle = activity.title[lang];
                      const dateISO = activity.dateISO;
                      // ISO formatını YYYYMMDD'ye çevir
                      const dateOnly = dateISO
                        .split("T")[0]
                        .replaceAll(/-/g, "");
                      const startTime = `${dateOnly}T100000Z`;
                      const endTime = `${dateOnly}T120000Z`;
                      const activityDescription = activity.description[lang];
                      const activityLocation = activity.location;

                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        activityTitle,
                      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
                        activityDescription,
                      )}&location=${encodeURIComponent(
                        activityLocation,
                      )}&sf=true&output=xml`;

                      window.open(googleCalendarUrl, "_blank");
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-kpf-teal hover:bg-kpf-teal/90 text-white py-4 px-6 rounded-2xl font-bold transition-all shadow-xl shadow-kpf-teal/20 group"
                  >
                    <CalendarPlus
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {lang === "tr" ? "Takvime Ekle" : "In den Kalender"}
                  </button>
                ) : (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <CheckCircle2
                      size={24}
                      className="mx-auto text-slate-300 mb-2"
                    />
                    <p className="text-sm text-slate-500 font-medium">
                      {lang === "tr"
                        ? "Bu etkinlik sona erdi. İlginiz için teşekkür ederiz."
                        : "Diese Veranstaltung ist beendet. Vielen Dank für Ihr Interesse."}
                    </p>
                  </div>
                )}

                <button
                  onClick={async () => {
                    // Web Share API kullan veya clipboard'a kopyala
                    const shareData = {
                      title: activity.title[lang],
                      text: activity.description[lang],
                      url: globalThis.location.href,
                    };

                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                      } catch (err) {
                        console.log("Share cancelled");
                      }
                    } else {
                      // Fallback: URL'yi clipboard'a kopyala
                      try {
                        await navigator.clipboard.writeText(
                          globalThis.location.href,
                        );
                        alert(
                          lang === "tr"
                            ? "Etkinlik linki kopyalandı!"
                            : "Veranstaltungslink kopiert!",
                        );
                      } catch (err) {
                        console.error("Clipboard copy failed:", err);
                      }
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-kpf-teal transition-colors pt-2 font-medium"
                >
                  <Share2 size={18} />
                  {lang === "tr" ? "Paylaş" : "Teilen"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fotoğraf Galerisi */}
        {activity.galleryImages && activity.galleryImages.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-kpf-teal/10 rounded-2xl">
                  <ImageIcon size={28} className="text-kpf-teal" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {lang === "tr" ? "Etkinlik Galerisi" : "Fotogalerie"}
                </h2>
              </div>
              <span className="text-slate-400 font-medium">
                {activity.galleryImages.length}{" "}
                {lang === "tr" ? "Fotoğraf" : "Fotos"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {activity.galleryImages.map((image, index) => {
                const imageSrc = image.url
                  ? image.url
                  : image.base64Data
                    ? `data:image/jpeg;base64,${image.base64Data}`
                    : null;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -8 }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer group shadow-md"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {imageSrc && (
                      <>
                        <img
                          src={imageSrc}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt="Gallery item"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                            <Play size={24} className="text-white fill-white" />
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Modern Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && activity.galleryImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-6 backdrop-blur-sm"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={40} />
            </button>

            <div
              className="relative w-full max-w-5xl h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -left-4 md:-left-12 p-4 text-white hover:text-kpf-teal transition-colors"
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex > 0
                      ? selectedImageIndex - 1
                      : activity.galleryImages!.length - 1,
                  )
                }
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>

              {selectedImageIndex !== null &&
                activity.galleryImages[selectedImageIndex] && (
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={(() => {
                      const image = activity.galleryImages[selectedImageIndex];
                      return image.url
                        ? image.url
                        : image.base64Data
                          ? `data:image/jpeg;base64,${image.base64Data}`
                          : "";
                    })()}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  />
                )}

              <button
                className="absolute -right-4 md:-right-12 p-4 text-white hover:text-kpf-teal transition-colors"
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex < activity.galleryImages!.length - 1
                      ? selectedImageIndex + 1
                      : 0,
                  )
                }
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 font-medium">
              {selectedImageIndex + 1} / {activity.galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivityDetail;
