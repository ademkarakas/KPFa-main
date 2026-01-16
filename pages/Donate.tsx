import React, { useState, useEffect } from "react";
import {
  Heart,
  CreditCard,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Gift,
  Globe,
  Info,
} from "lucide-react";

type Language = "tr" | "de";

interface DonatePageData {
  id: string;
  heroTitleTr: string;
  heroTitleDe: string;
  heroSubtitleTr: string;
  heroSubtitleDe: string;
  heroImageUrl: string;
  feature1TitleTr: string;
  feature1TitleDe: string;
  feature2TitleTr: string;
  feature2TitleDe: string;
  feature3TitleTr: string;
  feature3TitleDe: string;
  whyDonateTitleTr: string;
  whyDonateTitleDe: string;
  whyDonateDescriptionTr: string;
  whyDonateDescriptionDe: string;
  whereTitleTr: string;
  whereTitleDe: string;
  whereDescriptionTr: string;
  whereDescriptionDe: string;
  taxInfoTr: string;
  taxInfoDe: string;
  accountHolder: string;
  iban: string;
  bicSwift: string;
  bankName: string;
  payPalUrl: string;
  payPalHandle: string;
  contentTr: string;
  contentDe: string;
}

interface DonateProps {
  lang: Language;
}

const Donate: React.FC<DonateProps> = ({ lang }) => {
  const [data, setData] = useState<DonatePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://localhost:7189/api/DonatePage");
        if (res.ok) {
          const json: DonatePageData = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("DonatePage verisi yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">
            {lang === "tr" ? "Yükleniyor..." : "Lädt..."}
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Backend'den gelen Feature başlıklarını ikonlarla eşleştiriyoruz
  const features = [
    {
      title: lang === "tr" ? data.feature1TitleTr : data.feature1TitleDe,
      icon: <ShieldCheck size={28} />,
    },
    {
      title: lang === "tr" ? data.feature2TitleTr : data.feature2TitleDe,
      icon: <FileCheck size={28} />,
    },
    {
      title: lang === "tr" ? data.feature3TitleTr : data.feature3TitleDe,
      icon: <CheckCircle size={28} />,
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-50 pt-20 pb-16 overflow-hidden">
        {/* Dekoratif Kalp Arkaplan */}
        <div className="absolute top-0 right-0 p-2 opacity-[0.08] pointer-events-none">
          <Heart size={400} fill="currentColor" className="text-teal-400" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm border border-teal-100 text-teal-700 px-6 py-2 rounded-full text-sm font-bold mb-8">
            <Heart size={16} fill="currentColor" className="animate-pulse" />
            {lang === "tr" ? "Bağış Sayfası" : "Spendenseite"}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1]">
            {lang === "tr" ? data.heroTitleTr : data.heroTitleDe}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {lang === "tr" ? data.heroSubtitleTr : data.heroSubtitleDe}
          </p>
        </div>
      </section>

      {/* --- FEATURE CARDS --- */}
      <section className="py-12 -mt-6 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white p-10 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-teal-200 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* Hover Kalp Efekti */}
                <div className="absolute -right-6 -bottom-6 text-teal-50 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                  <Heart size={140} fill="currentColor" />
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY & WHERE SECTION (Backend Content) --- */}
      <section className="py-2">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Why Donate - Backend Verisi */}
            <div className="bg-teal-600 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-teal-900/20">
              <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-6">
                  {lang === "tr"
                    ? data.whyDonateTitleTr
                    : data.whyDonateTitleDe}
                </h2>
                <br></br>
                <p className="text-lg text-teal-50 leading-relaxed font-light">
                  {lang === "tr"
                    ? data.whyDonateDescriptionTr
                    : data.whyDonateDescriptionDe}
                </p>
              </div>
              <Heart
                className="absolute -bottom-10 -right-10 text-white/10"
                size={280}
                fill="currentColor"
              />
            </div>

            {/* Where It Goes - Backend Verisi */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl flex flex-col justify-between hover:border-teal-100 transition-colors">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                  {lang === "tr" ? data.whereTitleTr : data.whereTitleDe}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {lang === "tr"
                    ? data.whereDescriptionTr
                    : data.whereDescriptionDe}
                </p>
              </div>
              <div className="p-6 bg-teal-50 rounded-2xl border-l-4 border-teal-500 flex items-start gap-4 shadow-sm">
                <Info className="text-teal-600 shrink-0 mt-1" size={20} />
                <p className="text-sm text-teal-900 font-medium">
                  {lang === "tr" ? data.taxInfoTr : data.taxInfoDe}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PAYMENT METHODS --- */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Transfer Card */}
            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                  <CreditCard size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {lang === "tr" ? "Banka Havalesi" : "Banküberweisung"}
                </h2>
              </div>

              <div className="space-y-4">
                {/* IBAN */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-teal-500 hover:bg-white transition-all duration-300 group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    IBAN
                  </p>
                  <div className="flex justify-between items-center">
                    <code className="text-lg md:text-2xl font-mono text-slate-800 font-bold tracking-tight">
                      {data.iban}
                    </code>
                    <button
                      onClick={() => copyToClipboard(data.iban)}
                      className={`p-3 rounded-xl transition-all ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-white text-slate-400 hover:text-teal-600 shadow-sm"
                      }`}
                      title="Kopyala"
                    >
                      {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                {/* BIC & Recipient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-teal-100 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      BIC / SWIFT
                    </p>
                    <div className="text-lg font-bold text-slate-800">
                      {data.bicSwift}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-teal-100 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {lang === "tr" ? "ALICI" : "EMPFÄNGER"}
                    </p>
                    <div className="text-lg font-bold text-slate-800 truncate">
                      {data.accountHolder}
                    </div>
                  </div>
                </div>

                {/* Bank Name (Backend check) */}
                {data.bankName && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-teal-100 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {lang === "tr" ? "BANKA" : "BANK"}
                    </p>
                    <div className="text-lg font-bold text-slate-800">
                      {data.bankName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PayPal Card - Backend Verileriyle */}
            <div className="bg-[#003087] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden flex flex-col shadow-2xl group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-transparent"></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-10">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-10 brightness-0 invert"
                  />
                </div>

                <h2 className="text-3xl font-bold mb-6">
                  {lang === "tr" ? "PayPal ile Bağış" : "PayPal Spende"}
                </h2>

                <p className="text-blue-100 text-lg mb-10 flex-grow leading-relaxed">
                  {/* Backend'den gelen metin */}
                  {lang === "tr" ? data.contentTr : data.contentDe}
                </p>

                <div className="space-y-6">
                  <a
                    href={data.payPalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white text-[#003087] py-5 rounded-2xl font-black text-xl text-center hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    {lang === "tr" ? "Hemen Bağış Yap" : "Jetzt spenden"}
                    <ExternalLink size={20} />
                  </a>

                  {data.payPalHandle && (
                    <div className="text-center opacity-100 font-mono text-sm text-white">
                      {data.payPalHandle}
                    </div>
                  )}
                </div>
              </div>
              <Heart
                className="absolute -bottom-10 -left-10 text-white/5 rotate-12"
                size={200}
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SUPPORT SECTION --- */}
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-teal-700 text-white rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                {lang === "tr"
                  ? "Herhangi Bir Sorunuz mu Var?"
                  : "Haben Sie Fragen?"}
              </h3>
              <p className="text-slate-400 text-lg mb-8">
                {lang === "tr"
                  ? "Bağış süreciyle ilgili destek almak için bizimle iletişime geçebilirsiniz."
                  : "Bei Fragen zum Spendenprozess können Sie uns jederzeit kontaktieren."}
              </p>
              <div className="inline-flex items-center gap-6 text-teal-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">
                    Secure
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
