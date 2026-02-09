import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  Users,
  Handshake,
  TrendingUp,
  Mail,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  newsletterAdminApi,
  NewsletterStats,
} from "../../services/newsletterApi";

interface DashboardStats {
  totalActivities: number;
  activeActivities: number;
  upcomingActivities: number;
  totalCourses: number;
  activeCourses: number;
  totalPartners: number;
  activePartners: number;
  totalTeamMembers: number;
  activeTeamMembers: number;
  totalValueItems: number;
  activeValueItems: number;
  totalVolunteerSubmissions: number;
  totalAdmins: number;
  activeAdmins: number;
  lastUpdated: string;
}

interface RecentSubmission {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  message: string;
  submittedAt: string;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

// Newsletter Stats Widget Component
const NewsletterStatsWidget: React.FC<{
  onNavigate: (page: string) => void;
}> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          setAuthError(true);
          setStats({
            totalSubscribers: 0,
            activeSubscribers: 0,
            verifiedSubscribers: 0,
            unsubscribedCount: 0,
            totalCampaignsSent: 0,
            totalEmailsSent: 0,
          });
          setLoading(false);
          return;
        }

        const data = await newsletterAdminApi.getStats();
        setStats(data);
        setAuthError(false);
      } catch (error) {
        console.error("Failed to fetch newsletter stats:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);

        if (errorMsg.includes("403") || errorMsg.includes("401")) {
          setAuthError(true);
        }

        // Set default stats on error
        setStats({
          totalSubscribers: 0,
          activeSubscribers: 0,
          verifiedSubscribers: 0,
          unsubscribedCount: 0,
          totalCampaignsSent: 0,
          totalEmailsSent: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-kpf-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-kpf-teal/10 p-3 rounded-lg">
            <Mail size={24} className="text-kpf-teal" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Newsletter</h2>
            <p className="text-slate-600 text-sm">
              {stats
                ? t("newsletter.admin.menu.subscribers")
                : "Newsletter Management"}
            </p>
            {authError && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Authentication required - stats unavailable
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onNavigate("newsletter-subscribers")}
          className="bg-kpf-teal hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          {t("common.edit")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <p className="text-slate-600 text-xs font-medium">
              {stats
                ? t("newsletter.admin.stats.totalSubscribers")
                : "Total Subscribers"}
            </p>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats?.totalSubscribers ?? 0}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-slate-600 text-xs font-medium">
              {stats
                ? t("newsletter.admin.stats.activeSubscribers")
                : "Active Subscribers"}
            </p>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats?.activeSubscribers ?? 0}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Send size={16} className="text-purple-600" />
            <p className="text-slate-600 text-xs font-medium">
              {stats
                ? t("newsletter.admin.stats.campaignsSent")
                : "Campaigns Sent"}
            </p>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats?.totalCampaignsSent ?? 0}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-orange-600" />
            <p className="text-slate-600 text-xs font-medium">
              {stats
                ? t("newsletter.admin.stats.totalEmailsSent")
                : "Total Emails"}
            </p>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {stats?.totalEmailsSent ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7189/api";

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    activeActivities: 0,
    upcomingActivities: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalPartners: 0,
    activePartners: 0,
    totalTeamMembers: 0,
    activeTeamMembers: 0,
    totalValueItems: 0,
    activeValueItems: 0,
    totalVolunteerSubmissions: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    lastUpdated: "",
  });
  const [recentSubmissions, setRecentSubmissions] = useState<
    RecentSubmission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE_URL}/Dashboard/overview`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setError("UNAUTHORIZED");
        return;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          text
            ? `HTTP ${response.status}: ${text}`
            : `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as {
        stats?: DashboardStats;
        recentSubmissions?: RecentSubmission[];
      };

      if (!data?.stats) {
        throw new Error("Dashboard response missing 'stats'");
      }

      setStats(data.stats);
      setRecentSubmissions(data.recentSubmissions || []);
    } catch (error) {
      console.error("Dashboard verisi yüklenirken hata:", error);
      setError(
        error instanceof Error ? error.message : t("admin_error_occurred"),
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t("admin_stats_activities"),
      value: stats.totalActivities,
      subText: `${stats.activeActivities} ${t("admin_active")}`,
      icon: Calendar,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: t("admin_stats_courses"),
      value: stats.totalCourses,
      subText: `${stats.activeCourses} ${t("admin_active")}`,
      icon: GraduationCap,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: t("admin_stats_team"),
      value: stats.totalTeamMembers,
      subText: `${stats.activeTeamMembers} ${t("admin_active")}`,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: t("admin_stats_partners"),
      value: stats.totalPartners,
      subText: `${stats.activePartners} ${t("admin_active")}`,
      icon: Handshake,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: t("admin_stats_volunteers"),
      value: stats.totalVolunteerSubmissions,
      subText: t("admin_application"),
      icon: TrendingUp,
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-teal"></div>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = error === "UNAUTHORIZED";

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800">
          {t("admin_error_occurred")}
        </h2>
        <p className="text-slate-600 mt-2">
          {isUnauthorized ? t("admin_login_error") : error}
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => void loadDashboardData()}
            className="px-4 py-3 bg-kpf-teal text-white rounded-lg hover:bg-teal-700 font-bold"
          >
            {t("admin_login")}
          </button>
          {isUnauthorized && (
            <button
              onClick={() => globalThis.location.reload()}
              className="px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-bold"
            >
              Reload
            </button>
          )}
          <button
            onClick={() => onNavigate("dashboard")}
            className="px-4 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-bold"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {t("admin_dashboard_title")}
        </h1>
        <p className="text-sm text-slate-600">
          {t("admin_dashboard_subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`${stat.bgColor} ${stat.textColor} p-2 rounded-lg`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <h3 className="text-slate-600 text-xs font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              {stat.subText && (
                <p className="text-xs text-slate-500 mt-1">{stat.subText}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Newsletter Stats Widget */}
      <NewsletterStatsWidget onNavigate={onNavigate} />

      {/* Recent Submissions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-kpf-teal/10 p-2 rounded-lg">
            <Mail className="text-kpf-teal" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {t("admin_recent_submissions")}
            </h2>
            <p className="text-xs text-slate-600">
              {recentSubmissions.length} {t("admin_application")}
            </p>
          </div>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Mail className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="text-slate-500 text-sm">
              {t("admin_no_submissions")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSubmissions.slice(0, 3).map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg hover:border-kpf-teal/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-kpf-teal/10 p-2 rounded-lg group-hover:bg-kpf-teal/20 transition-colors">
                    <Mail className="text-kpf-teal" size={16} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={10} />
                    <span>
                      {new Date(submission.submittedAt).toLocaleDateString(
                        i18n.resolvedLanguage === "de" ? "de-DE" : "tr-TR",
                        { day: "2-digit", month: "2-digit", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-800 mb-2 group-hover:text-kpf-teal transition-colors">
                  {submission.fullName}
                </h3>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{submission.email}</span>
                  </div>
                  {submission.phoneNumber && (
                    <div className="text-xs text-slate-600">
                      📞 {submission.phoneNumber}
                    </div>
                  )}
                </div>

                {submission.message && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {submission.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate("activities")}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Calendar size={24} className="mb-2" />
          <h3 className="font-semibold text-sm">{t("admin_new_activity")}</h3>
        </button>
        <button
          onClick={() => onNavigate("courses")}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <GraduationCap size={24} className="mb-2" />
          <h3 className="font-semibold text-sm">{t("admin_new_course")}</h3>
        </button>
        <button
          onClick={() => onNavigate("team")}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Users size={24} className="mb-2" />
          <h3 className="font-semibold text-sm">
            {t("admin_add_team_member")}
          </h3>
        </button>
        <button
          onClick={() => onNavigate("partners")}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Handshake size={24} className="mb-2" />
          <h3 className="font-semibold text-sm">{t("admin_add_partner")}</h3>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
