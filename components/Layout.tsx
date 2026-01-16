import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { Language, PageView } from "../types";
import { TEXTS } from "../constants";

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

  const t = (key: string) => TEXTS[key][lang];

  const circumference = 307.919;
  const progress =
    circumference * (1 - Math.min(Math.max(scrollProgress, 0), 100) / 100);

  // Sayfa kaydırma takibi
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(globalThis.scrollY > 400);

      // Scroll yüzdesini hesapla
      const windowHeight =
        document.documentElement.scrollHeight - globalThis.innerHeight;
      const progress =
        windowHeight > 0 ? (globalThis.scrollY / windowHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    globalThis.addEventListener("scroll", handleScroll);
    handleScroll(); // Başlangıçta çağır
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NavLink = ({
    page,
    label,
    primary = false,
  }: {
    page: PageView;
    label: string;
    primary?: boolean;
  }) => (
    <button
      onClick={() => {
        if (page === "home") {
          globalThis.location.hash = "";
          // Hash change event'ini manuel tetikle
          globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {
          globalThis.location.hash = page;
        }
        setIsMenuOpen(false);
      }}
      className={`relative px-3 py-1.5 transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap group ${
        primary
          ? "bg-kpf-red text-white rounded-full hover:bg-red-700 shadow-lg transform hover:-translate-y-0.5 px-6 ml-2"
          : currentPage === page
          ? "text-kpf-teal"
          : "text-slate-600 hover:text-kpf-teal"
      }`}
    >
      {label}
      {!primary && (
        <span
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-kpf-teal transform transition-transform duration-300 origin-left ${
            currentPage === page
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100"
          }`}
        ></span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                globalThis.location.hash = "";
                // Hash change event'ini manuel tetikle
                globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
              }}
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
              <NavLink page="home" label={t("nav_home")} />

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
                  onClick={() => setPage("about")}
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
                  className={`absolute left-0 w-56 pt-2 transition-all duration-300 origin-top ${
                    isAboutDropdownOpen
                      ? "opacity-100 scale-y-100"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => setPage("about")}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors"
                    >
                      {lang === "tr" ? "Hakkımızda" : "Über uns"}
                    </button>
                    <button
                      onClick={() => setPage("satzung")}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors border-t border-slate-50"
                    >
                      {lang === "tr" ? "Tüzük" : "Satzung"}
                    </button>
                    <button
                      onClick={() => setPage("guelen")}
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
                  onClick={() => setPage("activities")}
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
                  className={`absolute left-0 w-56 pt-2 transition-all duration-300 origin-top ${
                    isActivityDropdownOpen
                      ? "opacity-100 scale-y-100"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => setPage("activities")}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors"
                    >
                      {t("nav_activities_all")}
                    </button>
                    <button
                      onClick={() => setPage("teegespraeche")}
                      className="block w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-kpf-teal transition-colors border-t border-slate-50"
                    >
                      {t("nav_teegespraeche")}
                    </button>
                  </div>
                </div>
              </div>

              <NavLink page="courses" label={t("nav_courses")} />
              <NavLink
                page="volunteer"
                label={lang === "tr" ? "Gönüllü Ol" : "Freiwilliger"}
              />
              <NavLink page="contact" label={t("nav_contact")} />

              <div className="mx-2"></div>
              {/* Donate Button - Special styling */}
              <div className="ml-3">
                <button
                  onClick={() => {
                    globalThis.location.hash = "donate";
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-kpf-teal to-kpf-teal text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all group"
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
                onMouseEnter={() => setIsLangDropdownOpen(true)}
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
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />

                  <div
                    className="absolute right-0 mt-1 w-24 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-20"
                    onMouseLeave={() => setIsLangDropdownOpen(false)}
                  >
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
            <div className="lg:hidden flex items-center gap-4 ml-auto">
              {/* Mobile Language Selector */}
              <button
                onClick={() => setLang(lang === "tr" ? "de" : "tr")}
                className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
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
                  onClick={() => {
                    setPage("home");
                    setIsMenuOpen(false);
                  }}
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
                        onClick={() => {
                          setPage("about");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {lang === "tr" ? "Hakkımızda" : "Über uns"}
                      </button>
                      <button
                        onClick={() => {
                          setPage("satzung");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {lang === "tr" ? "Tüzük" : "Satzung"}
                      </button>
                      <button
                        onClick={() => {
                          setPage("guelen");
                          setIsMenuOpen(false);
                        }}
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
                        onClick={() => {
                          setPage("activities");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {t("nav_activities_all")}
                      </button>
                      <button
                        onClick={() => {
                          setPage("teegespraeche");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-600 hover:text-kpf-teal hover:bg-slate-50 rounded transition-colors"
                      >
                        {t("nav_teegespraeche")}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setPage("courses");
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "courses"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("nav_courses")}
                </button>

                <button
                  onClick={() => {
                    setPage("volunteer");
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg transition-colors font-semibold ${
                    currentPage === "volunteer"
                      ? "bg-kpf-teal/10 text-kpf-teal"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lang === "tr" ? "Gönüllü Ol" : "Freiwilliger"}
                </button>

                <button
                  onClick={() => {
                    setPage("contact");
                    setIsMenuOpen(false);
                  }}
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
                  onClick={() => {
                    setPage("donate");
                    setIsMenuOpen(false);
                  }}
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
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300 pt-20 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
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
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-2.5 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-2.5 rounded-full hover:bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 p-2.5 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Twitter size={20} />
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
                  <li key={item.page} className="overflow-hidden">
                    <button
                      onClick={() => {
                        setPage(item.page as PageView);
                        scrollToTop();
                      }}
                      className="relative group w-fit text-left"
                    >
                      <span className="relative z-10 text-slate-400 group-hover:text-white group-hover:font-semibold group-hover:translate-x-2 transition-all duration-300 ease-out inline-block">
                        {item.label}
                      </span>
                      <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-kpf-red to-orange-500 transform group-hover:w-full transition-all duration-500 ease-out"></div>
                      <div className="absolute left-0 bottom-0 w-2 h-0.5 bg-white transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-100"></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact - Daha geniş kolon */}
            <div className="lg:col-span-4">
              <h4 className="text-white font-bold mb-8 text-lg relative pb-3">
                {t("footer_contact_header")}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-kpf-red to-orange-500 rounded-full"></div>
              </h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="p-2 bg-gradient-to-r from-kpf-red/10 to-orange-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="text-kpf-red" size={18} />
                  </div>
                  <div>
                    <span className="text-sm text-slate-400 block mb-1">
                      Email
                    </span>
                    <a
                      href="mailto:info@kulturplattformfreiburg.org"
                      className="text-white hover:text-kpf-red transition-colors"
                    >
                      info@kulturplattformfreiburg.org
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="p-2 bg-gradient-to-r from-kpf-red/10 to-orange-500/10 rounded-lg group-hover:scale-110 transition-transform">
                    <MapPin className="text-kpf-red" size={18} />
                  </div>
                  <div>
                    <span className="text-sm text-slate-400 block mb-1">
                      Adresse
                    </span>
                    <span className="text-white">
                      Böcklerstraße 3<br />
                      79110 Freiburg im Breisgau
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter / CTA */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-8 text-lg relative pb-3">
                {lang === "tr" ? "Bize Katılın" : "Werden Sie Teil"}
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-kpf-red to-orange-500 rounded-full"></div>
              </h4>
              <p className="text-sm text-slate-400 mb-6">
                {lang === "tr"
                  ? "Gönüllü olun ve kültürel projelerimizde yer alın."
                  : "Werden Sie Freiwilliger und beteiligen Sie sich an unseren Kulturprojekten."}
              </p>
              <button
                onClick={() => {
                  setPage("volunteer");
                  scrollToTop();
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-kpf-teal to-teal-700 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <Heart size={18} />
                {lang === "tr" ? "Gönüllü Ol" : "Freiwilliger werden"}
              </button>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} KulturPlattform Freiburg e.V.{" "}
              {t("footer_rights")}
            </div>
            <div className="flex gap-6">
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

export default Layout;
