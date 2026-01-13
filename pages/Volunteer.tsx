import React, { useEffect, useState } from "react";
import { Heart, Users, Zap, Sprout, Mail, MapPin, Share2 } from "lucide-react";
import { Language, PageView } from "../types";

interface VolunteerSectionItem {
  titleTr: string;
  titleDe: string;
  icon: string;
}
interface VolunteerSection {
  headingTr: string;
  headingDe: string;
  bodyTr: string;
  bodyDe: string;
  items: VolunteerSectionItem[];
}
interface VolunteerData {
  id: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  subtitleDe: string;
  introTr: string;
  introDe: string;
  sections: VolunteerSection[];
  ctaButtonTr: string;
  ctaButtonDe: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VolunteerProps {
  lang: Language;
  setPage?: (page: PageView) => void;
}

const Volunteer: React.FC<VolunteerProps> = ({ lang, setPage }) => {
  const isGerman = lang === "de";
  const [data, setData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteer = async () => {
      setLoading(true);
      try {
        // Eğer token gerekiyorsa aşağıdaki satırları açın
        // const token = localStorage.getItem("adminToken");
        // if (!token) throw new Error("Token yok");

        const res = await fetch(
          "https://localhost:7189/api/ValueItems/8eeb81f3-3fde-44bc-9b38-7058cf240b4d"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json: VolunteerData = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch Volunteer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart size={32} />;
      case "Zap":
        return <Zap size={32} />;
      case "Users":
        return <Users size={32} />;
      case "Sprout":
        return <Sprout size={32} />;
      case "Mail":
        return <Mail size={24} />;
      case "MapPin":
        return <MapPin size={24} />;
      case "Share2":
        return <Share2 size={24} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kpf-teal"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-600">
          {isGerman
            ? "Freiwilligen-Daten konnten nicht geladen werden."
            : "Gönüllü verisi yüklenemedi."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Heart size={300} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="text-white" size={40} />
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                {isGerman ? data.titleDe : data.titleTr}
              </h1>
              <p className="text-red-100 text-base md:text-lg mt-2">
                {isGerman ? data.subtitleDe : data.subtitleTr}
              </p>
            </div>
          </div>
          <div className="w-24 h-1.5 bg-white/30 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Intro */}
          <section className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border-l-4 border-kpf-red">
            <p className="text-lg text-slate-700 leading-relaxed">
              {isGerman ? data.introDe : data.introTr}
            </p>
          </section>

          {/* Sections */}
          {Array.isArray(data.sections) &&
            data.sections.map((section, sidx) => (
              <section key={sidx} className="space-y-6">
                <h2 className="text-3xl font-bold text-kpf-dark">
                  {isGerman ? section.headingDe : section.headingTr}
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {isGerman ? section.bodyDe : section.bodyTr}
                </p>
                <div className="space-y-3">
                  {Array.isArray(section.items) &&
                    section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 bg-slate-50 p-4 rounded-lg"
                      >
                        <div className="text-kpf-red flex-shrink-0 mt-1">
                          {getIcon(item.icon)}
                        </div>
                        <p className="text-slate-700">
                          {isGerman ? item.titleDe : item.titleTr}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            ))}

          {/* CTA */}
          <section className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isGerman
                ? "Beginnen Sie jetzt, machen Sie einen Unterschied!"
                : "Hemen Başla, Fark Yarat!"}
            </h2>
            <p className="text-red-100 mb-6 text-lg">
              {isGerman
                ? "Lassen Sie uns die Zukunft unserer Gesellschaft gemeinsam gestalten."
                : "Toplumun geleceğini birlikte şekillendirelim."}
            </p>
            <button
              onClick={() => {
                if (setPage) setPage("volunteer-form");
              }}
              className="bg-white text-kpf-dark px-8 py-3 rounded-full font-bold hover:bg-dark-50 transition-colors cursor-pointer"
            >
              {isGerman
                ? data.ctaButtonDe || "Mitmachen"
                : data.ctaButtonTr || "Gönüllü Ol"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
