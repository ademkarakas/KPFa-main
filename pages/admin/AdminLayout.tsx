import {
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
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
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const languageSwitchLabel =
    language === "tr" ? t("common_language_de") : t("common_language_tr");

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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
        { id: "team", label: t("admin_menu_team") },
        { id: "partners", label: t("admin_menu_partners") },
        { id: "volunteers", label: t("admin_menu_volunteers") },
        {
          id: "volunteer-page",
          label: t("admin_menu_volunteer_page"),
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
        { id: "translations", label: t("admin_menu_translations") },
        { id: "donate", label: t("admin_donate_title") },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-kpf-teal">
              {t("admin_title")}
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
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
                        : "hover:bg-slate-800 text-slate-300"
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
                      {item.children?.map((child: any) => {
                        const isChildActive = currentPage === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => onNavigate(child.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                              isChildActive
                                ? "bg-kpf-teal text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
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
                    : "hover:bg-slate-800 text-slate-300"
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
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={() => setLanguage(language === "tr" ? "de" : "tr")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-all ${
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-all ${
              !sidebarOpen && "justify-center"
            }`}
            title={sidebarOpen ? undefined : t("admin_website")}
          >
            <Home size={20} />
            {sidebarOpen && (
              <span className="font-medium">{t("admin_website")}</span>
            )}
          </button>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 text-slate-300 transition-all ${
              !sidebarOpen && "justify-center"
            }`}
            title={sidebarOpen ? undefined : t("admin_logout")}
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="font-medium">{t("admin_logout")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
