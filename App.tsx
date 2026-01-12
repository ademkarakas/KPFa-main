import React, { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
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
import Admin from "./pages/admin/Admin";
import { Language, PageView } from "./types";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>("tr");
  const [currentPage, setCurrentPage] = useState<PageView>("home");

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
    switch (currentPage) {
      case "home":
        return <Home lang={lang} setPage={setCurrentPage} />;
      case "about":
        return <About lang={lang} />;
      case "activities":
        return <Activities lang={lang} />;
      case "courses":
        return <Courses lang={lang} setPage={setCurrentPage} />;
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
