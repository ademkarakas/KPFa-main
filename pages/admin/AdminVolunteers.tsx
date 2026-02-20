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

interface VolunteerSubmission {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  submittedAt: string;
}

const AdminVolunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<VolunteerSubmission | null>(null);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data: VolunteerSubmission[] = await volunteersApi.getAll();
      // Tarihe göre sırala (en yeni önce)
      const sorted = [...data].sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      });
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
      (v.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (v.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (v.message?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(
        language === "de" ? "de-DE" : "tr-TR",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-teal"></div>
      </div>
    );
  }

  const pageTitle = t("admin_volunteers_title");
  const pageSubtitle = `${t("admin_volunteers_total")}: ${volunteers.length}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{pageTitle}</h1>
        <p className="text-slate-600">{pageSubtitle}</p>
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
          placeholder={t("admin_volunteers_search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  {t("admin_volunteers_label_fullname")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  {t("admin_volunteers_label_email")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  {t("admin_volunteers_label_phone")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  {t("admin_volunteers_message_title")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                  {t("admin_volunteers_label_date")}
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                  {language === "de" ? "Aktionen" : "İşlemler"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <UserCheck
                      size={64}
                      className="mx-auto mb-4 opacity-20 text-slate-400"
                    />
                    <p className="text-lg font-semibold text-slate-500">
                      {searchQuery
                        ? t("admin_volunteers_no_results")
                        : t("admin_volunteers_no_submissions")}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((volunteer) => {
                  const initials =
                    (volunteer.fullName || "?")
                      .split(" ")
                      .map((n: string) => n[0] || "")
                      .filter(Boolean)
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "??";

                  return (
                    <tr
                      key={volunteer.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedVolunteer(volunteer)}
                    >
                      {/* Name with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kpf-teal to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {initials}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {volunteer.fullName || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail
                            size={14}
                            className="text-kpf-teal flex-shrink-0"
                          />
                          <span className="text-sm truncate max-w-[200px]">
                            {volunteer.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        {volunteer.phone ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone
                              size={14}
                              className="text-green-600 flex-shrink-0"
                            />
                            <span className="text-sm">{volunteer.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="px-6 py-4">
                        {volunteer.message ? (
                          <div className="flex items-center gap-2">
                            <MessageSquare
                              size={14}
                              className="text-slate-400 flex-shrink-0"
                            />
                            <span className="text-sm text-slate-600 truncate max-w-[250px]">
                              {volunteer.message}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} />
                          <span className="text-sm whitespace-nowrap">
                            {formatDate(volunteer.submittedAt || "")}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              globalThis.location.href = `mailto:${volunteer.email}`;
                            }}
                            className="p-2 text-kpf-teal hover:bg-kpf-teal/10 rounded-lg transition-colors"
                            title={t("admin_volunteers_send_email")}
                          >
                            <Mail size={18} />
                          </button>
                          {volunteer.phone && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                globalThis.location.href = `tel:${volunteer.phone}`;
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={t("admin_volunteers_call")}
                            >
                              <Phone size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {t("admin_volunteers_details_title")}
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
                  {t("admin_volunteers_person_info")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">
                        {t("admin_volunteers_label_fullname")}
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedVolunteer.fullName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-slate-400" size={20} />
                    <div>
                      <p className="text-sm text-slate-500">
                        {t("admin_volunteers_label_email")}
                      </p>
                      <a
                        href={`mailto:${selectedVolunteer.email || ""}`}
                        className="font-semibold text-kpf-teal hover:underline"
                      >
                        {selectedVolunteer.email || "N/A"}
                      </a>
                    </div>
                  </div>
                  {selectedVolunteer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-slate-400" size={20} />
                      <div>
                        <p className="text-sm text-slate-500">
                          {t("admin_volunteers_label_phone")}
                        </p>
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
                      <p className="text-sm text-slate-500">
                        {t("admin_volunteers_label_date")}
                      </p>
                      <p className="font-semibold text-slate-800">
                        {formatDate(selectedVolunteer.submittedAt || "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mesaj */}
              {selectedVolunteer.message && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">
                    {t("admin_volunteers_message_title")}
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
                  href={`mailto:${selectedVolunteer.email || ""}?subject=${encodeURIComponent(
                    t("admin_volunteers_email_subject"),
                  )}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-teal-700 transition-all font-semibold"
                >
                  <Mail size={20} />
                  {t("admin_volunteers_send_email")}
                </a>
                {selectedVolunteer.phone && (
                  <a
                    href={`tel:${selectedVolunteer.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
                  >
                    <Phone size={20} />
                    {t("admin_volunteers_call")}
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
