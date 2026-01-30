import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useTranslation } from "react-i18next";

const AdminAboutPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState("about");
  const handleLogout = () => {
    // logout logic
  };
  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      <div>
        <h1>{t("admin_about_page_title")}</h1>
        {/* AdminAbout form component */}
      </div>
    </AdminLayout>
  );
};

export default AdminAboutPage;
