import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  CheckCircle,
  Mail,
  Calendar,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  newsletterAdminApi,
  NewsletterSubscriber,
} from "../../services/newsletterApi";

const AdminNewsletterSubscribers: React.FC = () => {
  const { t } = useTranslation();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<
    NewsletterSubscriber[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    // Filter subscribers based on search query
    if (searchQuery.trim() === "") {
      setFilteredSubscribers(subscribers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = subscribers.filter(
        (sub) =>
          sub.email.toLowerCase().includes(query) ||
          sub.fullName?.toLowerCase().includes(query),
      );
      setFilteredSubscribers(filtered);
    }
  }, [searchQuery, subscribers]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      // Check if token exists
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.warn("No admin token found for newsletter subscribers");
        setLoading(false);
        return;
      }

      const data = await newsletterAdminApi.getSubscribers();
      setSubscribers(data);
      setFilteredSubscribers(data);

      // Calculate stats
      const total = data.length;
      const active = data.filter((s) => s.isActive).length;
      const verified = data.filter((s) => s.isVerified).length;
      setStats({ total, active, verified });
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("403") || errorMsg.includes("401")) {
        console.error("Authentication failed - please login again");
        // Could show a toast here if needed
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Email", "Name", "Status", "Verified", "Subscribed At"];
    const rows = filteredSubscribers.map((sub) => [
      sub.email,
      sub.fullName || "",
      sub.isActive ? "Active" : "Inactive",
      sub.isVerified ? "Yes" : "No",
      new Date(sub.subscribedAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-teal"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("newsletter.admin.subscribers.pageTitle")}
        </h1>
        <p className="text-slate-600">
          {t("newsletter.admin.menu.subscribers")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-kpf-teal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">
                {t("newsletter.admin.subscribers.totalSubscribers")}
              </p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <Users className="text-kpf-teal" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-green-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">
                {t("newsletter.admin.subscribers.activeSubscribers")}
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">
                {t("newsletter.admin.subscribers.verifiedSubscribers")}
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.verified}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("newsletter.admin.subscribers.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download size={18} />
            {t("newsletter.admin.subscribers.exportCsv")}
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredSubscribers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-600 text-lg">
              {searchQuery
                ? "No subscribers found"
                : t("newsletter.admin.subscribers.noSubscribers")}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {t("newsletter.admin.subscribers.email")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {t("newsletter.admin.subscribers.name")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {t("newsletter.admin.subscribers.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {t("newsletter.admin.subscribers.subscribedAt")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {t("newsletter.admin.subscribers.source")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="text-slate-400" size={16} />
                          <span className="text-sm text-slate-800">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {subscriber.fullName || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {subscriber.isActive ? (
                            <>
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                                {t("newsletter.admin.subscribers.active")}
                              </span>
                              {subscriber.isVerified && (
                                <CheckCircle
                                  className="text-green-600"
                                  size={16}
                                />
                              )}
                            </>
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                              {t("newsletter.admin.subscribers.inactive")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          {formatDate(subscriber.subscribedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-slate-500 uppercase">
                          {subscriber.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="p-4 hover:bg-slate-50 transition-all"
                >
                  {/* Email Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Mail className="text-kpf-teal flex-shrink-0" size={16} />
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {subscriber.email}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5">
                      {subscriber.isActive ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          {t("newsletter.admin.subscribers.active")}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {t("newsletter.admin.subscribers.inactive")}
                        </span>
                      )}
                      {subscriber.isVerified && (
                        <CheckCircle className="text-green-600" size={16} />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-slate-600">
                    {subscriber.fullName && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {subscriber.fullName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-xs">
                        {formatDate(subscriber.subscribedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase">
                        {subscriber.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletterSubscribers;
