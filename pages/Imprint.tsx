import React, { useState, useEffect } from "react";
import {
  FileText,
  MapPin,
  Mail,
  Phone,
  Building2,
  AlertCircle,
} from "lucide-react";
import { Language } from "../types";

interface ImprintProps {
  lang: Language;
}

interface ImprintData {
  organizationName: string;
  organizationType: string;
  address: {
    street: string;
    houseNo: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };

  email: string;
  phone: string;
  president: {
    firstName: string;
    lastName: string;
  };
  vicePresident: {
    firstName: string;
    lastName: string;
  };
  legalStructureTurkish: string;
  legalStructureGerman: string;
  purposeTurkish: string;
  purposeGerman: string;
  taxExemptionTurkish: string;
  taxExemptionGerman: string;
  contentResponsibilityTurkish: string;
  contentResponsibilityGerman: string;
  linksResponsibilityTurkish: string;
  linksResponsibilityGerman: string;
  copyrightTurkish: string;
  copyrightGerman: string;
}

const Imprint: React.FC<ImprintProps> = ({ lang }) => {
  const isGerman = lang === "de";
  const [data, setData] = useState<ImprintData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImprintData();
  }, []);

  const loadImprintData = async () => {
    try {
      const response = await fetch("https://localhost:7189/api/Imprint");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawData = await response.json();

      // Backend'den president/vicePresident string geliyor - parse et
      const parseFullName = (fullName: string) => {
        const parts = (fullName || "").trim().split(" ");
        return {
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        };
      };

      const imprintData: ImprintData = {
        ...rawData,
        president: parseFullName(rawData.president),
        vicePresident: parseFullName(rawData.vicePresident),
      };

      setData(imprintData);
    } catch (error) {
      console.error("Künye yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateImprint = async (updatedData: ImprintData) => {
    try {
      const response = await fetch("https://localhost:7189/api/Imprint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert(isGerman ? "Erfolgreich aktualisiert" : "Başarıyla güncellendi");
      setData(updatedData); // local state güncelle
    } catch (error) {
      console.error("Imprint güncellenemedi:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kpf-red mx-auto mb-4"></div>
          <p className="text-slate-600">
            {isGerman ? "Lädt..." : "Yükleniyor..."}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-600">
          <AlertCircle size={48} className="mx-auto mb-4 text-kpf-red" />
          <p>
            {isGerman
              ? "Daten konnten nicht geladen werden"
              : "Veriler yüklenemedi"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-red to-red-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <FileText size={200} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Building2 className="text-white" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              {isGerman ? "Impressum" : "Künye"}
            </h1>
          </div>
          <div className="w-24 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Organization Info */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <Building2 size={24} className="text-kpf-red" />
              {isGerman ? "Informationen zum Betreiber" : "Kuruluş Bilgileri"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <p className="font-bold text-lg mb-2">
                  {data.organizationName}
                </p>
                <p className="text-sm text-slate-600">
                  {data.organizationType}
                </p>
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <MapPin size={24} className="text-kpf-red" />
              {isGerman ? "Adresse" : "Adres"}
            </h2>
            <div className="bg-white p-8 rounded-2xl border-2 border-kpf-red/20 space-y-4">
              <div className="text-slate-700">
                <p className="font-bold mb-2">{data.organizationName}</p>
                {data.address && (
                  <>
                    <p>
                      {data.address.street} {data.address.houseNo}
                    </p>
                    <p>
                      {data.address.zipCode} {data.address.city}
                    </p>
                    {data.address.state && <p>{data.address.state}</p>}
                    <p>{data.address.country}</p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <Mail size={24} className="text-kpf-red" />
              {isGerman ? "Kontaktinformation" : "İletişim Bilgileri"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-kpf-red/20">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-kpf-red" />
                  E-Mail
                </h3>
                <a
                  href={`mailto:${data.email}`}
                  className="text-kpf-teal hover:text-kpf-teal/80 font-medium"
                >
                  {data.email}
                </a>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-kpf-red/20">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Phone size={18} className="text-kpf-red" />
                  {isGerman ? "Telefon" : "Telefon"}
                </h3>
                {data.phone && (
                  <a
                    href={`tel:${data.phone.replace(/\s/g, "")}`}
                    className="text-kpf-teal hover:text-kpf-teal/80 font-medium"
                  >
                    {data.phone}
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Responsible Persons */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Verantwortliche Personen" : "Sorumlu Kişiler"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.president && (
                <div className="bg-kpf-teal/10 p-6 rounded-2xl border border-kpf-teal/20">
                  <p className="font-bold text-lg text-slate-800 mb-2">
                    {isGerman ? "Vorsitzender:" : "Başkan:"}
                  </p>
                  <p className="text-slate-700">
                    {data.president.firstName} {data.president.lastName}
                  </p>
                </div>
              )}
              {data.vicePresident && (
                <div className="bg-kpf-teal/10 p-6 rounded-2xl border border-kpf-teal/20">
                  <p className="font-bold text-lg text-slate-800 mb-2">
                    {isGerman ? "Ko-Vorsitzender:" : "Ko-Başkan:"}
                  </p>
                  <p className="text-slate-700">
                    {data.vicePresident.firstName} {data.vicePresident.lastName}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Legal Structure */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Rechtsform und Zweck" : "Yasal Yapı ve Amaç"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <p className="font-bold mb-2">
                  {isGerman ? "Rechtsform:" : "Yasal Yapı:"}
                </p>
                <p>
                  {isGerman
                    ? data.legalStructureGerman
                    : data.legalStructureTurkish}
                </p>
              </div>
              <div>
                <p className="font-bold mb-2">
                  {isGerman ? "Gemeinnütziger Zweck:" : "Kamu Yararına Amaç:"}
                </p>
                <p>{isGerman ? data.purposeGerman : data.purposeTurkish}</p>
              </div>
              <div>
                <p className="font-bold mb-2">
                  {isGerman
                    ? "Gemeinnütziger Status:"
                    : "Vergi Muafiyeti Durumu:"}
                </p>
                <p>
                  {isGerman
                    ? data.taxExemptionGerman
                    : data.taxExemptionTurkish}
                </p>
              </div>
            </div>
          </section>

          {/* Content Responsibility */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <AlertCircle size={24} className="text-kpf-red" />
              {isGerman ? "Verantwortung für Inhalte" : "İçerik Sorumluluğu"}
            </h2>
            <div className="bg-white p-8 rounded-2xl border-2 border-kpf-red/20 space-y-4 text-slate-700 whitespace-pre-wrap">
              {isGerman
                ? data.contentResponsibilityGerman
                : data.contentResponsibilityTurkish}
            </div>
          </section>

          {/* Liability for Links */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Haftung für Links" : "Bağlantılar İçin Sorumluluk"}
            </h2>
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 text-slate-700 whitespace-pre-wrap">
              {isGerman
                ? data.linksResponsibilityGerman
                : data.linksResponsibilityTurkish}
            </div>
          </section>

          {/* Copyright */}
          <section className="bg-kpf-red/10 p-8 rounded-2xl border border-kpf-red/20">
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Urheberrecht" : "Telif Hakkı"}
            </h2>
            <div className="text-slate-700 whitespace-pre-wrap">
              {isGerman ? data.copyrightGerman : data.copyrightTurkish}
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-200">
            <p>
              {isGerman ? "Zuletzt aktualisiert:" : "Son Güncelleme:"}{" "}
              {new Date().toLocaleDateString(isGerman ? "de-DE" : "tr-TR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
