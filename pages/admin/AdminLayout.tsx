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

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
      label: language === "tr" ? "Anasayfa" : "Startseite",
      icon: Home,
    },

    {
      id: "about-dropdown",
      label: language === "tr" ? "Hakkımızda" : "Über Uns",
      icon: FileText,
      isDropdown: true,
      children: [
        {
          id: "about-us",
          label: language === "tr" ? "Hakkımızda" : "Über Uns",
        },
        {
          id: "guelen",
          label: language === "tr" ? "Guelen Hareketi" : "Guelen Bewegung",
        },
        {
          id: "satzung",
          label: "Satzung/Tüzük",
        },
      ],
    },
    {
      id: "content-dropdown",
      label: language === "tr" ? "İçerik" : "Inhalte",
      icon: Calendar,
      isDropdown: true,
      children: [
        { id: "activities", label: t("admin_menu_activities") },
        { id: "teegespraeche", label: "Tee-Gespräche" },
        { id: "courses", label: t("admin_menu_courses") },
        { id: "pages", label: t("admin_menu_pages") },
      ],
    },
    {
      id: "management-dropdown",
      label: language === "tr" ? "Yönetim" : "Verwaltung",
      icon: Users,
      isDropdown: true,
      children: [
        { id: "team", label: t("admin_menu_team") },
        { id: "partners", label: t("admin_menu_partners") },
        { id: "volunteers", label: t("admin_menu_volunteers") },
        {
          id: "volunteer-page",
          label: language === "de" ? "Freiwillig Mitmachen" : "Gönüllü Ol",
        },
      ],
    },
    {
      id: "settings-dropdown",
      label: language === "tr" ? "Sistem" : "System",
      icon: Settings,
      isDropdown: true,
      children: [
        { id: "contact", label: t("admin_contact_title") },
        { id: "imprint", label: "Künye/Impressum" },
        { id: "translations", label: "Çeviriler" },
        { id: "donate", label: "Bağış/Spende" },
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
            <h1 className="text-xl font-bold text-kpf-red">
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
                        ? "bg-kpf-red text-white shadow-lg"
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
                                ? "bg-red-600 text-white"
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
                    ? "bg-kpf-red text-white shadow-lg"
                    : "hover:bg-slate-800 text-slate-300"
                } ${!sidebarOpen && "justify-center"}`}
                title={!sidebarOpen ? item.label : undefined}
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
            title={
              !sidebarOpen
                ? language === "tr"
                  ? "Deutsch"
                  : "Türkçe"
                : undefined
            }
          >
            <Languages size={20} />
            {sidebarOpen && (
              <span className="font-medium">
                {language === "tr" ? "Deutsch" : "Türkçe"}
              </span>
            )}
          </button>
          <button
            onClick={() => window.open("/", "_blank")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-all ${
              !sidebarOpen && "justify-center"
            }`}
            title={!sidebarOpen ? t("admin_website") : undefined}
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
            title={!sidebarOpen ? t("admin_logout") : undefined}
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
