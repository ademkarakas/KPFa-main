import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

const AdminAboutPage: React.FC = () => {
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
        <h1>Admin About Yönetimi</h1>
        {/* AdminAbout form component */}
      </div>
    </AdminLayout>
  );
};

export default AdminAboutPage;
