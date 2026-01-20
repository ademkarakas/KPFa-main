import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  Users,
  Handshake,
  TrendingUp,
  Mail,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

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
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "https://localhost:7189/api/Dashboard/overview",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();

      setStats(data.stats);
      setRecentSubmissions(data.recentSubmissions || []);
    } catch (error) {
      console.error("Dashboard verisi yüklenirken hata:", error);
      // Hatayı sessizce işle, loading state devam etmesin
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t("admin_stats_activities"),
      value: stats.totalActivities,
      subText: `${stats.activeActivities} aktif`,
      icon: Calendar,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: t("admin_stats_courses"),
      value: stats.totalCourses,
      subText: `${stats.activeCourses} aktif`,
      icon: GraduationCap,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: t("admin_stats_team"),
      value: stats.totalTeamMembers,
      subText: `${stats.activeTeamMembers} aktif`,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: t("admin_stats_partners"),
      value: stats.totalPartners,
      subText: `${stats.activePartners} aktif`,
      icon: Handshake,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: t("admin_stats_volunteers"),
      value: stats.totalVolunteerSubmissions,
      subText: "başvuru",
      icon: TrendingUp,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("admin_dashboard_title")}
        </h1>
        <p className="text-slate-600">{t("admin_dashboard_subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}
                >
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              {stat.subText && (
                <p className="text-xs text-slate-500 mt-2">{stat.subText}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="text-kpf-red" size={24} />
          <h2 className="text-xl font-bold text-slate-800">
            {t("admin_recent_submissions")} ({recentSubmissions.length})
          </h2>
        </div>

        {recentSubmissions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            {t("admin_no_submissions")}
          </p>
        ) : (
          <div className="space-y-4">
            {recentSubmissions.slice(0, 3).map((submission) => (
              <div
                key={submission.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">
                        {submission.fullName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {submission.email}
                      </span>
                      {submission.phoneNumber && (
                        <span>{submission.phoneNumber}</span>
                      )}
                    </div>
                    {submission.message && (
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {submission.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>
                      {new Date(submission.submittedAt).toLocaleDateString(
                        language === "de" ? "de-DE" : "tr-TR",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate("activities")}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Calendar size={32} className="mb-2" />
          <h3 className="font-semibold">{t("admin_new_activity")}</h3>
        </button>
        <button
          onClick={() => onNavigate("courses")}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <GraduationCap size={32} className="mb-2" />
          <h3 className="font-semibold">{t("admin_new_course")}</h3>
        </button>
        <button
          onClick={() => onNavigate("team")}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Users size={32} className="mb-2" />
          <h3 className="font-semibold">{t("admin_add_team_member")}</h3>
        </button>
        <button
          onClick={() => onNavigate("partners")}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Handshake size={32} className="mb-2" />
          <h3 className="font-semibold">{t("admin_add_partner")}</h3>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
