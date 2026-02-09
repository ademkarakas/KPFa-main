import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Courses from "./pages/Courses";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Teegespraeche from "./pages/Teegespraeche";
import Privacy from "./pages/Privacy";
import Imprint from "./pages/Imprint";
import Satzung from "./pages/Satzung";
import GuelenMovement from "./pages/GuelenMovement";
import Volunteer from "./pages/Volunteer";
import VolunteerForm from "./pages/VolunteerForm";
import NewsletterVerify from "./pages/NewsletterVerify";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";
import Admin from "./pages/admin/Admin";
import { Language, PageView } from "./types";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>("tr");
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [activityId, setActivityId] = useState<string | null>(null);

  // Hash-based navigation için URL'i dinle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = globalThis.location.hash.slice(1); // # işaretini kaldır

      if (hash.startsWith("activity/")) {
        const id = hash.split("/")[1];
        setActivityId(id);
        setCurrentPage("activities");
        // Aktivite detail açıldığında scroll to top
        setTimeout(() => {
          globalThis.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      } else if (hash === "admin") {
        // Admin sayfası için özel işlem yok, zaten aşağıda kontrol ediliyor
        setActivityId(null);
      } else if (hash.startsWith("about/")) {
        // About sayfası için section scroll desteği (örn: "about/core-values")
        const sectionId = hash.split("/")[1];
        setCurrentPage("about");
        setActivityId(null);

        // Section'a scroll yap
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else if (hash.startsWith("newsletter/verify")) {
        // Newsletter verification page
        setCurrentPage("newsletter-verify" as PageView);
        setActivityId(null);
      } else if (hash.startsWith("newsletter/unsubscribe")) {
        // Newsletter unsubscribe page
        setCurrentPage("newsletter-unsubscribe" as PageView);
        setActivityId(null);
      } else if (hash) {
        setCurrentPage(hash as PageView);
        setActivityId(null);
        // Diğer sayfalara navigasyon yapıldığında scroll to top
        setTimeout(() => {
          globalThis.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      } else {
        setCurrentPage("home");
        setActivityId(null);
      }
    };

    // İlk yüklemede ve hash değiştiğinde çalıştır
    handleHashChange();
    globalThis.addEventListener("hashchange", handleHashChange);

    return () => globalThis.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Admin paneli için özel kontrol
  if (
    globalThis.location.pathname === "/admin" ||
    globalThis.location.hash === "#admin"
  ) {
    return (
      <LanguageProvider>
        <Admin />
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
            globalThis.location.hash = "activities";
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
        {renderPage()}
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
