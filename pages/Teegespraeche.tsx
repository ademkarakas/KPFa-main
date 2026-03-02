import React, { useEffect, useState } from "react";
import { BookOpen, Coffee, Globe, Heart } from "lucide-react";
import { Language } from "../types";
import { TEXTS } from "../constants";
import { API_BASE_URL } from "../services/api";
import { createSafeHtml } from "../utils/sanitize";

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
  imageSource?: string;
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

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/TeaEvent`);
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
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Banner - Yüksekliği küçültülmüş ve Teal yapılmış */}
      <div className="bg-[#008080] text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Coffee size={300} strokeWidth={0.5} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Globe className="text-white flex-shrink-0" size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
              {lang === "tr" ? currentEvent?.titleTr : currentEvent?.titleDe}
            </h1>
          </div>
          <div
            className="text-teal-50 text-lg max-w-2xl leading-relaxed font-light italic opacity-90"
            dangerouslySetInnerHTML={createSafeHtml(
              lang === "tr" ? currentEvent?.introTr : currentEvent?.introDe,
            )}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 relative z-20 pb-24">
        {/* 1. Bölüm: Görsel (Küçültülmüş ve aşağı kaydırılmış) ve UNESCO Mirası */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          {/* Resim Alanı: Sol tarafta, küçültülmüş (max-w-lg) ve mt-12 ile aşağıda */}
          <div className="lg:col-span-5 mt-12 group">
            <div className="relative max-w-lg mx-auto lg:mx-0">
              <div className="absolute -inset-3 bg-teal-100/40 rounded-[1.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
              <img
                src={
                  currentEvent?.imageSource ||
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000"
                }
                alt="Tea Culture"
                className="relative rounded-2xl shadow-xl w-full h-[350px] object-cover z-10"
              />
            </div>
          </div>

          {/* UNESCO Metni: Sağ tarafta */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
            <span className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              UNESCO
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6 leading-tight">
              {lang === "tr"
                ? "Kültürel Bir Miras Olarak Sohbet"
                : "Sohbet als kulturelles Erbe"}
            </h2>
            <div
              className="text-slate-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={createSafeHtml(
                lang === "tr"
                  ? currentEvent?.heritageTextTr
                  : currentEvent?.heritageTextDe,
              )}
            />
          </div>
        </div>

        {/* 2. Bölüm: Detaylar (İkili Kart Düzeni) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
          {/* Manevi Derinlik Kartı */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-teal-100 transition-colors"></div>
            <div className="w-14 h-14 bg-[#008080] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-teal-100 relative z-10">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 relative z-10">
              {lang === "tr" ? "Manevi Derinlik" : "Spirituelle Tiefe"}
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {lang === "tr"
                ? "Sohbet-i Canan esasıyla gönüllerin buluştuğu bu meclislerde, bilgi sevgiyle yoğrulur ve karakter inşasına dönüşür."
                : "In diesen Runden, in denen sich die Herzen durch das Gedenken an den Schöpfer begegnen, wird Wissen mit Liebe verschmolzen."}
            </p>
          </div>

          {/* Müzakere ve Bilgi Kartı */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-amber-100 transition-colors"></div>
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-amber-100 relative z-10">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 relative z-10">
              {lang === "tr" ? "Müzakere Kültürü" : "Diskurskultur"}
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {lang === "tr"
                ? "Karşılıklı fikir alışverişiyle derinleşen bu süreçte, her birey hem bir öğretmen hem de hayat boyu bir öğrencidir."
                : "In diesem Prozess des gegenseitigen Austauschs ist jeder Einzelne sowohl Lehrer als auch ein lebenslang Lernender."}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
        </div>
      )}
    </div>
  );
};

export default Teegespraeche;
