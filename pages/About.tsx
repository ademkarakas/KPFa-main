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

interface AboutProps {
  lang: Language;
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7189/api/AboutUs");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setAboutData(json);
      } catch (err) {
        console.error("About verisi yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // Yardımcı fonksiyonlar
  const getText = (obj: any, trKey: string, deKey: string) => {
    if (!aboutData) return "";
    if (lang === "tr") return obj?.[trKey]?.value || "";
    return obj?.[deKey]?.value || "";
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-kpf-dark text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            {lang === "tr" ? "Hakkımızda" : "Über uns"}
          </h1>
          <div className="w-24 h-1.5 bg-kpf-red mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <div className="bg-white p-10 md:p-14 rounded-2xl shadow-xl border-t-8 border-kpf-teal max-w-4xl mx-auto text-center transform hover:-translate-y-1 transition-transform duration-300">
          <Quote className="text-kpf-teal/20 w-16 h-16 mx-auto mb-6" />
          <p className="text-2xl md:text-3xl font-serif text-slate-700 italic mb-8 leading-relaxed">
            "{getText(aboutData, "quoteTr", "quoteDe")}"
          </p>
          <div className="text-kpf-teal font-bold tracking-widest uppercase text-sm">
            — {aboutData ? aboutData.quoteAuthor : "..."}
          </div>
        </div>
      </div>

      {/* Who We Are & Goals */}
      <div className="container mx-auto px-4 mb-24 max-w-7xl">
        {/* Who We Are - Enhanced Layout with Image */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden group mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src="https://picsum.photos/800/800?random=community"
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
                  {getText(aboutData, "whoWeAreTr", "whoWeAreDe")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals - Enhanced Card */}
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
              {getText(aboutData, "goalsTr", "goalsDe")}
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-20 top-20 w-64 h-64 bg-kpf-teal rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute -right-20 bottom-20 w-64 h-64 bg-kpf-red rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-gradient-to-br from-kpf-teal/30 to-teal-900/40 p-10 rounded-3xl border border-teal-400/30 backdrop-blur-sm hover:border-teal-400/60 hover:shadow-2xl hover:shadow-teal-500/20 transition-all relative group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-kpf-teal to-teal-600 rounded-l-3xl"></div>
              <div className="flex items-center gap-4 mb-8 text-teal-300">
                <Eye size={40} />
                <h2 className="text-4xl font-serif font-bold text-white">
                  {lang === "tr" ? "Vizyon" : "Vision"}
                </h2>
              </div>
              <p className="text-slate-200 leading-loose text-lg text-justify">
                {getText(aboutData, "visionTr", "visionDe")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-red-950/40 p-10 rounded-3xl border border-red-400/30 backdrop-blur-sm hover:border-red-400/60 hover:shadow-2xl hover:shadow-red-500/20 transition-all relative group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-kpf-red to-red-600 rounded-l-3xl"></div>
              <div className="flex items-center gap-4 mb-8 text-red-300">
                <BookOpen size={40} />
                <h2 className="text-4xl font-serif font-bold text-white">
                  {lang === "tr" ? "Misyon" : "Mission"}
                </h2>
              </div>
              <p className="text-slate-200 leading-loose text-lg text-justify">
                {getText(aboutData, "missionTr", "missionDe")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-kpf-dark mb-4">
              {lang === "tr" ? "Temel Değerlerimiz" : "Unsere Grundwerte"}
            </h2>
            <div className="w-24 h-1.5 bg-kpf-teal mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData?.coreValues
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((value: any, index: number) => (
                <div
                  key={value.id || value.titleTr?.value}
                  className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-kpf-teal hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-teal-50 transition-colors"></div>
                  <div className="text-5xl font-bold text-slate-100 group-hover:text-teal-100 transition-colors mb-4 absolute right-4 top-2 select-none">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-kpf-dark mb-4 relative z-10 pr-8 group-hover:text-kpf-teal transition-colors">
                    {lang === "tr" ? value.titleTr.value : value.titleDe.value}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                    {lang === "tr"
                      ? value.descriptionTr.value
                      : value.descriptionDe.value}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Focus Areas (Gender, Social, Dialog) */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-kpf-dark mb-16 text-center">
            {lang === "tr" ? "Odak Alanlarımız" : "Unsere Schwerpunkte"}
          </h2>

          <div className="space-y-12">
            {aboutData?.focusAreas
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((area: any, index: number) => (
                <div
                  key={area.id || area.titleTr?.value}
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
                      </div>
                      <h3 className="text-2xl font-bold text-kpf-dark">
                        {lang === "tr"
                          ? area.titleTr.value
                          : area.titleDe.value}
                      </h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg text-justify">
                      {lang === "tr"
                        ? area.descriptionTr.value
                        : area.descriptionDe.value}
                    </p>
                  </div>
                  <div className="flex-1 bg-slate-50 h-64 w-full rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden relative group">
                    <img
                      src={`https://picsum.photos/600/400?random=${index + 20}`}
                      alt={
                        lang === "tr" ? area.titleTr.value : area.titleDe.value
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-kpf-dark/20 group-hover:bg-kpf-dark/10 transition-colors"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tenkil Museum / Human Rights Section */}
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
                {lang === "tr" ? "Tenkil Süreci" : "Tenkil-Prozess"}
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg text-justify">
                {lang === "tr"
                  ? "15 Temmuz sonrası yaşanan mağduriyetler ve toplumsal etkiler..."
                  : "Die gesellschaftlichen Auswirkungen und das Leid nach dem 15. Juli..."}
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-6 justify-center">
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors cursor-pointer group">
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
              </div>
              <a
                href="https://www.instagram.com/tenkil.museum"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-2xl border border-pink-400/30 backdrop-blur-sm hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20 text-center transition-all group"
              >
                {/* Instagram ikonu kaldırıldı, gerekirse başka bir ikon ekleyin */}
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

      {/* Practice Areas */}
      <div className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-kpf-dark mb-12 text-center">
            {lang === "tr"
              ? "Faaliyet Alanlarımız"
              : "Unsere Tätigkeitsbereiche"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData?.activityAreas
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((area: any, idx: number) => (
                <div
                  key={area.id || area.titleTr?.value}
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
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 mb-3">
                      {lang === "tr" ? area.titleTr.value : area.titleDe.value}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {lang === "tr"
                        ? area.descriptionTr.value
                        : area.descriptionDe.value}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="py-20 bg-slate-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold text-kpf-dark mb-12">
            {lang === "tr" ? "Çözüm Ortaklarımız" : "Unsere Partner"}
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {/* Partnerler backendden gelmiyor, isterseniz ekleyebilirsiniz */}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-serif font-bold text-center text-kpf-dark mb-16">
            {lang === "tr" ? "Ekibimiz" : "Unser Team"}
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-red mx-auto mb-4"></div>
              <p className="text-slate-600">
                {lang === "tr" ? "Ekip yükleniyor..." : "Team wird geladen..."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {aboutData?.teamMembers
                ?.sort((a: any, b: any) => a.order - b.order)
                .map((member: any) => (
                  <button
                    key={member.id || member.name?.value}
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group cursor-pointer hover:-translate-y-2 w-full"
                    tabIndex={0}
                  >
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <div className="absolute inset-0 bg-kpf-teal rounded-full opacity-0 group-hover:opacity-10 transition-opacity transform group-hover:scale-110"></div>
                      <img
                        src={member.imageUrl}
                        alt={member.name.value}
                        className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-md relative z-10"
                      />
                    </div>
                    <h3 className="font-bold text-2xl text-slate-800 mb-2">
                      {member.name.value}
                    </h3>
                    <p className="text-kpf-teal font-medium mb-4 uppercase tracking-wide text-sm">
                      {lang === "tr"
                        ? member.titleTr.value
                        : member.titleDe.value}
                    </p>
                    <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 group-hover:bg-kpf-teal group-hover:text-white transition-colors">
                      {lang === "tr" ? "Detayları Gör" : "Details ansehen"}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
            aria-label="Kapat"
            tabIndex={0}
            style={{
              border: "none",
              padding: 0,
              margin: 0,
              background: "rgba(30,41,59,0.6)",
            }}
          ></button>
          <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                <img
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name.value}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kpf-dark/80 to-transparent md:hidden"></div>
                <div className="absolute bottom-4 left-4 text-white md:hidden">
                  <h3 className="font-bold text-2xl">
                    {selectedMember.name.value}
                  </h3>
                  <p className="opacity-90">
                    {lang === "tr"
                      ? selectedMember.titleTr.value
                      : selectedMember.titleDe.value}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-white">
                <div className="hidden md:block mb-6">
                  <h3 className="font-bold text-3xl text-kpf-dark mb-1">
                    {selectedMember.name.value}
                  </h3>
                  <p className="text-kpf-teal font-bold uppercase tracking-wide text-sm">
                    {lang === "tr"
                      ? selectedMember.titleTr.value
                      : selectedMember.titleDe.value}
                  </p>
                </div>
                <div className="h-1 w-20 bg-kpf-red rounded-full mb-6 hidden md:block"></div>
                {/* Eğer backend'den bio gelirse buraya ekleyin */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition-colors"
                  >
                    {lang === "tr" ? "Kapat" : "Schließen"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
