import React, { useEffect, useState } from "react";
import { Coffee, Clock, Video, Globe, Mail } from "lucide-react";
import { Language } from "../types";
import { TEXTS } from "../constants";

interface TeaEvent {
  id: string;
  titleTr: string;
  titleDe: string;
  introTr: string;
  introDe: string;
  heritageTextTr: string;
  heritageTextDe: string;
  participationTextTr: string;
  participationTextDe: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  contactEmail: string;
  isActive: boolean;
}

interface TeegespraecheProps {
  lang: Language;
}

const Teegespraeche: React.FC<TeegespraecheProps> = ({ lang }) => {
  const t = (key: string) => TEXTS[key]?.[lang] ?? key;
  const [events, setEvents] = useState<TeaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const contactEmail = "info@kulturplattformfreiburg.org";

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:7189/api/TeaEvent");
        if (!response.ok) throw new Error("Etkinlikler yüklenemedi!");
        const data: TeaEvent[] = await response.json();
        setEvents(data.filter((ev) => ev.isActive));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 🔹 Varsayılan olarak ilk aktif etkinliği alıyoruz
  const currentEvent = events[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-kpf-teal text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={
              currentEvent?.imageUrl ||
              "https://picsum.photos/1920/600?random=tea"
            }
            alt="Teegespräche Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2 text-sm font-bold mb-6 border border-white/30 animate-fade-in-down">
            <Globe size={16} /> UNESCO Intangible Cultural Heritage
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4 animate-fade-in-up">
            {lang === "tr"
              ? currentEvent?.titleTr || t("teegespraeche_title")
              : currentEvent?.titleDe || t("teegespraeche_title")}
          </h1>
          <p className="text-2xl text-teal-100 max-w-2xl mx-auto animate-fade-in-up delay-100">
            {lang === "tr" ? currentEvent?.introTr : currentEvent?.introDe}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Visuals */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://picsum.photos/400/500?random=tea1"
                alt="Tea Culture"
                className="rounded-2xl shadow-xl w-full h-full object-cover translate-y-8 hover:scale-105 transition-transform duration-500"
              />
              <img
                src="https://picsum.photos/400/500?random=tea2"
                alt="Conversation"
                className="rounded-2xl shadow-xl w-full h-full object-cover -translate-y-8 hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Schedule Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mt-16 text-center border border-slate-100 hover:shadow-2xl transition-all">
              <Clock size={48} className="mx-auto mb-4 text-kpf-red" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {lang === "tr" ? "Buluşma Zamanı" : "Treffpunkt"}
              </h3>
              <p className="text-lg font-medium text-slate-600 mb-1">
                {currentEvent?.date ||
                  (lang === "tr" ? "Her İkinci Cuma" : "Jeden zweiten Freitag")}
              </p>
              <p className="text-3xl font-bold text-kpf-teal mb-4">
                {currentEvent?.time || "16:00"}
              </p>
              <div className="inline-flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm">
                <Video size={14} /> {currentEvent?.location || "Online / Zoom"}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:pl-8 order-1 lg:order-2">
            <div className="prose prose-lg prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
                <Coffee className="text-kpf-teal" size={32} />
                {lang === "tr" ? "Kültürel Miras" : "Kulturelles Erbe"}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line text-justify mb-8">
                {lang === "tr"
                  ? currentEvent?.heritageTextTr || t("teegespraeche_desc")
                  : currentEvent?.heritageTextDe || t("teegespraeche_desc")}
              </p>

              {/* Registration Section */}
              <div className="bg-teal-50 border-l-4 border-kpf-teal p-8 rounded-r-xl shadow-sm">
                <h4 className="font-bold text-2xl text-teal-900 mb-4 flex items-center gap-2">
                  <Mail size={24} />
                  {lang === "tr"
                    ? "Nasıl Katılırım?"
                    : "Wie kann ich teilnehmen?"}
                </h4>
                <p className="text-teal-800 mb-6 text-lg">
                  {lang === "tr"
                    ? currentEvent?.participationTextTr ||
                      t("teegespraeche_registration")
                    : currentEvent?.participationTextDe ||
                      t("teegespraeche_registration")}
                </p>

                <div className="bg-white p-4 rounded-xl border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-teal-700 font-bold break-all">
                    <Mail size={20} className="flex-shrink-0" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <a
                    href={`mailto:${contactEmail}?subject=${
                      lang === "tr" ? "Sohbet Kayıt" : "Sohbet Anmeldung"
                    }`}
                    className="bg-kpf-teal text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-md whitespace-nowrap"
                  >
                    {t("teegespraeche_cta")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center text-slate-500 py-10">
          {lang === "tr" ? "Yükleniyor..." : "Lädt..."}
        </div>
      )}
    </div>
  );
};

export default Teegespraeche;
