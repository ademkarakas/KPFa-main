import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { Language, PageView } from "../types";
import { TEXTS } from "../constants";
import NewsletterSubscribeForm from "./NewsletterSubscribeForm";
import { useDebounceScroll } from "../hooks/useDebounceScroll";
import { navigateTo } from "../utils/navigation";
import { contactInfoApi } from "../services/api";

// Custom SVG Icons (replacing deprecated Lucide icons)
const FacebookIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.28-.072 1.689-.072 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (lang: Language) => void;
  setPage: (page: PageView) => void;
  currentPage: PageView;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  lang,
  setLang,
  setPage,
  currentPage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactData, setContactData] = useState<{
    email: string;
    phone: string;
    address: {
      street?: string;
      houseNo?: string;
      zipCode?: string;
      city?: string;
      state?: string;
      country?: string;
    };
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  } | null>(null);

  const t = (key: string) => TEXTS[key][lang];

  const circumference = 307.919;
  const progress =
    circumference * (1 - Math.min(Math.max(scrollProgress, 0), 100) / 100);

  // Load contact data
  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await contactInfoApi.get();
        setContactData({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || {},
          socialMedia: data.socialMedia || {},
        });
      } catch (err) {
        console.error("Contact data loading error:", err);
      }
    };
    loadContactData();
  }, []);

  // Format address helper
  const formatAddress = (address: {
    street?: string;
    houseNo?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  }) => {
    if (!address) return "";

    const streetPart = [address.street, address.houseNo]
      .filter(Boolean)
      .join(" ");
    const postalCityPart = [address.zipCode, address.city]
      .filter(Boolean)
      .join(" ");
    const statePart = address.state || "";
    const countryPart = address.country || "";

    return [streetPart, postalCityPart, statePart, countryPart]
      .filter(Boolean)
      .join(", ");
  };

  // Debounced scroll tracking for better performance
  useDebounceScroll(() => {
    setShowScrollTop(globalThis.scrollY > 400);

    // Calculate scroll percentage
    const windowHeight =
      document.documentElement.scrollHeight - globalThis.innerHeight;
    const progress =
      windowHeight > 0 ? (globalThis.scrollY / windowHeight) * 100 : 0;
    setScrollProgress(progress);
  }, 100);

  const scrollToTop = () => {
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobil menüde sayfa değiştirip üste scroll et
  const handleMobileNavigation = (page: PageView) => {
    setIsMenuOpen(false);
    setIsAboutDropdownOpen(false);
    setIsActivityDropdownOpen(false);

    navigateTo(page === "home" ? "" : page);

    setTimeout(() => {
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24">
            {/* Logo */}
            <div
              tabIndex={0}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                navigateTo("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigateTo("");
                }
              }}
              aria-label={t("nav_home") || "Ana Sayfa"}
            >
              <img
                src="/assets/cropped-Logoweb.png"
                alt="KulturPlattform Logo"
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800 leading-none group-hover:text-kpf-teal transition-colors">
                  KulturPlattform
                </span>
                <span className="text-[10px] text-slate-400 tracking-[0.3em] font-bold uppercase">
                  Freiburg
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 ml-auto mr-8">
              <button
                onClick={() => {
                  navigateTo("");
                  setIsAboutDropdownOpen(false);
                  setIsActivityDropdownOpen(false);
                  setTimeout(() => {
                    globalThis.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className={`relative px-3 py-1.5 transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap group ${
                  currentPage === "home"
                    ? "text-kpf-teal"
                    : "text-slate-600 hover:text-kpf-teal"
                }`}
              >
                {t("nav_home")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-kpf-teal transform transition-transform duration-300 origin-left ${
                    currentPage === "home"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </button>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                <button
                  className={`px-3 py-1.5 font-bold text-xs lg:text-sm flex items-center gap-1 transition-colors ${
                    ["about", "satzung", "guelen"].includes(currentPage)
                      ? "text-kpf-teal"
                      : "text-slate-600 hover:text-kpf-teal"
                  }`}
                  onClick={() => {
                    navigateTo("about");
                    setIsAboutDropdownOpen(false);
                  }}
                >
                  {t("nav_about")}{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isAboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 w-56 pt-2 transition-all duration-300 origin-top z-50 ${
                    isAboutDropdownOpen
                      ? "opacity-100 scale-y-100"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => {
                        navigateTo("about");
                        setIsAboutDropdownOpen(false);
                      }}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors"
                    >
                      {lang === "tr" ? "Hakkımızda" : "Über uns"}
                    </button>
                    <button
                      onClick={() => {
                        navigateTo("satzung");
                        setIsAboutDropdownOpen(false);
                      }}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors border-t border-slate-50"
                    >
                      {lang === "tr" ? "Tüzük" : "Satzung"}
                    </button>
                    <button
                      onClick={() => {
                        navigateTo("guelen");
                        setIsAboutDropdownOpen(false);
                      }}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors border-t border-slate-50"
                    >
                      {lang === "tr" ? "Gülen Hareketi" : "Über die Bewegung"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Activities Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsActivityDropdownOpen(true)}
                onMouseLeave={() => setIsActivityDropdownOpen(false)}
              >
                <button
                  className={`px-3 py-1.5 font-bold text-xs lg:text-sm flex items-center gap-1 transition-colors ${
                    ["activities", "teegespraeche"].includes(currentPage)
                      ? "text-kpf-teal"
                      : "text-slate-600 hover:text-kpf-teal"
                  }`}
                  onClick={() => {
                    navigateTo("activities");
                    setIsActivityDropdownOpen(false);
                  }}
                >
                  {t("nav_activities")}{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isActivityDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 w-56 pt-2 transition-all duration-300 origin-top z-50 ${
                    isActivityDropdownOpen
                      ? "opacity-100 scale-y-100"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => {
                        navigateTo("activities");
                        setIsActivityDropdownOpen(false);
                      }}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors"
                    >
                      {t("nav_activities_all")}
                    </button>
                    <button
                      onClick={() => {
                        navigateTo("teegespraeche");
                        setIsActivityDropdownOpen(false);
                      }}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors border-t border-slate-50"
                    >
                      {t("nav_teegespraeche")}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigateTo("courses");
                  setIsAboutDropdownOpen(false);
                  setIsActivityDropdownOpen(false);
                  setTimeout(() => {
                    globalThis.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className={`relative px-3 py-1.5 transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap group ${
                  currentPage === "courses"
                    ? "text-kpf-teal"
                    : "text-slate-600 hover:text-kpf-teal"
                }`}
              >
                {t("nav_courses")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-kpf-teal transform transition-transform duration-300 origin-left ${
                    currentPage === "courses"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </button>

              <button
                onClick={() => {
                  navigateTo("volunteer");
                  setIsAboutDropdownOpen(false);
                  setIsActivityDropdownOpen(false);
                  setTimeout(() => {
                    globalThis.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className={`relative px-3 py-1.5 transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap group ${
                  currentPage === "volunteer"
                    ? "text-kpf-teal"
                    : "text-slate-600 hover:text-kpf-teal"
                }`}
              >
                {lang === "tr" ? "Gönüllü Ol" : "Freiwilliger"}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-kpf-teal transform transition-transform duration-300 origin-left ${
                    currentPage === "volunteer"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </button>

              <button
                onClick={() => {
                  navigateTo("contact");
                  setIsAboutDropdownOpen(false);
                  setIsActivityDropdownOpen(false);
                  setTimeout(() => {
                    globalThis.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className={`relative px-3 py-1.5 transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap group ${
                  currentPage === "contact"
                    ? "text-kpf-teal"
                    : "text-slate-600 hover:text-kpf-teal"
                }`}
              >
                {t("nav_contact")}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-kpf-teal transform transition-transform duration-300 origin-left ${
                    currentPage === "contact"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </button>

              <div className="mx-2"></div>
              {/* Donate Button - Special styling */}
              <div className="ml-1">
                <button
                  onClick={() => {
                    navigateTo("donate");
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-kpf-teal to-kpf-teal text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {t("nav_donate")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-kpf-teal to-kpf-teal opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>

            {/* Right Side - Language Selector */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-all py-2 px-3 rounded-lg hover:bg-slate-100"
                aria-label="Select language"
                aria-expanded={isLangDropdownOpen}
              >
                <img
                  src={`/assets/flags/${lang}.svg`}
                  alt={`${lang === "tr" ? "Turkish" : "German"} flag`}
                  className="w-6 h-4 object-cover rounded shadow-sm"
                />
                <span className="font-semibold text-sm uppercase">
                  {lang.toUpperCase()}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isLangDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <button
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setIsLangDropdownOpen(false)}
                    aria-label="Close language dropdown"
                    tabIndex={-1}
                  />
                  <div className="absolute right-0 mt-1 w-24 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-20">
                    <button
                      onClick={() => {
                        setLang("tr");
                        setIsLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                        lang === "tr"
                          ? "bg-kpf-teal/5 text-kpf-teal font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      <img
                        src="/assets/flags/tr.svg"
                        alt="Turkish flag"
                        className="w-6 h-4 object-cover rounded shadow-sm"
                      />
                      <span className="text-sm">TR</span>
                    </button>
                    <button
                      onClick={() => {
                        setLang("de");
                        setIsLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-t border-slate-100 ${
                        lang === "de"
                          ? "bg-kpf-teal/5 text-kpf-teal font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      <img
                        src="/assets/flags/de.svg"
                        alt="German flag"
                        className="w-6 h-4 object-cover rounded shadow-sm"
                      />
                      <span className="text-sm">DE</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-0.1 ml-auto">
              {/* Mobile Language Selector */}
              <button
                onClick={() => setLang(lang === "tr" ? "de" : "tr")}
                className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                aria-label="Change language"
              >
                <img
                  src={`/assets/flags/${lang}.svg`}
                  alt={`${lang === "tr" ? "Turkish" : "German"} flag`}
                  className="w-5 h-3.5 object-cover rounded shadow-sm"
                />
                <span className="font-semibold text-xs uppercase text-slate-700">
                  {lang.toUpperCase()}
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-white">
              <div className="flex flex-col space-y-2 px-4 py-4">
                <button
                  onClick={() => handleMobileNavigation("home")}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "home"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("nav_home")}
                </button>

                {/* About Section */}
                <div>
                  <button
                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-between ${
                      ["about", "satzung", "guelen"].includes(currentPage)
                        ? "bg-kpf-teal/10 text-kpf-teal"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t("nav_about")}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isAboutDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isAboutDropdownOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      <button
                        onClick={() => handleMobileNavigation("about")}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {lang === "tr" ? "Hakkımızda" : "Über uns"}
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("satzung")}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {lang === "tr" ? "Tüzük" : "Satzung"}
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("guelen")}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {lang === "tr" ? "Gülen Hareketi" : "Über die Bewegung"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Activities Section */}
                <div>
                  <button
                    onClick={() =>
                      setIsActivityDropdownOpen(!isActivityDropdownOpen)
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-between ${
                      ["activities", "teegespraeche"].includes(currentPage)
                        ? "bg-kpf-teal/10 text-kpf-teal"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t("nav_activities")}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isActivityDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isActivityDropdownOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      <button
                        onClick={() => handleMobileNavigation("activities")}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {t("nav_activities_all")}
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("teegespraeche")}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {t("nav_teegespraeche")}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleMobileNavigation("courses")}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "courses"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("nav_courses")}
                </button>

                <button
                  onClick={() => handleMobileNavigation("volunteer")}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "volunteer"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lang === "tr" ? "Gönüllü Ol" : "Freiwilliger"}
                </button>

                <button
                  onClick={() => handleMobileNavigation("contact")}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "contact"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("nav_contact")}
                </button>

                <div className="my-2 border-t border-slate-200"></div>

                <button
                  onClick={() => handleMobileNavigation("donate")}
                  className={`text-left px-6 py-3 rounded-full font-semibold transition-all ${
                    currentPage === "donate"
                      ? "bg-kpf-teal text-white"
                      : "bg-kpf-teal text-white hover:bg-teal-700"
                  }`}
                >
                  {t("nav_donate")}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top fixed bottom-8 right-8 z-40 flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
        style={{ width: "64px", height: "64px" }}
      >
        {/* Progress Circle */}
        <svg
          className="progress-circle svg-content absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
          style={{ transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient
              id="scrollGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6944ef" /> {/* red-500 */}
              <stop offset="100%" stopColor="#7db3e6" /> {/* amber-500 */}
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
          />

          {/* Progress Path */}
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            fill="none"
            stroke="url(#scrollGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.15s linear",
            }}
          />
        </svg>

        {/* Center Button */}
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-teal-700 shadow-xl">
          <ChevronUp size={24} className="text-white transition-transform" />
        </div>
      </button>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20 max-w-7xl mx-auto">
            {/* Brand - Daha geniş kolon */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src="/assets/cropped-Logoweb.png"
                  alt="KulturPlattform Logo"
                  className="w-12 h-12 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    KulturPlattform
                  </span>
                  <span className="text-xs text-slate-400 tracking-[0.2em] font-semibold">
                    FREIBURG
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {lang === "tr"
                  ? "Kültürel değerleri yaşatmak ve toplumlar arası köprüler kurmak için çalışıyoruz."
                  : "Wir arbeiten daran, kulturelle Werte lebendig zu halten und Brücken zwischen Gesellschaften zu bauen."}
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/kulturplattformfreiburg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-2.5 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <FacebookIcon size={20} />
                </a>
                {contactData?.socialMedia?.instagram && (
                  <a
                    href={contactData.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 p-2.5 rounded-full hover:bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <InstagramIcon size={20} />
                  </a>
                )}
                <a
                  href="https://www.twitter.com/kulturplattformfreiburg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-2.5 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <TwitterIcon size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-8 text-lg relative pb-3">
                {t("nav_home")}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-kpf-red to-orange-500 rounded-full"></div>
              </h4>
              <ul className="space-y-5">
                {[
                  { page: "about", label: t("nav_about") },
                  { page: "activities", label: t("nav_activities") },
                  { page: "courses", label: t("nav_courses") },
                  { page: "contact", label: t("nav_contact") },
                  { page: "donate", label: t("nav_donate") },
                ].map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => {
                        setPage(item.page as PageView);
                        scrollToTop();
                      }}
                      className="relative group text-left"
                    >
                      <span className="text-slate-400 group-hover:text-white group-hover:font-semibold transition-all duration-300 ease-out">
                        {item.label}
                      </span>
                      <div className="absolute left-0 bottom-0 h-0.5 bg-kpf-teal w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact - Daha geniş kolon */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-bold mb-8 text-lg relative pb-3">
                {t("footer_contact_header")}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-kpf-red to-orange-500 rounded-full"></div>
              </h4>
              <ul className="space-y-6">
                {contactData?.email && (
                  <li className="flex items-start gap-4 group">
                    <div className="p-2 bg-gradient-to-r from-kpf-red/10 to-orange-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="text-kpf-red" size={18} />
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">
                        Email
                      </span>
                      <a
                        href={`mailto:${contactData.email}`}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        {contactData.email}
                      </a>
                    </div>
                  </li>
                )}
                {contactData?.address && (
                  <li className="flex items-start gap-4 group">
                    <div className="p-2 bg-gradient-to-r from-kpf-red/10 to-orange-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      <MapPin className="text-kpf-red" size={18} />
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block mb-1">
                        Adresse
                      </span>
                      <span className="text-slate-400 text-sm whitespace-pre-line">
                        {formatAddress(contactData.address)}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Newsletter / CTA */}
            <div className="lg:col-span-3">
              <NewsletterSubscribeForm />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500">
            <div className="flex-1">
              &copy; {new Date().getFullYear()} {t("common_site_title")} e.V.{" "}
              {t("footer_rights")}
            </div>
            <div className="flex gap-6 md:mr-auto md:ml-8">
              <button
                onClick={() => {
                  setPage("privacy");
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                {t("footer_privacy")}
              </button>
              <button
                onClick={() => {
                  setPage("imprint");
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                {t("footer_imprint")}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Memoize with custom comparison for better performance
export default React.memo(Layout, (prevProps, nextProps) => {
  return (
    prevProps.lang === nextProps.lang &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.children === nextProps.children
  );
});
