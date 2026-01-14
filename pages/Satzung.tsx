import React, { useEffect, useState } from "react";
import { FileText, BookOpen, Users, Shield, Building2 } from "lucide-react";
import { Language } from "../types";
import { apiFetch } from "../services/api";

interface SatzungProps {
  lang: Language;
}

// Backend DTO yapısı
interface SectionContent {
  heading: string;
  bodyTurkish: string;
  bodyGerman: string;
}

interface Purpose {
  letter: string;
  content: SectionContent;
}

interface MembershipDetail {
  type: SectionContent;
  descriptionTurkish: SectionContent;
  descriptionGerman: SectionContent;
}

interface SatzungDto {
  key: string;
  titleTurkish: string;
  titleGerman: string;
  nameAndSeatTurkish: SectionContent;
  nameAndSeatGerman: SectionContent;
  nameDescTurkish: SectionContent;
  nameDescGerman: SectionContent;
  seatTurkish: SectionContent;
  seatGerman: SectionContent;
  seatDescTurkish: SectionContent;
  seatDescGerman: SectionContent;
  fiscalYearTurkish: SectionContent;
  fiscalYearGerman: SectionContent;
  fiscalYearDescTurkish: SectionContent;
  fiscalYearDescGerman: SectionContent;
  purposeOfAssociationTurkish: SectionContent;
  purposeOfAssociationGerman: SectionContent;
  purposes: Purpose[];
  gemeinnuetzigkeitTurkish: SectionContent;
  gemeinnuetzigkeitGerman: SectionContent;
  politicalNeutralityTurkish: SectionContent;
  politicalNeutralityGerman: SectionContent;
  memberships: MembershipDetail[];
  updatedAt: string;
}

const Satzung: React.FC<SatzungProps> = ({ lang }) => {
  const isGerman = lang === "de";
  const [data, setData] = useState<SatzungDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSatzung = async () => {
      setLoading(true);
      try {
        // apiFetch ile çağır, endpoint başında / olmalı
        const result = await apiFetch<SatzungDto[] | SatzungDto>("/Satzung");
        // Eğer dizi dönerse ilk elemanı al
        if (Array.isArray(result)) {
          setData(result[0] || null);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch Satzung:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSatzung();
  }, []);

  const getText = (content?: SectionContent): string => {
    if (!content) return "";
    return isGerman ? content.bodyGerman : content.bodyTurkish;
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
          {isGerman ? "Fehler beim Laden der Satzung" : "Tüzük yüklenemedi"}
        </p>
      </div>
    );
  }

  const title = isGerman ? data.titleGerman : data.titleTurkish;

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Imprint.tsx tarzında */}
      <div className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <FileText size={200} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="text-white" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              {title}
            </h1>
          </div>
          <div className="w-24 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* İçerik Bölümleri */}
        <div className="space-y-8">
          {/* 1. Name und Sitz */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-kpf-teal">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-kpf-teal text-white text-lg font-bold"></span>
              {(isGerman
                ? data.nameAndSeatGerman?.heading
                : data.nameAndSeatTurkish?.heading) || ""}
            </h2>
            <div className="space-y-4">
              {/* Name Description */}
              {(
                (isGerman
                  ? data.nameDescGerman?.heading
                  : data.nameDescTurkish?.heading) || ""
              ).length > 0 && (
                <h3 className="font-semibold text-slate-700 mb-2">
                  {(isGerman
                    ? data.nameDescGerman?.heading
                    : data.nameDescTurkish?.heading) || ""}
                </h3>
              )}
              <p className="text-slate-700 leading-relaxed">
                {isGerman
                  ? getText(data.nameDescGerman)
                  : getText(data.nameDescTurkish)}
              </p>
              {/* Seat */}
              {(
                (isGerman
                  ? data.seatGerman?.heading
                  : data.seatTurkish?.heading) || ""
              ).length > 0 && (
                <h3 className="font-semibold text-slate-700 mb-2">
                  {(isGerman
                    ? data.seatGerman?.heading
                    : data.seatTurkish?.heading) || ""}
                </h3>
              )}
              <p className="text-slate-700 leading-relaxed">
                {isGerman
                  ? getText(data.seatGerman)
                  : getText(data.seatTurkish)}
              </p>
              {/* Seat Description sadece farklıysa göster */}
              {getText(data.seatDescGerman) !== getText(data.seatGerman) &&
                getText(data.seatDescTurkish) !== getText(data.seatTurkish) && (
                  <p className="text-slate-600 mt-2">
                    {isGerman
                      ? getText(data.seatDescGerman)
                      : getText(data.seatDescTurkish)}
                  </p>
                )}
              {/* Fiscal Year */}
              {(
                (isGerman
                  ? data.fiscalYearGerman?.heading
                  : data.fiscalYearTurkish?.heading) || ""
              ).length > 0 && (
                <h3 className="font-semibold text-slate-700 mb-2">
                  {(isGerman
                    ? data.fiscalYearGerman?.heading
                    : data.fiscalYearTurkish?.heading) || ""}
                </h3>
              )}
              <p className="text-slate-700 leading-relaxed">
                {isGerman
                  ? getText(data.fiscalYearDescGerman)
                  : getText(data.fiscalYearDescTurkish)}
              </p>
            </div>
          </div>

          {/* 2. Zweck */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-kpf-teal">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <BookOpen className="text-kpf-teal" size={28} />
              {(isGerman
                ? data.purposeOfAssociationGerman?.heading
                : data.purposeOfAssociationTurkish?.heading) || ""}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              {isGerman
                ? getText(data.purposeOfAssociationGerman)
                : getText(data.purposeOfAssociationTurkish)}
            </p>
            <div className="space-y-3">
              {Array.isArray(data.purposes) && data.purposes.length > 0 ? (
                data.purposes.map((purpose) => (
                  <div key={purpose.letter} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-kpf-teal text-white flex items-center justify-center font-bold">
                      {purpose.letter}
                    </span>
                    <p className="text-slate-700 leading-relaxed flex-1">
                      {getText(purpose?.content)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">
                  {isGerman ? "Keine Zwecke vorhanden" : "Amaç yok"}
                </p>
              )}
            </div>
          </div>

          {/* 3. Gemeinnützigkeit */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <Shield className="text-green-600" size={28} />
              {(isGerman
                ? data.gemeinnuetzigkeitGerman?.heading
                : data.gemeinnuetzigkeitTurkish?.heading) || ""}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {isGerman
                ? getText(data.gemeinnuetzigkeitGerman)
                : getText(data.gemeinnuetzigkeitTurkish)}
            </p>
          </div>

          {/* 4. Politische Neutralität */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <Shield className="text-blue-600" size={28} />
              {(isGerman
                ? data.politicalNeutralityGerman?.heading
                : data.politicalNeutralityTurkish?.heading) || ""}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {isGerman
                ? getText(data.politicalNeutralityGerman)
                : getText(data.politicalNeutralityTurkish)}
            </p>
          </div>

          {/* 5. Mitgliedschaft */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <Users className="text-purple-600" size={28} />
              {isGerman ? "Mitgliedschaft" : "Üyelik"}
            </h2>
            <div className="space-y-6">
              {Array.isArray(data.memberships) &&
              data.memberships.length > 0 ? (
                data.memberships.map((membership, idx) => (
                  <div key={idx} className="border-l-2 border-purple-300 pl-4">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {getText(membership.type)}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {isGerman
                        ? getText(membership.descriptionGerman)
                        : getText(membership.descriptionTurkish)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">
                  {isGerman ? "Keine Mitglieder" : "Üye yok"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-slate-600">
          <p>
            {isGerman
              ? "Die Satzung wird regelmäßig aktualisiert und überprüft."
              : "Tüzük düzenli olarak güncellenir ve gözden geçirilir."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Satzung;
