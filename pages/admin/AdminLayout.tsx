import {
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import { TEXTS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  // Get current admin info from localStorage on every render for consistency
  const adminName = localStorage.getItem("adminName") || "Admin User";
  const adminRole = localStorage.getItem("adminRole") || "Administrator";

  const getUserInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + (parts.at(-1)?.[0] || "")).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const languageSwitchLabel =
    language === "tr" ? t("common_language_de") : t("common_language_tr");

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => (prev.includes(id) ? [] : [id]));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: t("admin_menu_dashboard"),
      icon: LayoutDashboard,
    },
    {
      id: "home",
      label: t("admin_menu_home"),
      icon: Home,
    },

    {
      id: "about-dropdown",
      label: t("admin_menu_about"),
      icon: FileText,
      isDropdown: true,
      children: [
        {
          id: "about-us",
          label: t("admin_menu_about_us"),
        },
        {
          id: "guelen",
          label: t("admin_menu_guelen"),
        },
        {
          id: "satzung",
          label: t("admin_menu_satzung"),
        },
      ],
    },
    {
      id: "content-dropdown",
      label: t("admin_menu_content"),
      icon: Calendar,
      isDropdown: true,
      children: [
        { id: "activities", label: t("admin_menu_activities") },
        { id: "teegespraeche", label: t("admin_menu_teegespraeche") },
        { id: "courses", label: t("admin_menu_courses") },
      ],
    },
    {
      id: "management-dropdown",
      label: t("admin_menu_management"),
      icon: Users,
      isDropdown: true,
      children: [
        { id: "team", label: t("admin_menu_team"), requiresSystemAdmin: true },
        { id: "volunteers", label: t("admin_menu_volunteers") },
        {
          id: "volunteer-page",
          label: t("admin_menu_volunteer_page"),
        },
      ],
    },
    {
      id: "newsletter-dropdown",
      label: t("admin_menu_newsletter"),
      icon: Mail,
      isDropdown: true,
      children: [
        {
          id: "newsletter-subscribers",
          label: t("admin_menu_newsletter_subscribers"),
        },
        {
          id: "newsletter-campaigns",
          label: t("admin_menu_newsletter_campaigns"),
        },
      ],
    },
    {
      id: "settings-dropdown",
      label: t("admin_menu_system"),
      icon: Settings,
      isDropdown: true,
      children: [
        { id: "contact", label: t("admin_contact_title") },
        { id: "imprint", label: t("admin_imprint_title") },
        { id: "donate", label: t("admin_donate_title") },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-4">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white rounded-2xl shadow-sm text-slate-600 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-teal-600">
              {t("admin_title")}
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isExpanded = expandedMenus.includes(item.id);
            const isParentActive =
              item.children?.some((child: any) => currentPage === child.id) ||
              isActive;

            if (item.isDropdown) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                      isParentActive
                        ? "bg-kpf-teal text-white shadow-lg"
                        : "hover:bg-teal-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {sidebarOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Items */}
                  {sidebarOpen && isExpanded && (
                    <div className="pl-6 space-y-1 mt-1">
                      {item.children
                        ?.filter((child: any) => {
                          // Filter out items that require SystemAdmin role
                          if (
                            child.requiresSystemAdmin &&
                            adminRole !== "SystemAdmin"
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((child: any) => {
                          const isChildActive = currentPage === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={() => onNavigate(child.id)}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                                isChildActive
                                  ? "bg-kpf-teal text-white"
                                  : "text-slate-500 hover:bg-teal-50 hover:text-teal-600"
                              }`}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item (dashboard)
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-kpf-teal text-white shadow-lg"
                    : "hover:bg-teal-50 text-slate-600"
                } ${!sidebarOpen && "justify-center"}`}
                title={sidebarOpen ? undefined : item.label}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Admin User Info with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-full flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl transition-all duration-300 hover:bg-slate-50 ${
                sidebarOpen
                  ? "bg-white/70 backdrop-blur-md shadow-sm"
                  : "justify-center"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 text-white font-semibold transition-all duration-300 ${
                    sidebarOpen
                      ? "w-10 h-10 rounded-2xl text-sm"
                      : "w-12 h-12 rounded-2xl text-lg hover:scale-105"
                  }`}
                >
                  {getUserInitials(adminName)}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              {sidebarOpen && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {adminName}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    {adminRole}
                  </span>
                </div>
              )}

              {sidebarOpen && (
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <button
                  onClick={() => {
                    onNavigate("settings");
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors ${
                    currentPage === "settings"
                      ? "bg-kpf-teal/10 text-kpf-teal font-semibold"
                      : ""
                  }`}
                >
                  <Settings size={18} />
                  <span className="text-sm">{t("admin_settings_menu")}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors border-t border-slate-100"
                >
                  <LogOut size={18} />
                  <span className="text-sm">{t("admin_logout")}</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setLanguage(language === "tr" ? "de" : "tr")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600 transition-all ${
              !sidebarOpen && "justify-center"
            }`}
            title={sidebarOpen ? undefined : languageSwitchLabel}
          >
            <Languages size={20} />
            {sidebarOpen && (
              <span className="font-medium">{languageSwitchLabel}</span>
            )}
          </button>
          <button
            onClick={() => window.open("/", "_blank")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600 transition-all ${
              !sidebarOpen && "justify-center"
            }`}
            title={sidebarOpen ? undefined : t("admin_website")}
          >
            <Home size={20} />
            {sidebarOpen && (
              <span className="font-medium">{t("admin_website")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
