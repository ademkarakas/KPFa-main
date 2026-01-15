import React, { useState, useEffect } from "react";
import {
  Heart,
  CreditCard,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import { Language } from "../types";

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-red mx-auto mb-4"></div>
          <p className="text-slate-600">
            {lang === "tr" ? "Yükleniyor..." : "Lädt..."}
          </p>
        </div>
      </div>
    );
  }

  // No data fallback
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-600">
          {lang === "tr" ? "Veri bulunamadı" : "Keine Daten gefunden"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 max-w-5xl text-center mb-24">
        <div className="inline-flex items-center justify-center p-4 bg-kpf-teal/5 rounded-[2.5rem] mb-8 group transition-all duration-500 hover:bg-kpf-teal/10">
          <div className="w-20 h-20 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.06)] rounded-[2rem] flex items-center justify-center text-kpf-teal transition-transform duration-500 group-hover:scale-110">
            <Heart size={40} fill="currentColor" className="opacity-80" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-kpf-dark mb-4 animate-fade-in-up">
          {lang === "tr" ? data.heroTitleTr : data.heroTitleDe}
        </h1>
        <p className="text-xl md:text-2xl text-kpf-teal font-medium mb-12 animate-fade-in-up delay-100">
          {lang === "tr" ? data.heroSubtitleTr : data.heroSubtitleDe}
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Features Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-teal-100 text-kpf-teal rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">
              {lang === "tr" ? data.feature1TitleTr : data.feature1TitleDe}
            </h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-red-100 text-kpf-red rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileCheck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">
              {lang === "tr" ? data.feature2TitleTr : data.feature2TitleDe}
            </h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">
              {lang === "tr" ? data.feature3TitleTr : data.feature3TitleDe}
            </h3>
          </div>
        </div>

        {/* Why & Where Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-stretch">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Heart size={150} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-6 relative z-10">
              {lang === "tr" ? data.whyDonateTitleTr : data.whyDonateTitleDe}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed relative z-10">
              {lang === "tr"
                ? data.whyDonateDescriptionTr
                : data.whyDonateDescriptionDe}
            </p>
          </div>
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-kpf-dark mb-6">
              {lang === "tr" ? data.whereTitleTr : data.whereTitleDe}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {lang === "tr"
                ? data.whereDescriptionTr
                : data.whereDescriptionDe}
            </p>
            <div className="mt-8 p-4 bg-teal-50 text-teal-800 rounded-xl text-sm font-medium border border-teal-100 flex items-start gap-3">
              <FileCheck size={20} className="shrink-0 mt-0.5" />
              {lang === "tr" ? data.taxInfoTr : data.taxInfoDe}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Transfer */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CreditCard className="text-kpf-teal" size={20} />
              </div>
              {lang === "tr" ? "Banka Havalesi" : "Banküberweisung"}
            </h2>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm group hover:border-kpf-teal transition-colors">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  IBAN
                </span>
                <div className="flex justify-between items-center">
                  <code className="text-lg md:text-xl font-mono text-slate-800 font-bold tracking-tight">
                    {data.iban}
                  </code>
                  <button
                    onClick={() => copyToClipboard(data.iban)}
                    className={`p-2 transition-colors ${
                      copied
                        ? "text-green-500"
                        : "text-slate-400 hover:text-kpf-teal"
                    }`}
                    title={copied ? "Kopyalandı!" : "Kopyala"}
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    BIC / SWIFT
                  </span>
                  <div className="text-lg font-mono text-slate-800 font-bold">
                    {data.bicSwift}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === "tr" ? "Alıcı" : "Empfänger"}
                  </span>
                  <div className="text-lg font-bold text-slate-800">
                    {data.accountHolder}
                  </div>
                </div>
              </div>

              {data.bankName && (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === "tr" ? "Banka" : "Bank"}
                  </span>
                  <div className="text-lg font-bold text-slate-800">
                    {data.bankName}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PayPal Donation */}
          <div className="bg-[#003087] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center items-center text-center shadow-lg group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-10 mb-6 relative z-10 brightness-0 invert"
            />

            <h2 className="text-2xl font-bold mb-4 relative z-10">
              {lang === "tr" ? "PayPal ile Bağış Yap" : "Mit PayPal spenden"}
            </h2>
            <p className="text-blue-100 mb-8 max-w-sm mx-auto relative z-10 text-lg">
              {lang === "tr" ? data.contentTr : data.contentDe}
            </p>

            <a
              href={data.payPalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-3 bg-white text-[#003087] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>
                {lang === "tr" ? "PayPal ile Bağış Yap" : "Mit PayPal spenden"}
              </span>
              <ExternalLink size={18} />
            </a>
            {data.payPalHandle && (
              <div className="mt-4 text-blue-200 font-mono text-sm relative z-10">
                {data.payPalHandle}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
