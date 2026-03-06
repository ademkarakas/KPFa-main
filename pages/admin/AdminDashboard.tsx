import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  Users,
  Handshake,
  TrendingUp,
  Mail,
  Send,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  newsletterAdminApi,
  NewsletterStats,
} from "../../services/newsletterApi";
import { API_BASE_URL } from "../../services/api";

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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-kpf-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-kpf-teal/10 p-4 rounded-xl">
            <Mail size={28} className="text-kpf-teal" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Newsletter</h2>
            <p className="text-slate-600 text-base">
              {stats
                ? t("newsletter.admin.menu.subscribers")
                : "Newsletter Management"}
            </p>
            {authError && (
              <p className="text-sm text-orange-600 mt-1">
                ⚠️ Authentication required - stats unavailable
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onNavigate("newsletter-subscribers")}
          className="bg-kpf-teal hover:bg-teal-700 text-white px-5 py-3 rounded-lg transition-colors text-base font-medium"
        >
          {t("common.edit")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100 hover:border-blue-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-blue-600" />
            <p className="text-slate-600 text-sm font-semibold">
              {stats
                ? t("newsletter.admin.stats.totalSubscribers")
                : "Total Subscribers"}
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {stats?.totalSubscribers ?? 0}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 md:p-5 border border-green-100 hover:border-green-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-slate-600 text-sm font-semibold">
              {stats
                ? t("newsletter.admin.stats.activeSubscribers")
                : "Active Subscribers"}
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {stats?.activeSubscribers ?? 0}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 md:p-5 border border-purple-100 hover:border-purple-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Send size={20} className="text-purple-600" />
            <p className="text-slate-600 text-sm font-semibold">
              {stats
                ? t("newsletter.admin.stats.campaignsSent")
                : "Campaigns Sent"}
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {stats?.totalCampaignsSent ?? 0}
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 md:p-5 border border-orange-100 hover:border-orange-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={20} className="text-orange-600" />
            <p className="text-slate-600 text-sm font-semibold">
              {stats
                ? t("newsletter.admin.stats.totalEmailsSent")
                : "Total Emails"}
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {stats?.totalEmailsSent ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
      };

      if (!data?.stats) {
        throw new Error("Dashboard response missing 'stats'");
      }

      setStats(data.stats);
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
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md animate-fade-in">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-gradient-to-br from-kpf-teal/20 to-teal-500/10 rounded-2xl">
            <LayoutDashboard className="text-kpf-teal" size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t("admin_dashboard_title")}
            </h1>
            <p className="text-base text-slate-600">
              {t("admin_dashboard_subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.bgColor} ${stat.textColor} p-3 rounded-xl`}
                >
                  <Icon size={28} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-semibold mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              {stat.subText && (
                <p className="text-sm text-slate-500 mt-2">{stat.subText}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Newsletter Stats Widget */}
      <NewsletterStatsWidget onNavigate={onNavigate} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate("activities")}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
        >
          <Calendar size={32} className="mb-3" />
          <h3 className="font-semibold text-base">{t("admin_new_activity")}</h3>
        </button>
        <button
          onClick={() => onNavigate("courses")}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
        >
          <GraduationCap size={32} className="mb-3" />
          <h3 className="font-semibold text-base">{t("admin_new_course")}</h3>
        </button>
        <button
          onClick={() => onNavigate("team")}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
        >
          <Users size={32} className="mb-3" />
          <h3 className="font-semibold text-base">
            {t("admin_add_team_member")}
          </h3>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
