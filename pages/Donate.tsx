import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Heart,
  CreditCard,
  Copy,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Info,
  BanknoteIcon,
  Download,
  Scan,
  ArrowRight,
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
  const [activeTab, setActiveTab] = useState<"bank" | "paypal">("bank");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Generate SEPA QR Code
  const generateSepaQrCode = (
    iban: string,
    bicSwift: string,
    holder: string,
  ) => {
    // IBAN'daki boşlukları temizle
    const cleanIban = iban.replaceAll(" ", "");

    // SEPA QR Code Format (EPC069-12 Standard)
    // Bu QR kod banka uygulaması ile tarandığında otomatik havale formu doldurur
    const sepaData = `BCD
002
1
SCT
${bicSwift}
${holder}
${cleanIban}




`;

    QRCode.toDataURL(sepaData, {
      width: 250,
      margin: 1,
      color: {
        dark: "#1f2937",
        light: "#ffffff",
      },
    }).then((url: string) => {
      setQrDataUrl(url);
    });
  };

  // Download QR Code
  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `KPF-Donation-QR-${Date.now()}.png`;
    link.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://localhost:7189/api/DonatePage");
        if (res.ok) {
          const json: DonatePageData = await res.json();
          setData(json);
          // Generate QR code when data is loaded
          generateSepaQrCode(json.iban, json.bicSwift, json.accountHolder);
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
      <section className="py-12 -mt-4 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item) => (
              <div
                key={item.title}
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
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {lang === "tr" ? "Bağış Seçenekleri" : "Spendenoptionen"}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {lang === "tr"
                ? "Size en uygun ödeme yöntemini seçin"
                : "Wählen Sie die für Sie passende Zahlungsmethode"}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-teal-50/50 p-1.5 rounded-2xl border border-teal-100">
              <button
                onClick={() => setActiveTab("bank")}
                className={`px-8 py-3 rounded-xl text-lg font-bold transition-all ${
                  activeTab === "bank"
                    ? "bg-white text-teal-700 shadow-lg shadow-teal-100/50"
                    : "text-slate-600 hover:text-teal-700"
                }`}
              >
                {lang === "tr" ? "Banka Havalesi" : "Banküberweisung"}
              </button>
              <button
                onClick={() => setActiveTab("paypal")}
                className={`px-8 py-3 rounded-xl text-lg font-bold transition-all ${
                  activeTab === "paypal"
                    ? "bg-white text-teal-700 shadow-lg shadow-teal-100/50"
                    : "text-slate-600 hover:text-teal-700"
                }`}
              >
                PayPal
              </button>
            </div>
          </div>

          {/* Payment Content */}
          <div className="bg-white rounded-3xl border border-teal-100 shadow-2xl shadow-teal-100/30 overflow-hidden">
            {/* Bank Transfer */}
            {activeTab === "bank" && (
              <div className="p-8 md:p-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {lang === "tr" ? "Banka Bilgileri" : "Bankverbindung"}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {lang === "tr"
                          ? "Havale veya EFT yaparak destek olun"
                          : "Unterstützen Sie per Überweisung oder EFT"}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 text-teal-600">
                      <Scan size={20} />
                      <span className="text-sm font-medium">
                        {lang === "tr" ? "Mobil ile tara" : "Mit Handy scannen"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Full Width Instructions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Left Column - Bank Details */}
                  <div className="space-y-6">
                    {/* IBAN - Highlighted */}
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50/50 rounded-2xl p-6 border-2 border-dashed border-teal-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                          IBAN
                        </span>
                        <button
                          onClick={() => copyToClipboard(data.iban)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            copied
                              ? "bg-green-500 text-white"
                              : "bg-white text-teal-700 hover:bg-teal-50 border border-teal-200"
                          }`}
                        >
                          {copied ? (
                            <>
                              <CheckCircle size={16} className="inline mr-2" />
                              {lang === "tr" ? "Kopyalandı" : "Kopiert"}
                            </>
                          ) : (
                            <>
                              <Copy size={16} className="inline mr-2" />
                              {lang === "tr" ? "Kopyala" : "Kopieren"}
                            </>
                          )}
                        </button>
                      </div>
                      <code className="text-ms md:text-1xl font-mono font-bold text-slate-900 tracking-tight block break-all">
                        {data.iban}
                      </code>
                    </div>

                    {/* Other Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          BIC / SWIFT
                        </span>
                        <span className="text-xs md:text-sm font-medium text-slate-700">
                          {data.bicSwift}
                        </span>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          {lang === "tr" ? "ALICI" : "EMPFÄNGER"}
                        </span>
                        <span className="text-xs md:text-sm font-medium text-slate-700">
                          {data.accountHolder}
                        </span>
                      </div>
                    </div>

                    {data.bankName && (
                      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-2">
                          BANK
                        </span>
                        <span className="text-xs md:text-sm font-medium text-slate-800">
                          {data.bankName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-8">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">
                      {lang === "tr" ? "Nasıl Yapılır?" : "Anleitung"}
                    </h4>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {lang === "tr"
                              ? "IBAN'ı kopyalayın"
                              : "IBAN kopieren"}
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {lang === "tr"
                              ? "Yukarıdaki IBAN'ı banka uygulamanıza kopyalayın"
                              : "Kopieren Sie die IBAN in Ihre Banking-App"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {lang === "tr"
                              ? "Havale yapın"
                              : "Überweisung tätigen"}
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {lang === "tr"
                              ? "İstediğiniz tutarı havale/EFT olarak gönderin"
                              : "Senden Sie den gewünschten Betrag per Überweisung"}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {lang === "tr"
                              ? "Onay bekleyin"
                              : "Bestätigung abwarten"}
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {lang === "tr"
                              ? "Bağışınız en geç 2 iş günü içinde onaylanacaktır"
                              : "Ihre Spende wird innerhalb von 2 Werktagen bestätigt"}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column - QR Code */}
                  <div className="bg-gradient-to-b from-teal-50 to-white rounded-2xl p-3 border-2 border-teal-100 shadow-md flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col items-center gap-4">
                      {qrDataUrl ? (
                        <div
                          ref={qrCanvasRef}
                          className="bg-white p-4 rounded-xl border-4 border-teal-200 shadow-lg"
                        >
                          <img
                            src={qrDataUrl}
                            alt="SEPA QR Code"
                            className="w-60 h-60 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-60 h-60 bg-slate-100 rounded-xl border-4 border-teal-200 animate-pulse flex items-center justify-center">
                          <span className="text-slate-500 text-sm">
                            {lang === "tr"
                              ? "QR Kod oluşturuluyor..."
                              : "QR-Code wird erstellt..."}
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <h4 className="font-bold text-slate-900">
                          {lang === "tr" ? "SEPA QR Kod" : "SEPA QR-Code"}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {lang === "tr"
                            ? "Banka uygulamanızla tarayın"
                            : "Mit Ihrer Banking-App scannen"}
                        </p>
                      </div>
                      <button
                        onClick={downloadQrCode}
                        disabled={!qrDataUrl}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                      >
                        <Download size={18} />
                        {lang === "tr"
                          ? "QR Kodu İndir"
                          : "QR-Code Herunterladen"}
                      </button>
                      <div className="w-full flex items-center justify-center gap-1 text-xs text-teal-700 bg-teal-50 rounded-lg py-2 px-3">
                        <ShieldCheck size={14} />
                        <span className="font-medium">
                          {lang === "tr"
                            ? "SEPA Güvenli Standart"
                            : "SEPA Sicherer Standard"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal */}
            {activeTab === "paypal" && (
              <div className="p-8 md:p-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Left Column - PayPal Info */}
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-[#003087] to-[#009cde] rounded-xl text-white">
                        <BanknoteIcon size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {lang === "tr"
                            ? "PayPal ile Güvenli Bağış"
                            : "Sicher Spenden mit PayPal"}
                        </h3>
                        <p className="text-slate-500">
                          {lang === "tr" ? data.contentTr : data.contentDe}
                        </p>
                      </div>
                    </div>

                    <a
                      href={data.payPalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#003087] to-[#009cde] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                    >
                      <span>
                        {lang === "tr"
                          ? "PayPal ile Bağış Yap"
                          : "Mit PayPal spenden"}
                      </span>
                      <ArrowRight
                        className="group-hover:translate-x-2 transition-transform"
                        size={20}
                      />
                    </a>

                    {data.payPalHandle && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl inline-flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-mono text-slate-700">
                          {data.payPalHandle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column - PayPal Benefits */}
                  <div className="lg:w-1/3 bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-2xl p-8 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">
                      {lang === "tr" ? "Avantajlar" : "Vorteile"}
                    </h4>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle
                          className="text-teal-600 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-slate-700">
                          {lang === "tr"
                            ? "Anında işlem onayı"
                            : "Sofortige Transaktionsbestätigung"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle
                          className="text-teal-600 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-slate-700">
                          {lang === "tr"
                            ? "Güvenli ödeme koruması"
                            : "Sicherer Zahlungsschutz"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle
                          className="text-teal-600 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-slate-700">
                          {lang === "tr"
                            ? "Kolay iade imkanı"
                            : "Einfache Rückerstattung"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle
                          className="text-teal-600 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-slate-700">
                          {lang === "tr"
                            ? "Mobil uyumluluk"
                            : "Mobile Kompatibilität"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
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
