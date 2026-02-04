import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  MapPin,
  Instagram,
  ChevronRight,
} from "lucide-react";
import { Language, PageView, Activity } from "../types";
import { TEXTS } from "../constants";
import { activitiesApi } from "../services/api";

interface HomeHero {
  id: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  subtitleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  backgroundImageUrl: string;
  backgroundImageBase64?: string;
  backgroundImageFileName?: string;
  primaryButtonTextTr: string;
  primaryButtonTextDe: string;
  secondaryButtonTextTr: string;
  secondaryButtonTextDe: string;
}

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
  hero: HomeHero;
  cta: HomeCTA;
  instagramFeed: any[];
}

interface HomeProps {
  lang: Language;
  setPage: (page: PageView) => void;
}

// Initial empty state
const INITIAL_HOME_DATA: HomeData = {
  activities: [],
  hero: {
    id: "",
    titleTr: "",
    titleDe: "",
    subtitleTr: "",
    subtitleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    backgroundImageUrl: "",
    backgroundImageBase64: "",
    backgroundImageFileName: "",
    primaryButtonTextTr: "",
    primaryButtonTextDe: "",
    secondaryButtonTextTr: "",
    secondaryButtonTextDe: "",
  },
  features: [],
  cta: {
    id: "",
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    primaryButtonTr: "",
    primaryButtonDe: "",
    secondaryButtonTr: "",
    secondaryButtonDe: "",
    donateButtonTr: "",
    donateButtonDe: "",
  },
  instagramFeed: [],
};

const Home: React.FC<HomeProps> = ({ lang, setPage }) => {
  const [homeData, setHomeData] = useState<HomeData>(INITIAL_HOME_DATA);
  const t = (key: string) => TEXTS[key][lang];

  // Backend'den Home verilerini yükle
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Ana Home verilerini, Hero verisini ve Aktiviteleri paralel olarak çek
        const [homeResponse, heroResponse, activitiesData] = await Promise.all([
          fetch("https://localhost:7189/api/Home", { cache: "no-store" }),
          fetch("https://localhost:7189/api/Home/hero", { cache: "no-store" }),
          activitiesApi.getAll(false), // Sadece aktif aktiviteler
        ]);

        const data = homeResponse.ok ? await homeResponse.json() : {};
        const heroApiData = heroResponse.ok ? await heroResponse.json() : null;

        if (!data || Object.keys(data).length === 0) {
          console.warn("API'den boş veri döndü");
          setHomeData(INITIAL_HOME_DATA);
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

        // HTML taglarını temizle (p, br vs.)
        const stripHtml = (html: string): string => {
          if (!html) return "";
          return html.replaceAll(/<[^>]*>/g, "").trim();
        };

        // Backend'den gelen activities'i frontend formatına çevir
        const formattedActivities: Activity[] = (activitiesData || []).map(
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
            imageUrl: item.imageSource || item.imageUrl || "",
            category: item.category || "Etkinlik",
            videoUrl: item.videoUrl || "",
            galleryImages: item.galleryImages || [],
          }),
        );

        // Hero verisini parse et - önce /api/Home/hero endpoint'inden gelen veriyi kullan, yoksa data.hero kullan
        const heroSource = heroApiData || data.hero;
        const heroData: HomeHero = {
          id: heroSource?.id || "",
          titleTr: heroSource?.titleTr || "",
          titleDe: heroSource?.titleDe || "",
          subtitleTr: heroSource?.subtitleTr || "",
          subtitleDe: heroSource?.subtitleDe || "",
          descriptionTr: heroSource?.descriptionTr || "",
          descriptionDe: heroSource?.descriptionDe || "",
          backgroundImageUrl:
            heroSource?.backgroundImageUrl ||
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
          backgroundImageBase64: "",
          backgroundImageFileName: "",
          primaryButtonTextTr: heroSource?.primaryButtonTextTr || "",
          primaryButtonTextDe: heroSource?.primaryButtonTextDe || "",
          secondaryButtonTextTr: heroSource?.secondaryButtonTextTr || "",
          secondaryButtonTextDe: heroSource?.secondaryButtonTextDe || "",
        };

        // Features verisini parse et - HTML taglarını temizle
        const featuresData: HomeFeature[] = (data.features || []).map(
          (f: any) => ({
            id: f.id || "",
            titleTr: stripHtml(f.titleTr || ""),
            titleDe: stripHtml(f.titleDe || ""),
            descriptionTr: stripHtml(f.descriptionTr || ""),
            descriptionDe: stripHtml(f.descriptionDe || ""),
            color: f.color || "#FF6B35",
          }),
        );

        // Backend'den gelen verileri kullan
        const homeDataWithFallback: HomeData = {
          ...data,
          activities: formattedActivities,
          hero: heroData,
          features: featuresData,
          cta: data.cta || null,
        };

        setHomeData(homeDataWithFallback);
        console.log("✅ Home verisi başarıyla yüklendi");
      } catch (error) {
        console.error("❌ Home verisi yüklenemedi:", error);
        // Hata durumunda boş veri bırak, mock data kullanma
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col bg-slate-50">
      {/* --- Hero Section --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${homeData.hero.backgroundImageUrl}?t=${Date.now()}`}
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
              {lang === "tr" ? homeData.hero.titleTr : homeData.hero.titleDe}
            </h1>
            <p
              className="text-xl text-slate-300 mb-4 leading-relaxed max-w-xl animate-fade-in-up delay-100"
              dangerouslySetInnerHTML={{
                __html:
                  lang === "tr"
                    ? homeData.hero.subtitleTr
                    : homeData.hero.subtitleDe,
              }}
            />
            {/* Description - eğer varsa göster */}
            {(lang === "tr"
              ? homeData.hero.descriptionTr
              : homeData.hero.descriptionDe) && (
              <p
                className="text-lg text-slate-400 mb-3 md:mb-10 leading-relaxed max-w-xl animate-fade-in-up delay-150"
                dangerouslySetInnerHTML={{
                  __html:
                    lang === "tr"
                      ? homeData.hero.descriptionTr
                      : homeData.hero.descriptionDe,
                }}
              />
            )}
            <div className="flex flex-row gap-2 sm:gap-4 animate-fade-in-up delay-200">
              <button
                onClick={() => setPage("activities")}
                className="
      bg-kpf-teal hover:bg-kpf-teal text-white
      px-2 py-1 sm:px-3 sm:py-2.5
      text-xs sm:text-base
      rounded-lg sm:rounded-2xl
      font-bold transition-all
      flex items-center justify-center gap-1 sm:gap-2
      group shadow-lg shadow-red-900/20
      whitespace-nowrap
    "
              >
                {lang === "tr"
                  ? homeData.hero.primaryButtonTextTr
                  : homeData.hero.primaryButtonTextDe}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => setPage("volunteer")}
                className="
    bg-white hover:bg-slate-100
    text-teal-700
    border border-white
    px-2 py-1 sm:px-3 sm:py-2.5
    text-xs sm:text-base
    rounded-lg sm:rounded-2xl
    font-bold transition-all
    flex items-center justify-center
    whitespace-nowrap
  "
              >
                {lang === "tr"
                  ? homeData.hero.secondaryButtonTextTr
                  : homeData.hero.secondaryButtonTextDe}
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
            {homeData.activities.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500">
                {lang === "tr"
                  ? "Henüz etkinlik yok"
                  : "Noch keine Veranstaltungen"}
              </div>
            ) : (
              homeData.activities
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.dateISO).getTime() -
                    new Date(a.dateISO).getTime(),
                )
                .slice(0, 3)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => {
                      globalThis.scrollTo({ top: 0, behavior: "smooth" });
                      globalThis.location.hash = `activity/${activity.id}`;
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
                ))
            )}
          </div>
        </div>
      </section>

      {/* Instagram Section (Compact) */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-10 md:p-12">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Instagram size={32} className="text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold">
                  {t("home_follow_instagram")}
                </h3>
                <p className="text-white/80 text-base mt-1">
                  {t("home_follow_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white/30 hover:border-white hover:scale-105 transition-all"
                >
                  <img
                    src={`https://picsum.photos/100/100?random=${i + 50}`}
                    alt="Instagram"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <a
              href="https://instagram.com/kulturplattformfreiburg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-lg"
            >
              <Instagram size={22} />
              @kulturplattformfreiburg
            </a>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section (Compact) --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden bg-gradient-to-br from-kpf-teal to-teal-600">
            {/* Subtle background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                {lang === "tr" ? homeData.cta.titleTr : homeData.cta.titleDe}
              </h2>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {lang === "tr"
                  ? homeData.cta.descriptionTr
                  : homeData.cta.descriptionDe}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setPage("activities")}
                  className="bg-white text-teal-700 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ArrowRight size={18} />
                  {lang === "tr"
                    ? homeData.cta.primaryButtonTr
                    : homeData.cta.primaryButtonDe}
                </button>
                <button
                  onClick={() => setPage("contact")}
                  className="bg-amber-400 text-amber-900 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-300 transition-all shadow-md"
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
