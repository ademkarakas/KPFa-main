import React, { useState } from "react";
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

interface HomeProps {
  lang: Language;
  setPage: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ lang, setPage }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const t = (key: string) => TEXTS[key][lang];

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

        <div className="container mx-auto px-4 z-10 relative text-white">
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
                className="bg-kpf-red hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-red-900/20"
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
            {[
              {
                id: "who-we-are", // ID ekledik
                title: lang === "tr" ? "Biz Kimiz" : "Über Uns",
                desc:
                  lang === "tr"
                    ? "Freiburg'un çok sesli kültür yapısını birleştiren bir köprüyüz."
                    : "Wir sind die Brücke, die Freiburgs vielfältige Kulturlandschaft verbindet.",
                icon: <Users className="text-orange-500" size={32} />,
                color: "bg-orange-500",
                target: "about",
              },
              {
                id: "values", // ID ekledik (Bu özel olan)
                title: lang === "tr" ? "Değerlerimiz" : "Unsere Werte",
                desc:
                  lang === "tr"
                    ? "Kapsayıcılık ve çeşitlilik üzerine kurulu bir gelecek inşa ediyoruz."
                    : "Wir bauen eine Zukunft, die auf Inklusion und Vielfalt basiert.",
                icon: <Heart className="text-teal-500" size={32} />,
                color: "bg-teal-500",
                target: "about",
              },
              {
                id: "community", // ID ekledik
                title: lang === "tr" ? "Topluluk" : "Gemeinschaft",
                desc:
                  lang === "tr"
                    ? "Birlikte öğreniyor, üretiyor ve Freiburg'u güzelleştiriyoruz."
                    : "Gemeinsam lernen, gestalten und bereichern wir Freiburg.",
                icon: <Sparkles className="text-purple-500" size={32} />,
                color: "bg-purple-500",
                target: "volunteer",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => {
                  // 1. Sayfayı değiştir
                  setPage(feature.target as PageView);

                  // 2. Eğer tıklanan kart "Değerlerimiz" kartıysa, About sayfasındaki bölüme kaydır
                  if (feature.id === "values") {
                    setTimeout(() => {
                      const element = document.getElementById(
                        "core-values-section"
                      );
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 150); // Sayfanın render olması için kısa bir bekleme
                  } else {
                    // Diğer kartlar tıklandığında sayfanın en başına gitmesini sağlarız
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-slate-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <div className="flex items-center text-slate-400 font-bold text-sm group-hover:text-slate-900 transition-colors">
                  {lang === "tr" ? "Keşfet" : "Entdecken"}{" "}
                  <ChevronRight
                    size={18}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            ))}
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
              className="inline-flex items-center gap-2 font-bold text-kpf-red hover:text-red-700 transition-colors border-b-2 border-kpf-red/20 pb-1"
            >
              {lang === "tr" ? "Tümünü Gör" : "Alle ansehen"}
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {MOCK_ACTIVITIES.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
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
                  <div className="flex items-center gap-2 text-kpf-red text-sm font-bold mb-3">
                    <Calendar size={16} />
                    {activity.date[lang]}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-kpf-red transition-colors line-clamp-2">
                    {activity.title[lang]}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {activity.description[lang]}
                  </p>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                      <MapPin size={14} /> {activity.location.split(",")[0]}
                    </span>
                    <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-kpf-red group-hover:text-white transition-all">
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
      bg-gradient-to-br from-slate-900 via-rose-950 to-kpf-red shadow-[0_30px_60px_-15px_rgba(159,18,57,0.4)]"
          >
            {/* Soyut Arka Plan Deseni */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-10 leading-tight">
                {lang === "tr"
                  ? "Birlikte Daha Güçlüyüz"
                  : "Zusammen sind wir stärker"}
              </h2>

              <p className="text-xl md:text-2xl text-slate-200 mb-16 leading-relaxed font-light">
                {t("about_mission_short")}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => setPage("volunteer-form")}
                  className="bg-white text-rose-900 px-12 py-5 rounded-2xl font-extrabold hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-white/20 active:scale-95"
                >
                  <Heart size={24} fill="currentColor" />
                  {lang === "tr" ? "Gönüllü Ol" : "Freiwilliger werden"}
                </button>

                <button
                  onClick={() => setPage("contact")}
                  className="bg-white/5 text-white border-2 border-white/20 backdrop-blur-sm px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 active:scale-95"
                >
                  {t("nav_contact")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Activity Detail Modal (Editoryal Stil) --- */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            onClick={() => setSelectedActivity(null)}
          ></div>
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl animate-scale-in flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-6 right-6 bg-white shadow-xl text-slate-800 p-2 rounded-full z-20 hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.title[lang]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="text-kpf-red font-bold text-xs mb-4 uppercase tracking-[0.2em]">
                {selectedActivity.date[lang]}
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                {selectedActivity.title[lang]}
              </h3>
              <div className="flex items-center gap-2 text-slate-500 mb-8 pb-6 border-b border-slate-100">
                <MapPin size={16} /> {selectedActivity.location}
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-10">
                {selectedActivity.description[lang]}
              </p>
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
              >
                {lang === "tr" ? "Kapat" : "Schließen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
