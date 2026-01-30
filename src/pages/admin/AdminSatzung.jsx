import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

// Security utilities - matching AdminVolunterPage patterns
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input.trim());
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    Object.keys(input).forEach((key) => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  return input;
};

const getCsrfToken = () => {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") || ""
  );
};

const AdminSatzung = () => {
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [satzungData, setSatzungData] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // RBAC - Role-based access control (copied from AdminVolunterPage)
  const checkAdminAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/verify-admin", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const verifyAccess = async () => {
      const authorized = await checkAdminAuth();
      setIsAuthorized(authorized);
      setIsLoading(false);
      if (authorized) {
        fetchSatzungData();
      }
    };
    verifyAccess();
  }, [checkAdminAuth]);

  // Fetch data - preserving existing backend integration
  const fetchSatzungData = async () => {
    try {
      const response = await fetch("/api/satzung", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSatzungData(data);
      }
    } catch (err) {
      setError(t("satzung.saveError"));
    }
  };

  // Handle input change with XSS protection
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit with CSRF protection
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate
    if (!formData.title || !formData.content) {
      setError(t("satzung.validationError"));
      return;
    }

    // Sanitize input (XSS protection)
    const sanitizedData = sanitizeInput(formData);
    const csrfToken = getCsrfToken();

    try {
      const response = await fetch("/api/satzung", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setSuccess(t("satzung.saveSuccess"));
        setFormData({ title: "", content: "" });
        fetchSatzungData();
      } else {
        setError(t("satzung.saveError"));
      }
    } catch {
      setError(t("satzung.saveError"));
    }
  };

  // Delete with CSRF protection
  const handleDelete = async (id) => {
    if (!window.confirm(t("satzung.confirmDelete"))) return;

    const csrfToken = getCsrfToken();

    try {
      const response = await fetch(`/api/satzung/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (response.ok) {
        setSuccess(t("satzung.deleteSuccess"));
        fetchSatzungData();
      } else {
        setError(t("satzung.deleteError"));
      }
    } catch {
      setError(t("satzung.deleteError"));
    }
  };

  if (isLoading) {
    return <div className="admin-panel">{t("common.loading")}</div>;
  }

  if (!isAuthorized) {
    return <div className="admin-panel">{t("admin.unauthorized")}</div>;
  }

  return (
    <div className="admin-panel admin-container">
      <header className="admin-panel-header">
        <h1>{t("satzung.pageTitle")}</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">{t("satzung.titleLabel")}</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("satzung.titlePlaceholder")}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">{t("satzung.contentLabel")}</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder={t("satzung.contentPlaceholder")}
            className="form-control"
            rows={6}
          />
        </div>

        <button type="submit" className="btn btn-primary admin-primary-button">
          {t("satzung.submitButton")}
        </button>
      </form>

      <div className="satzung-list">
        {satzungData.map((item) => (
          <div key={item.id} className="satzung-item">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <div className="satzung-actions">
              <button className="btn btn-secondary">
                {t("satzung.editButton")}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                {t("satzung.deleteButton")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSatzung;
