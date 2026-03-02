import React, { useState, useEffect } from "react";
import {
  Quote,
  Target,
  Eye,
  BookOpen,
  Heart,
  Users,
  Globe,
  X,
  ShieldAlert,
} from "lucide-react";
import { Language } from "../types";
import { isRequestCancelled } from "../hooks/useCancelableRequest";
import { API_BASE_URL } from "../services/api";

// API Response Types (yeni backend yapısı)
interface ApiQuote {
  id: string;
  quoteTr: string;
  quoteDe: string;
  quoteAuthor: string;
}

interface ApiWhoWeAre {
  id: string;
  whoWeAreTr: string;
  whoWeAreDe: string;
  bannerImageSource: string | null;
}

interface ApiGoals {
  id: string;
  goalsTr: string;
  goalsDe: string;
}

interface ApiVision {
  id: string;
  visionTr: string;
  visionDe: string;
}

interface ApiMission {
  id: string;
  missionTr: string;
  missionDe: string;
}

interface ApiCoreValue {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
}

interface ApiFocusArea {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
  iconSource: string | null;
}

interface ApiActivityArea {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
}

interface ApiTeamMember {
  id: string;
  name: { value: string };
  titleTr: { value: string };
  titleDe: { value: string };
  descriptionTr: { value: string } | null;
  descriptionDe: { value: string } | null;
  imageUrl: string;
  order: number;
}

interface ApiAboutUsResponse {
  quote: ApiQuote | null;
  whoWeAre: ApiWhoWeAre | null;
  goals: ApiGoals | null;
  vision: ApiVision | null;
  mission: ApiMission | null;
  coreValues: ApiCoreValue[];
  focusAreas: ApiFocusArea[];
  activityAreas: ApiActivityArea[];
  teamMembers: ApiTeamMember[];
}

// Human Rights / Tenkil Section
interface ApiHumanRights {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  tenkilMuseumUrl: string;
  instagramUrl: string;
}

// Partner
interface ApiPartner {
  id: string;
  name: string;
  descriptionTr: string;
  descriptionDe: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface AboutProps {
  lang: Language;
}

// HTML etiketlerini temizleyen yardımcı fonksiyon
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replaceAll("</p>", "\n") // Paragraf sonlarını alt satıra çevir
    .replaceAll(/<br\s*\/?>/g, "\n") // br etiketlerini alt satıra çevir
    .replaceAll(/<[^>]*>/g, "") // Diğer tüm etiketleri temizle
    .trim();
};

const About: React.FC<AboutProps> = ({ lang }) => {
  const [selectedMember, setSelectedMember] = useState<ApiTeamMember | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<ApiAboutUsResponse | null>(null);
  const [humanRights, setHumanRights] = useState<ApiHumanRights | null>(null);
  const [partners, setPartners] = useState<ApiPartner[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Phase 1: Load critical data first (summary endpoint)
        const summaryRes = await fetch(`${API_BASE_URL}/AboutUs/summary`, {
          signal,
        });
        if (summaryRes.ok) {
          const summaryData: {
            quote: ApiQuote;
            whoWeAre: ApiWhoWeAre;
            goals: ApiGoals;
          } = await summaryRes.json();
          setAboutData((prev) => ({
            ...prev!,
            quote: summaryData.quote,
            whoWeAre: summaryData.whoWeAre,
            goals: summaryData.goals,
          }));
        }

        // Phase 2: Load secondary data (values endpoint)
        const valuesRes = await fetch(`${API_BASE_URL}/AboutUs/values`, {
          signal,
        });
        if (valuesRes.ok) {
          const valuesData: {
            vision: ApiVision;
            mission: ApiMission;
            coreValues: ApiCoreValue[];
          } = await valuesRes.json();
          setAboutData((prev) => ({
            ...prev!,
            vision: valuesData.vision,
            mission: valuesData.mission,
            coreValues: valuesData.coreValues,
          }));
        }

        // Phase 3: Load remaining data in parallel
        const [
          focusAreasRes,
          activityAreasRes,
          teamRes,
          humanRightsRes,
          partnersRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/AboutUs/focus-areas`, { signal }),
          fetch(`${API_BASE_URL}/AboutUs/activity-areas`, {
            signal,
          }),
          fetch(`${API_BASE_URL}/AboutUs/team`, { signal }),
          fetch(`${API_BASE_URL}/AboutUs/human-rights`, { signal }),
          fetch(`${API_BASE_URL}/Partners`, { signal }),
        ]);

        if (focusAreasRes.ok) {
          const focusAreasData: ApiFocusArea[] = await focusAreasRes.json();
          setAboutData((prev) => ({ ...prev!, focusAreas: focusAreasData }));
        }

        if (activityAreasRes.ok) {
          const activityAreasData: ApiActivityArea[] =
            await activityAreasRes.json();
          setAboutData((prev) => ({
            ...prev!,
            activityAreas: activityAreasData,
          }));
        }

        if (teamRes.ok) {
          const teamData: ApiTeamMember[] = await teamRes.json();
          setAboutData((prev) => ({ ...prev!, teamMembers: teamData }));
        }

        if (humanRightsRes.ok) {
          const humanRightsJson: ApiHumanRights = await humanRightsRes.json();
          setHumanRights(humanRightsJson);
        }

        if (partnersRes.ok) {
          const partnersJson: ApiPartner[] = await partnersRes.json();
          setPartners(partnersJson.filter((p) => p.isActive));
        }
      } catch (err) {
        if (!isRequestCancelled(err)) {
          console.error("Veri yüklenemedi:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  // SessionStorage'dan ilgili bölüme scroll et (loading bittikten sonra)
  useEffect(() => {
    if (!loading) {
      const sectionId = sessionStorage.getItem("scrollToSection");
      if (sectionId) {
        sessionStorage.removeItem("scrollToSection"); // Bir kez kullan

        // Retry mekanizması: Element DOM'a eklenene kadar birkaç kez dene
        let attempts = 0;
        const maxAttempts = 15; // 15 deneme = 3 saniye

        const tryScroll = () => {
          attempts++;
          const element = document.getElementById(sectionId);

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (attempts < maxAttempts) {
            setTimeout(tryScroll, 200);
          }
        };

        // İlk denemeyi 100ms sonra başlat
        setTimeout(tryScroll, 100);
      }
    }
  }, [loading]);

  // Loading state - Modern skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-slate-200 h-64"></div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-20 space-y-16">
          {/* Quote Skeleton */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl p-6 space-y-3">
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-kpf-teal text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-12 -right-12 opacity-10 pointer-events-none transform -rotate-12">
          <Users size={400} strokeWidth={0.5} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            {lang === "tr" ? "Hakkımızda" : "Über uns"}
          </h1>
          <div className="w-24 h-1.5 bg-kpf-light mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Quote Section */}
      {aboutData?.quote && (
        <div
          className="container mx-auto px-4 -mt-10 mb-20 relative z-20"
          id="who-we-are"
        >
          <div className="bg-white p-10 md:p-14 rounded-2xl shadow-xl border-t-8 border-kpf-teal max-w-4xl mx-auto text-center transform hover:-translate-y-1 transition-transform duration-300">
            <Quote className="text-kpf-teal/20 w-16 h-16 mx-auto mb-6" />
            <p className="text-2xl md:text-3xl font-serif text-slate-700 italic mb-8 leading-relaxed">
              "
              {lang === "tr"
                ? aboutData.quote.quoteTr
                : aboutData.quote.quoteDe}
              "
            </p>
            <div className="text-kpf-teal font-bold tracking-widest uppercase text-sm">
              — {aboutData.quote.quoteAuthor}
            </div>
          </div>
        </div>
      )}

      {/* Who We Are & Goals */}
      <div className="container mx-auto px-4 mb-24 max-w-7xl">
        {/* Who We Are - Enhanced Layout with Image */}
        {aboutData?.whoWeAre && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden group mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img
                  src={
                    aboutData.whoWeAre.bannerImageSource ||
                    "https://picsum.photos/800/800?random=community"
                  }
                  alt="Community"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-kpf-teal/20"></div>
              </div>
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-kpf-red/10 text-kpf-red rounded-2xl">
                      <Users size={32} />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-kpf-dark m-0">
                      {lang === "tr" ? "Biz Kimiz?" : "Wer sind wir?"}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line text-justify">
                    {stripHtml(
                      lang === "tr"
                        ? aboutData.whoWeAre.whoWeAreTr
                        : aboutData.whoWeAre.whoWeAreDe,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals - Enhanced Card */}
        {aboutData?.goals && (
          <div className="bg-kpf-teal text-white p-10 md:p-16 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target size={200} />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="p-4 bg-white/20 text-white rounded-2xl backdrop-blur-sm">
                  <Target size={40} />
                </div>
                <h2 className="text-4xl font-serif font-bold">
                  {lang === "tr" ? "Hedeflerimiz" : "Ziele"}
                </h2>
              </div>
              <p className="text-teal-50 text-lg leading-relaxed text-justify">
                {stripHtml(
                  lang === "tr"
                    ? aboutData.goals.goalsTr
                    : aboutData.goals.goalsDe,
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vision & Mission */}
      {(aboutData?.vision || aboutData?.mission) && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -left-20 top-20 w-64 h-64 bg-kpf-teal rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute -right-20 bottom-20 w-64 h-64 bg-kpf-red rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {aboutData?.vision && (
                <div className="bg-gradient-to-br from-kpf-teal/30 to-teal-900/40 p-10 rounded-3xl border border-teal-400/30 backdrop-blur-sm hover:border-teal-400/60 hover:shadow-2xl hover:shadow-teal-500/20 transition-all relative group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-kpf-teal to-teal-600 rounded-l-3xl"></div>
                  <div className="flex items-center gap-4 mb-8 text-teal-300">
                    <Eye size={40} />
                    <h2 className="text-4xl font-serif font-bold text-white">
                      {lang === "tr" ? "Vizyon" : "Vision"}
                    </h2>
                  </div>
                  <p className="text-slate-200 leading-loose text-lg text-justify">
                    {stripHtml(
                      lang === "tr"
                        ? aboutData.vision.visionTr
                        : aboutData.vision.visionDe,
                    )}
                  </p>
                </div>
              )}
              {aboutData?.mission && (
                <div className="bg-gradient-to-br from-red-900/30 to-red-950/40 p-10 rounded-3xl border border-red-400/30 backdrop-blur-sm hover:border-red-400/60 hover:shadow-2xl hover:shadow-red-500/20 transition-all relative group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-kpf-red to-red-600 rounded-l-3xl"></div>
                  <div className="flex items-center gap-4 mb-8 text-red-300">
                    <BookOpen size={40} />
                    <h2 className="text-4xl font-serif font-bold text-white">
                      {lang === "tr" ? "Misyon" : "Mission"}
                    </h2>
                  </div>
                  <p className="text-slate-200 leading-loose text-lg text-justify">
                    {stripHtml(
                      lang === "tr"
                        ? aboutData.mission.missionTr
                        : aboutData.mission.missionDe,
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Core Values */}
      {aboutData?.coreValues && aboutData.coreValues.length > 0 && (
        <div className="py-24 bg-slate-50" id="core-values">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-kpf-dark mb-4">
                {lang === "tr" ? "Temel Değerlerimiz" : "Unsere Grundwerte"}
              </h2>
              <div className="w-24 h-1.5 bg-kpf-teal mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...aboutData.coreValues]
                .sort((a, b) => a.order - b.order)
                .map((value, index) => (
                  <div
                    key={value.id}
                    className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-kpf-teal hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-teal-50 transition-colors"></div>
                    <div className="text-5xl font-bold text-slate-100 group-hover:text-teal-100 transition-colors mb-4 absolute right-4 top-2 select-none">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-kpf-dark mb-4 relative z-10 pr-8 group-hover:text-kpf-teal transition-colors">
                      {lang === "tr" ? value.titleTr : value.titleDe}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                      {stripHtml(
                        lang === "tr"
                          ? value.descriptionTr
                          : value.descriptionDe,
                      )}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Focus Areas (Gender, Social, Dialog) */}
      {aboutData?.focusAreas && aboutData.focusAreas.length > 0 && (
        <div className="py-24 bg-white" id="focus-areas">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-serif font-bold text-kpf-dark mb-16 text-center">
              {lang === "tr" ? "Odak Alanlarımız" : "Unsere Schwerpunkte"}
            </h2>

            <div className="space-y-12">
              {[...aboutData.focusAreas]
                .sort((a, b) => a.order - b.order)
                .map((area, index) => (
                  <div
                    key={area.id}
                    className={`flex flex-col md:flex-row gap-8 items-start ${
                      index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-kpf-teal/10 text-kpf-teal rounded-lg">
                          {index === 0 && <Users size={24} />}
                          {index === 1 && <Heart size={24} />}
                          {index === 2 && <Globe size={24} />}
                          {index > 2 && <BookOpen size={24} />}
                        </div>
                        <h3 className="text-2xl font-bold text-kpf-dark">
                          {lang === "tr" ? area.titleTr : area.titleDe}
                        </h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg text-justify">
                        {stripHtml(
                          lang === "tr"
                            ? area.descriptionTr
                            : area.descriptionDe,
                        )}
                      </p>
                    </div>
                    <div className="flex-1 bg-slate-50 h-96 w-full rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden relative group">
                      <img
                        src={
                          area.iconSource ||
                          `https://picsum.photos/600/400?random=${index + 20}`
                        }
                        alt={lang === "tr" ? area.titleTr : area.titleDe}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-kpf-dark/20 group-hover:bg-kpf-dark/10 transition-colors"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tenkil Museum / Human Rights Section */}
      {humanRights && (
        <div className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/50 text-red-200 border border-red-800 text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldAlert size={14} />{" "}
                  {lang === "tr"
                    ? "İnsan Hakları & Mülteciler"
                    : "Menschenrechte & Flüchtlinge"}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                  {lang === "tr" ? humanRights.titleTr : humanRights.titleDe}
                </h2>
                <p className="text-slate-300 leading-relaxed text-lg text-justify">
                  {stripHtml(
                    lang === "tr"
                      ? humanRights.descriptionTr
                      : humanRights.descriptionDe,
                  )}
                </p>
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-6 justify-center">
                <a
                  href={humanRights.tenkilMuseumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <ShieldAlert
                    size={64}
                    className="mx-auto text-kpf-red mb-4 group-hover:scale-110 transition-transform"
                  />
                  <h4 className="font-bold text-2xl mb-2">Tenkil Museum</h4>
                  <div className="h-0.5 w-12 bg-kpf-red mx-auto my-4"></div>
                  <p className="text-sm text-slate-400">
                    {lang === "tr"
                      ? "Hatırlamak ve yüzleşmek için."
                      : "Erinnern und konfrontieren."}
                  </p>
                </a>
                <a
                  href={humanRights.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-2xl border border-pink-400/30 backdrop-blur-sm hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20 text-center transition-all group"
                >
                  <h4 className="font-bold text-2xl mb-2 text-white">
                    Instagram
                  </h4>
                  <div className="h-0.5 w-12 bg-white mx-auto my-4"></div>
                  <p className="text-sm text-white/90">
                    {lang === "tr" ? "Bizi takip edin" : "Folgen Sie uns"}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Areas / Activity Areas */}
      {aboutData?.activityAreas && aboutData.activityAreas.length > 0 && (
        <div className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-kpf-dark mb-12 text-center">
              {lang === "tr"
                ? "Faaliyet Alanlarımız"
                : "Unsere Tätigkeitsbereiche"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...aboutData.activityAreas]
                .sort((a, b) => a.order - b.order)
                .map((area, idx) => (
                  <div
                    key={area.id}
                    className={`flex gap-5 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 ${
                      idx % 2 === 0 ? "border-kpf-teal" : "border-kpf-red"
                    } hover:translate-x-1 group`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner transition-colors group-hover:text-white ${
                          idx % 2 === 0
                            ? "bg-teal-50 text-kpf-teal group-hover:bg-kpf-teal"
                            : "bg-red-50 text-kpf-red group-hover:bg-kpf-red"
                        }`}
                      >
                        {idx === 0 && <BookOpen size={24} />}
                        {idx === 1 && <Heart size={24} />}
                        {idx === 2 && <Users size={24} />}
                        {idx > 2 && <Globe size={24} />}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 mb-3">
                        {lang === "tr" ? area.titleTr : area.titleDe}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {stripHtml(
                          lang === "tr"
                            ? area.descriptionTr
                            : area.descriptionDe,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
                {lang === "tr" ? "Çözüm Ortaklarımız" : "Unsere Partner"}
              </h2>
              <div className="w-20 h-1.5 bg-kpf-teal mx-auto rounded-full opacity-60"></div>
            </div>

            {/* Partners Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...partners]
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((partner, idx) => (
                  <a
                    key={partner.id}
                    href={partner.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative h-64 w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-500 hover:shadow-2xl"
                  >
                    {/* 1. Arka Plandaki Büyük Yazı (Estetik amaçlı) */}
                    <span className="absolute -bottom-4 -left-4 text-7xl font-bold text-slate-200/50 select-none group-hover:opacity-0 transition-opacity">
                      {idx + 1}
                    </span>

                    {/* 2. Ana İçerik: Logo */}
                    <div className="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-12">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                        />
                      ) : (
                        <div className="text-4xl font-bold text-slate-400">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* 3. Hover ile Yukarı Kayan Renkli Panel (Tam Boy) */}
                    <div className="absolute inset-0 bg-kpf-teal translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-end p-8">
                      {/* Panel İçeriği */}
                      <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {partner.name}
                        </h3>
                        <div className="w-8 h-1 bg-white/40 mb-3 rounded-full"></div>
                        <p className="text-sm text-teal-50/90 leading-relaxed">
                          {lang === "tr"
                            ? partner.descriptionTr
                            : partner.descriptionDe}
                        </p>
                        <div className="mt-4 flex items-center text-xs font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                          {lang === "tr" ? "İncele" : "Besuchen"}
                          <svg
                            className="ml-2 w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {aboutData?.teamMembers && aboutData.teamMembers.length > 0 && (
        <div className="bg-slate-50 py-24 border-t border-slate-200">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
                {lang === "tr" ? "Ekibimiz" : "Unser Team"}
              </h2>
              <div className="w-20 h-1.5 bg-kpf-teal mx-auto rounded-full opacity-60"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...aboutData.teamMembers]
                .sort((a, b) => a.order - b.order)
                .map((member) => {
                  const initials = member.name?.value
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2);

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className="group relative flex items-center bg-white p-8 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 text-left w-full outline-none hover:-translate-y-1"
                    >
                      {/* Sol: Monogram Kutusu - Kartın Tam İçinde */}
                      <div className="flex-shrink-0 w-32 h-32 md:w-44 md:h-44 bg-kpf-teal rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                        <span>{initials}</span>
                      </div>

                      {/* Sağ: Metin Alanı */}
                      <div className="ml-8 flex-grow">
                        <h3 className="font-bold text-3xl text-slate-800 group-hover:text-kpf-teal transition-colors duration-300">
                          {member.name?.value || ""}
                        </h3>

                        <div className="h-0.5 w-10 bg-kpf-teal/30 my-3 rounded-full group-hover:w-14 transition-all duration-300"></div>

                        <p className="text-kpf-teal font-bold uppercase tracking-widest text-xs mb-4">
                          {lang === "tr"
                            ? member.titleTr?.value || ""
                            : member.titleDe?.value || ""}
                        </p>

                        <div className="flex items-center text-[11px] font-black text-slate-400 group-hover:text-kpf-teal transition-colors tracking-widest">
                          {lang === "tr" ? "DETAYLI İNCELE" : "DETAILS ANSEHEN"}
                          <svg
                            className="ml-1.5 w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
          {/* Team Member Detail Modal (Açılan Pencere) */}
          {selectedMember && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Arka Plan Karartma */}
              <div
                role="button"
                tabIndex={0}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedMember(null)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" || e.key === "Enter") {
                    setSelectedMember(null);
                  }
                }}
                aria-label={lang === "tr" ? "Modalı kapat" : "Modal schließen"}
              ></div>

              {/* Modal İçeriği */}
              <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-full transition-all z-20"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row min-h-[400px]">
                  {/* Modal Sol: Görsel Alan (Yine Monogram) */}
                  <div className="w-full md:w-2/5 bg-gradient-to-br from-kpf-teal to-slate-900 p-12 flex flex-col items-center justify-center text-white relative">
                    <div className="text-6xl font-black opacity-10 absolute top-4 left-4 select-none">
                      “
                    </div>
                    <div className="text-6xl font-bold tracking-tighter mb-4">
                      {selectedMember.name?.value
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </div>
                    <div className="h-1.5 w-12 bg-white/30 rounded-full"></div>
                  </div>

                  {/* Modal Sağ: Metin Alanı */}
                  <div className="w-full md:w-3/5 p-12 flex flex-col justify-center bg-white">
                    <h3 className="font-bold text-3xl text-slate-800 mb-2">
                      {selectedMember.name?.value || ""}
                    </h3>
                    <p className="text-kpf-teal font-bold uppercase tracking-widest text-xs mb-8">
                      {lang === "tr"
                        ? selectedMember.titleTr?.value || ""
                        : selectedMember.titleDe?.value || ""}
                    </p>

                    <div className="relative">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                      <p className="text-slate-600 leading-relaxed pl-2 text-lg italic">
                        {stripHtml(
                          lang === "tr"
                            ? selectedMember.descriptionTr?.value || ""
                            : selectedMember.descriptionDe?.value || "",
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedMember(null)}
                      className="mt-10 w-full py-4 bg-slate-900 hover:bg-kpf-teal text-white rounded-2xl font-bold transition-all duration-300"
                    >
                      {lang === "tr" ? "Kapat" : "Schließen"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default About;
