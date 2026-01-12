import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminActivities from "./AdminActivities";
import AdminCourses from "./AdminCourses";
import AdminTeam from "./AdminTeam";
import AdminPartners from "./AdminPartners";
import AdminPageContents from "./AdminPageContents";
import AdminVolunteers from "./AdminVolunteers";
import AdminContactSettings from "./AdminContactSettings";
import AdminVolunteerPage from "./AdminVolunteerPage";
import AdminSatzung from "./AdminSatzung";
import AdminGuelen from "./AdminGuelen";
import AdminTeegespraeche from "./AdminTeegespraeche";
import AdminDonate from "./AdminDonate";
import AdminTranslations from "./AdminTranslations";
import AdminImprint from "./AdminImprint";
import AdminAbout from "./AdminAbout";
import AdminHome from "./AdminHome";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <AdminHome />;
      case "dashboard":
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case "activities":
        return <AdminActivities />;
      case "about-us":
        return <AdminAbout />;
      case "teegespraeche":
        return <AdminTeegespraeche />;
      case "courses":
        return <AdminCourses />;
      case "team":
        return <AdminTeam />;
      case "partners":
        return <AdminPartners />;
      case "pages":
        return <AdminPageContents />;
      case "satzung":
        return <AdminSatzung />;
      case "guelen":
        return <AdminGuelen />;
      case "donate":
        return <AdminDonate />;
      case "volunteers":
        return <AdminVolunteers />;
      case "volunteer-page":
        return <AdminVolunteerPage />;
      case "contact":
        return <AdminContactSettings />;
      case "translations":
        return <AdminTranslations />;
      case "imprint":
        return <AdminImprint />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default Admin;
