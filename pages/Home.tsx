import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Users,
  Heart,
  Sparkles,
  MapPin,
  X,
  Instagram,
  ChevronRight,
} from "lucide-react";
import { Language, PageView, Activity } from "../types";
import { TEXTS, MOCK_ACTIVITIES } from "../constants";
import ActivityDetail from "./ActivityDetail";

interface HomeFeature {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  color: string;
}

interface HomeCTA {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  primaryButtonTr: string;
  primaryButtonDe: string;
  secondaryButtonTr: string;
  secondaryButtonDe: string;
  donateButtonTr: string;
  donateButtonDe: string;
}

interface HomeData {
  activities: Activity[];
  features: HomeFeature[];
  cta: HomeCTA;
  instagramFeed: any[];
}

interface HomeProps {
  lang: Language;
  setPage: (page: PageView) => void;
}

// Mock data
const MOCK_HOME_DATA: HomeData = {
  activities: [],
  features: [
    {
      id: "1",
      titleTr: "Biz Kimiz",
      titleDe: "Über Uns",
      descriptionTr:
        "Freiburg'un çok sesli kültür yapısını birleştiren bir köprüyüz.",
      descriptionDe:
        "Wir sind die Brücke, die Freiburgs vielfältige Kulturlandschaft verbindet.",
      color: "#FF6B35",
    },
    {
      id: "2",
      titleTr: "Değerlerimiz",
      titleDe: "Unsere Werte",
      descriptionTr:
        "Kapsayıcılık ve çeşitlilik üzerine kurulu bir gelecek inşa ediyoruz.",
      descriptionDe:
        "Wir bauen eine Zukunft, die auf Inklusion und Vielfalt basiert.",
      color: "#FFCC00",
    },
    {
      id: "3",
      titleTr: "Topluluk",
      titleDe: "Gemeinschaft",
      descriptionTr:
        "Birlikte öğreniyor, üretiyor ve Freiburg'u güzelleştiriyoruz.",
      descriptionDe: "Gemeinsam lernen, gestalten und bereichern wir Freiburg.",
      color: "#00CCFF",
    },
  ],
  cta: {
    id: "1",
    titleTr: "Birlikte Daha Güçlüyüz",
    titleDe: "Zusammen sind wir stärker",
    descriptionTr:
      "Kültürplattform Freiburg'un misyonu, kültürel değerleri yaşatmak ve toplumlar arası köprüler kurmak.",
    descriptionDe:
      "Die Mission der Kulturplattform Freiburg ist es, kulturelle Werte lebendig zu halten und Brücken zwischen Gesellschaften zu bauen.",
    primaryButtonTr: "Etkinlikleri İncele",
    primaryButtonDe: "Veranstaltungen ansehen",
    secondaryButtonTr: "İletişime Geç",
    secondaryButtonDe: "Kontakt aufnehmen",
    donateButtonTr: "Gönüllü Ol",
    donateButtonDe: "Freiwilliger werden",
  },
  instagramFeed: [],
};

const Home: React.FC<HomeProps> = ({ lang, setPage }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [showDetailPage, setShowDetailPage] = useState<boolean>(false);
  const [homeData, setHomeData] = useState<HomeData>(MOCK_HOME_DATA);
  const [loading, setLoading] = useState(true);
  const t = (key: string) => TEXTS[key][lang];

  // Backend'den Home verilerini yükle
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://localhost:7189/api/Home");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: HomeData = await response.json();

        if (!data || Object.keys(data).length === 0) {
          console.warn("API'den boş veri döndü, mock data kullanılıyor");
          setHomeData(MOCK_HOME_DATA);
          return;
        }

        // Tarih formatı (ISO formatını Türkçe ve Almanca'ya çevir)
        const formatDate = (dateISO: string, langCode: "tr" | "de") => {
          try {
            const date = new Date(dateISO);
            if (langCode === "tr") {
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

        // Adres formatı (address object'ini string'e çevir)
        const formatAddress = (address: any) => {
          if (!address) return "";
          const parts = [];
          if (address.street) parts.push(address.street);
          if (address.houseNo) parts.push(address.houseNo);
          if (address.zipCode) parts.push(address.zipCode);
          if (address.city) parts.push(address.city);
          return parts.join(", ");
        };

        // Backend'den gelen activities'i frontend formatına çevir
        const formattedActivities: Activity[] = (data.activities || []).map(
          (item: any) => ({
            id: item.id,
            title: { tr: item.titleTr || "", de: item.titleDe || "" },
            description: {
              tr: item.descriptionTr || "",
              de: item.descriptionDe || "",
            },
            detailedContent: {
              tr: item.detailedContentTr || item.descriptionTr || "",
              de: item.detailedContentDe || item.descriptionDe || "",
            },
            date: {
              tr: formatDate(item.date, "tr"),
              de: formatDate(item.date, "de"),
            },
            dateISO: item.date || "",
            location: formatAddress(item.address),
            imageUrl: item.imageUrl || "",
            category: item.category || "Etkinlik",
            videoUrl: item.videoUrl || "",
            galleryImages: item.galleryImages || [],
          })
        );

        // Activities boşsa MOCK_ACTIVITIES'i kullan
        const homeDataWithFallback: HomeData = {
          ...data,
          activities:
            formattedActivities.length > 0
              ? formattedActivities
              : MOCK_ACTIVITIES.slice(0, 3),
          features: data.features || MOCK_HOME_DATA.features,
          cta: data.cta || MOCK_HOME_DATA.cta,
        };

        setHomeData(homeDataWithFallback);
        console.log("✅ Home verisi başarıyla yüklendi");
      } catch (error) {
        console.error(
          "❌ Home verisi yüklenemedi, mock data kullanılıyor:",
          error
        );
        setHomeData(MOCK_HOME_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Detail page gösteriliyorsa ActivityDetail bileşenini döndür
  if (showDetailPage && selectedActivity) {
    return (
      <ActivityDetail
        activity={selectedActivity}
        lang={lang}
        onBack={() => {
          setShowDetailPage(false);
          setSelectedActivity(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col bg-slate-50">
      {/* --- Hero Section --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
            alt="Culture Hero"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative text-white ">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-300 text-sm font-medium mb-6 animate-fade-in-down">
              <Sparkles size={14} />
              <span>
                {lang === "tr"
                  ? "Freiburg Kültür Platformu"
                  : "Kulturplattform Freiburg"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-[1.1] animate-fade-in-up">
              {t("hero_title")}
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl animate-fade-in-up delay-100">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <button
                onClick={() => setPage("activities")}
                className="bg-kpf-teal hover:bg-kpf-teal text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-red-900/20"
              >
                {t("hero_cta_primary")}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => setPage("volunteer")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-bold transition-all"
              >
                {t("hero_cta_secondary")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Feature Pillars (Modernized) --- */}
      <section className="relative -mt-20 z-20 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeData.features.map((feature, index) => {
              // Her feature için ilgili section ID'sini belirle
              const sectionIds = ["core-values", "who-we-are", "focus-areas"];
              const sectionId = sectionIds[index];

              return (
                <div
                  key={feature.id}
                  onClick={() => {
                    // Section ID'yi sessionStorage'a kaydet, About sayfası bunu okuyup scroll edecek
                    sessionStorage.setItem("scrollToSection", sectionId);
                    setPage("about");
                  }}
                  className="group bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-slate-100"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Sparkles size={32} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {lang === "tr" ? feature.titleTr : feature.titleDe}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {lang === "tr"
                      ? feature.descriptionTr
                      : feature.descriptionDe}
                  </p>
                  <div className="flex items-center text-slate-400 font-bold text-sm group-hover:text-slate-900 transition-colors">
                    {lang === "tr" ? "Keşfet" : "Entdecken"}{" "}
                    <ChevronRight
                      size={18}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Güncel Faaliyetler / Aktuelles --- */}
      <section className="py-24 bg-slate-100 relative overflow-hidden">
        {/* Dekoratif Arkaplan Elemanı */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                {lang === "tr" ? "Güncel Faaliyetler" : "Aktuelles"}
              </h2>
              <p className="text-lg text-slate-600">
                {lang === "tr"
                  ? "Kültür Platformu'ndan en son haberler, etkinlikler ve duyurular."
                  : "Aktuelle Nachrichten, Veranstaltungen und Ankündigungen der Kulturplattform."}
              </p>
            </div>
            <button
              onClick={() => setPage("activities")}
              className="inline-flex items-center gap-2 font-bold text-kpf-dark hover:text-kpf-teal transition-colors border-b-2 border-kpf-red/20 pb-1"
            >
              {lang === "tr" ? "Tümünü Gör" : "Alle ansehen"}
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {homeData.activities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => {
                  setSelectedActivity(activity);
                  setShowDetailPage(true);
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={activity.imageUrl}
                    alt={activity.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-lg">
                      {activity.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-kpf-teal text-sm font-bold mb-3">
                    <Calendar size={16} />
                    {activity.date[lang]}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-kpf-teal transition-colors line-clamp-2">
                    {activity.title[lang]}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {activity.description[lang]}
                  </p>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                      <MapPin size={14} /> {activity.location.split(",")[0]}
                    </span>
                    <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-kpf-teal group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section (Card Style) */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div
            className="relative rounded-[2.5rem] overflow-hidden 
      bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white 
      shadow-xl hover:shadow-2xl transition-shadow duration-500"
            style={{
              background:
                "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
            }}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>

            <div className="relative z-10 px-8 py-16 md:px-20 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Instagram size={36} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
                  {t("home_follow_instagram")}
                </h2>
              </div>

              <p className="text-white/95 text-lg mb-10 max-w-xl mx-auto font-medium">
                {t("home_follow_desc")}
              </p>

              <div className="flex justify-center gap-6 flex-wrap mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="group w-36 h-36 rounded-2xl bg-white/15 backdrop-blur-md 
                border-2 border-white/30 hover:border-white/60 hover:scale-105 
                transition-all duration-400 overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <img
                      src={`https://picsum.photos/150/150?random=${i + 50}`}
                      alt="Instagram"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#d62976] px-12 py-4 
            rounded-full font-bold hover:bg-slate-50 hover:scale-105 transition-all 
            duration-300 shadow-xl hover:shadow-2xl"
              >
                <Instagram size={20} />
                @kulturplattformfreiburg
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section (Clean & Impactful) --- */}
      <section className="py-24 bg-white">
        {" "}
        {/* Beyaz arka plan ile temiz bir geçiş */}
        <div className="container mx-auto px-4">
          <div
            className="relative rounded-[3.5rem] p-12 md:p-28 text-center overflow-hidden
      bg-gradient-to-br from-kpf-teal to-kpf-teal shadow-[0_30px_60px_-15px_rgba(159,18,57,0.4)]"
          >
            {/* Soyut Arka Plan Deseni */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-10 leading-tight">
                {lang === "tr" ? homeData.cta.titleTr : homeData.cta.titleDe}
              </h2>

              <p className="text-xl md:text-2xl text-slate-200 mb-16 leading-relaxed font-light">
                {lang === "tr"
                  ? homeData.cta.descriptionTr
                  : homeData.cta.descriptionDe}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => setPage("activities")}
                  className="bg-white text-teal-900 px-12 py-5 rounded-2xl font-extrabold hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-white/20 active:scale-95"
                >
                  <ArrowRight size={24} />
                  {lang === "tr"
                    ? homeData.cta.primaryButtonTr
                    : homeData.cta.primaryButtonDe}
                </button>

                <button
                  onClick={() => setPage("contact")}
                  className="bg-white/5 text-teal border-2 border-white/20 backdrop-blur-sm px-12 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all duration-300 active:scale-95"
                >
                  {lang === "tr"
                    ? homeData.cta.secondaryButtonTr
                    : homeData.cta.secondaryButtonDe}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
