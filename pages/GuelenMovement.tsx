import React, { useEffect, useState } from "react";
import { Heart, Globe } from "lucide-react";
import { Language } from "../types";

interface GuelenMovementData {
  id: string;
  titleTr: string;
  titleDe: string;
  introductionTr: string;
  introductionDe: string;
  imageUrl: string;
  philosophyTitleTr: string;
  philosophyTitleDe: string;
  philosophyContentTr: string;
  philosophyContentDe: string;
  dialogTitleTr: string;
  dialogTitleDe: string;
  dialogContentTr: string;
  dialogContentDe: string;
  networkTitleTr: string;
  networkTitleDe: string;
  networkContentTr: string;
  networkContentDe: string;
  spiritualTitleTr: string;
  spiritualTitleDe: string;
  spiritualContentTr: string;
  spiritualContentDe: string;
  visionTitleTr: string;
  visionTitleDe: string;
  visionContentTr: string;
  visionContentDe: string;
}

interface GuelenMovementProps {
  lang: Language;
}

const GuelenMovement: React.FC<GuelenMovementProps> = ({ lang }) => {
  const isGerman = lang === "de";
  const [data, setData] = useState<GuelenMovementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://localhost:7189/api/GuelenMovement",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result[0]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-kpf-teal"></div>
          <p className="mt-4 text-slate-600">
            {isGerman ? "Wird geladen..." : "Yükleniyor..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>
            {isGerman
              ? `Fehler beim Laden der Daten: ${error}`
              : `Verileri yüklerken hata: ${error}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        .html-content {
          color: #475569;
          font-size: 1rem;
        }
        .html-content p {
          display: block !important;
          margin: 0 0 1.5rem 0 !important;
          line-height: 1.75 !important;
          color: inherit !important;
          padding: 0 !important;
        }
        .html-content p:last-child {
          margin-bottom: 0 !important;
        }
        .html-content strong, .html-content b {
          font-weight: 700 !important;
        }
        .html-content em, .html-content i {
          font-style: italic !important;
        }
        .html-content u {
          text-decoration: underline !important;
        }
        .html-content ol, .html-content ul {
          margin-left: 1.5rem !important;
          margin-bottom: 1rem !important;
          display: block !important;
          padding: 0 !important;
        }
        .html-content li {
          display: list-item !important;
          margin-bottom: 0.5rem !important;
          margin-left: 0 !important;
        }
      `}</style>
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Globe size={300} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="text-white" size={40} />
            <h1 className="text-3xl md:text-5xl font-serif font-bold">
              {isGerman ? data.titleDe : data.titleTr}
            </h1>
          </div>
          <div
            className="text-teal-100 text-lg html-content"
            style={{
              color: "#D1FAE5",
            }}
            dangerouslySetInnerHTML={{
              __html: isGerman ? data.introductionDe : data.introductionTr,
            }}
          />
          <div className="w-24 h-1.5 bg-white/30 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Introduction */}
          <section className="bg-gradient-to-br from-kpf-teal/5 to-teal-100/10 p-8 rounded-2xl border-l-4 border-kpf-teal">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman ? data.philosophyTitleDe : data.philosophyTitleTr}
            </h2>
            <div
              className="space-y-4 text-slate-700 leading-relaxed html-content"
              dangerouslySetInnerHTML={{
                __html: isGerman
                  ? data.philosophyContentDe
                  : data.philosophyContentTr,
              }}
            />
          </section>

          {/* Dialog */}
          <section className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-2xl border-l-4 border-violet-500">
            <h2 className="text-3xl font-bold text-kpf-dark">
              {isGerman ? data.dialogTitleDe : data.dialogTitleTr}
            </h2>
            <div
              className="space-y-4 text-slate-700 leading-relaxed html-content"
              dangerouslySetInnerHTML={{
                __html: isGerman ? data.dialogContentDe : data.dialogContentTr,
              }}
            />
          </section>

          {/* Network */}
          <section className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border-l-4 border-kpf-red">
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman ? data.networkTitleDe : data.networkTitleTr}
            </h2>
            <div
              className="text-slate-700 leading-relaxed html-content"
              dangerouslySetInnerHTML={{
                __html: isGerman
                  ? data.networkContentDe
                  : data.networkContentTr,
              }}
            />
          </section>

          {/* Spiritual */}
          <section className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-l-4 border-blue-500">
            <h2 className="text-3xl font-bold text-kpf-dark mb-8">
              {isGerman ? data.spiritualTitleDe : data.spiritualTitleTr}
            </h2>
            <div
              className="space-y-6 text-slate-700 leading-relaxed html-content"
              dangerouslySetInnerHTML={{
                __html: isGerman
                  ? data.spiritualContentDe
                  : data.spiritualContentTr,
              }}
            />
          </section>

          {/* Vision */}
          <section className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-l-4 border-green-500">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman ? data.visionTitleDe : data.visionTitleTr}
            </h2>
            <div
              className="space-y-6 text-slate-700 leading-relaxed html-content"
              dangerouslySetInnerHTML={{
                __html: isGerman ? data.visionContentDe : data.visionContentTr,
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default GuelenMovement;
