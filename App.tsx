import React, { useState, useEffect, Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { Language, PageView } from "./types";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "react-hot-toast";
import i18n from "./src/i18n/config";
import { updatePageMeta } from "./utils/seo";

// Lazy load pages for better performance (code splitting)
const About = lazy(() => import("./pages/About"));
const Activities = lazy(() => import("./pages/Activities"));
const ActivityDetail = lazy(() => import("./pages/ActivityDetail"));
const Courses = lazy(() => import("./pages/Courses"));
const Donate = lazy(() => import("./pages/Donate"));
const Contact = lazy(() => import("./pages/Contact"));
const Teegespraeche = lazy(() => import("./pages/Teegespraeche"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Imprint = lazy(() => import("./pages/Imprint"));
const Satzung = lazy(() => import("./pages/Satzung"));
const GuelenMovement = lazy(() => import("./pages/GuelenMovement"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const VolunteerForm = lazy(() => import("./pages/VolunteerForm"));
const NewsletterVerify = lazy(() => import("./pages/NewsletterVerify"));
const NewsletterUnsubscribe = lazy(
  () => import("./pages/NewsletterUnsubscribe"),
);
// Admin panel - separate chunk
const Admin = lazy(() => import("./pages/admin/Admin"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-kpf-teal"></div>
      <p className="mt-4 text-slate-600">Wird geladen...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Get initial language from localStorage or URL (for SEO)
  const getInitialLanguage = (): Language => {
    // 1. Check URL query params (best for SEO crawlers)
    const urlParams = new URLSearchParams(globalThis.location.search);
    const langParam = urlParams.get("lang");
    if (langParam === "de" || langParam === "tr") return langParam;

    // 2. Check localStorage
    const stored = globalThis.localStorage?.getItem("i18nextLng");
    if (stored === "de" || stored === "tr") return stored;

    // 3. Fallback to default
    return "de";
  };

  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [activityId, setActivityId] = useState<string | null>(null);

  // Synchronize lang state with i18next
  useEffect(() => {
    i18n.changeLanguage(lang);
    globalThis.localStorage?.setItem("i18nextLng", lang);
  }, [lang]);

  // Clean URL navigation - pathname-based routing
  useEffect(() => {
    const handleRouteChange = () => {
      const path = globalThis.location.pathname.slice(1); // Remove leading /

      if (path.startsWith("activity/")) {
        const id = path.split("/")[1];
        setActivityId(id);
        setCurrentPage("activities");
        setTimeout(() => {
          globalThis.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      } else if (path === "admin") {
        setActivityId(null);
      } else if (path.startsWith("about/")) {
        const sectionId = path.split("/")[1];
        setCurrentPage("about");
        setActivityId(null);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else if (path.startsWith("newsletter/verify")) {
        setCurrentPage("newsletter-verify" as PageView);
        setActivityId(null);
      } else if (path.startsWith("newsletter/unsubscribe")) {
        setCurrentPage("newsletter-unsubscribe" as PageView);
        setActivityId(null);
      } else if (path) {
        setCurrentPage(path as PageView);
        setActivityId(null);
        setTimeout(() => {
          globalThis.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      } else {
        setCurrentPage("home");
        setActivityId(null);
      }
    };

    handleRouteChange();
    globalThis.addEventListener("popstate", handleRouteChange);
    return () => globalThis.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Update SEO meta tags when page or language changes
  useEffect(() => {
    updatePageMeta(currentPage, lang);
  }, [currentPage, lang]);

  // Admin paneli için özel kontrol
  if (globalThis.location.pathname === "/admin") {
    return (
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      </LanguageProvider>
    );
  }

  const renderPage = () => {
    // Activity detail sayfası için özel kontrol
    if (activityId) {
      return (
        <ActivityDetail
          activityId={activityId}
          lang={lang}
          onBack={() => {
            globalThis.history.pushState(null, "", "/activities");
            globalThis.dispatchEvent(new PopStateEvent("popstate"));
          }}
        />
      );
    }

    switch (currentPage) {
      case "home":
        return <Home lang={lang} setPage={setCurrentPage} />;
      case "about":
        return <About lang={lang} />;
      case "activities":
        return <Activities lang={lang} currentPage={currentPage} />;
      case "courses":
        return (
          <Courses
            lang={lang}
            setPage={setCurrentPage}
            currentPage={currentPage}
          />
        );
      case "donate":
        return <Donate lang={lang} />;
      case "contact":
        return <Contact lang={lang} />;
      case "teegespraeche":
        return <Teegespraeche lang={lang} />;
      case "privacy":
        return <Privacy lang={lang} />;
      case "imprint":
        return <Imprint lang={lang} />;
      case "satzung":
        return <Satzung lang={lang} />;
      case "guelen":
        return <GuelenMovement lang={lang} />;
      case "volunteer":
        return <Volunteer lang={lang} setPage={setCurrentPage} />;
      case "volunteer-form":
        return <VolunteerForm lang={lang} />;
      case "newsletter-verify":
        return <NewsletterVerify lang={lang} setPage={setCurrentPage} />;
      case "newsletter-unsubscribe":
        return <NewsletterUnsubscribe lang={lang} setPage={setCurrentPage} />;
      default:
        return <Home lang={lang} setPage={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <Layout
        lang={lang}
        setLang={setLang}
        setPage={setCurrentPage}
        currentPage={currentPage}
      >
        <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
        {/* Global toast bildirimi */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#1E293B", // koyu gri arkaplan
              color: "#F8FAFC", // açık yazı rengi
              padding: "12px 18px",
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            },
            duration: 4000, // 4 saniye
          }}
        />
      </Layout>
    </LanguageProvider>
  );
};

export default App;
