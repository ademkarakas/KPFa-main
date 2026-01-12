import React, { useState, useEffect } from "react";

import {
  UserCheck,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Search,
} from "lucide-react";
import { volunteersApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
// VolunteerData tipi ve fetch fonksiyonu
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

const AdminVolunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
  const [volunteerPage, setVolunteerPage] = useState<VolunteerData | null>(
    null
  );
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  useEffect(() => {
    loadVolunteers();
    fetchVolunteerPage();
  }, []);

  // Volunteer sayfa başlığı ve açıklaması için fetch
  const fetchVolunteerPage = async () => {
    try {
      const res = await fetch(
        "https://localhost:7189/api/ValueItems/6620cb16-c787-486c-920a-6d559d12a6fa"
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json: VolunteerData = await res.json();
      setVolunteerPage(json);
    } catch (err) {
      setVolunteerPage(null);
    }
  };

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await volunteersApi.getAll();
      // Tarihe göre sırala (en yeni önce)
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setVolunteers(sorted);
    } catch (error: any) {
      console.error("Gönüllü başvuruları yüklenirken hata:", error);
      console.error("Hata detayı:", error.message);
      setVolunteers([]); // Boş array set et
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.interests.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {volunteerPage
            ? language === "de"
              ? volunteerPage.titleDe
              : volunteerPage.titleTr
            : t("admin_volunteers_title")}
        </h1>
        <p className="text-slate-600">
          {volunteerPage
            ? language === "de"
              ? volunteerPage.subtitleDe
              : volunteerPage.subtitleTr
            : t("admin_volunteers_total") + ": " + volunteers.length}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          {t("admin_volunteers_total")}: {volunteers.length}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Başvuru ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Volunteers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVolunteers.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500">
            {searchQuery
              ? "Aramanıza uygun başvuru bulunamadı."
              : "Henüz başvuru bulunmamaktadır."}
          </div>
        ) : (
          filteredVolunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedVolunteer(volunteer)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-kpf-teal/10 rounded-lg">
                    <UserCheck className="text-kpf-teal" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {volunteer.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={14} />
                      <span>{formatDate(volunteer.submittedAt)}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {volunteer.interests}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} />
                  <span>{volunteer.email}</span>
                </div>
                {volunteer.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    <span>{volunteer.phone}</span>
                  </div>
                )}
                {volunteer.message && (
                  <div className="flex items-start gap-2 text-slate-600 mt-3">
                    <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{volunteer.message}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Başvuru Detayları
              </h2>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Kişi Bilgileri */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Kişi Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">Ad Soyad</p>
                      <p className="font-semibold text-slate-800">
                        {selectedVolunteer.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">E-Mail</p>
                      <a
                        href={`mailto:${selectedVolunteer.email}`}
                        className="font-semibold text-kpf-teal hover:underline"
                      >
                        {selectedVolunteer.email}
                      </a>
                    </div>
                  </div>
                  {selectedVolunteer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-slate-400" size={20} />
                      <div>
                        <p className="text-sm text-slate-500">Telefon</p>
                        <a
                          href={`tel:${selectedVolunteer.phone}`}
                          className="font-semibold text-kpf-teal hover:underline"
                        >
                          {selectedVolunteer.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">Başvuru Tarihi</p>
                      <p className="font-semibold text-slate-800">
                        {formatDate(selectedVolunteer.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* İlgi Alanı */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  İlgi Alanı
                </h3>
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg">
                  {selectedVolunteer.interests}
                </span>
              </div>

              {/* Mesaj */}
              {selectedVolunteer.message && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">
                    Mesaj
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {selectedVolunteer.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t flex gap-3">
                <a
                  href={`mailto:${selectedVolunteer.email}?subject=KPF Gönüllülük Başvurusu`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-teal-700 transition-all font-semibold"
                >
                  <Mail size={20} />
                  E-Mail Gönder
                </a>
                {selectedVolunteer.phone && (
                  <a
                    href={`tel:${selectedVolunteer.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
                  >
                    <Phone size={20} />
                    Ara
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteers;
