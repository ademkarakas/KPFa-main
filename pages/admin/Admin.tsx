import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminActivities from "./AdminActivities";
import AdminCourses from "./AdminCourses";
import AdminTeam from "./AdminTeam";
import AdminVolunteers from "./AdminVolunteers";
import AdminContactSettings from "./AdminContactSettings";
import AdminVolunteerPage from "./AdminVolunteerPage";
import AdminSatzung from "./AdminSatzung";
import AdminGuelen from "./AdminGuelen";
import AdminTeegespraeche from "./AdminTeegespraeche";
import AdminDonate from "./AdminDonate";
import AdminImprint from "./AdminImprint";
import AdminAbout from "./AdminAbout";
import AdminHome from "./AdminHome";
import AdminNewsletterSubscribers from "./AdminNewsletterSubscribers";
import AdminNewsletterCampaigns from "./AdminNewsletterCampaigns";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authKey, setAuthKey] = useState(0); // Force remount on login

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAuthKey((prev) => prev + 1); // Force remount all components
    // Force remount of all admin components by resetting current page
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
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
      case "imprint":
        return <AdminImprint />;
      case "newsletter-subscribers":
        return <AdminNewsletterSubscribers />;
      case "newsletter-campaigns":
        return <AdminNewsletterCampaigns />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      key={authKey}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default Admin;
