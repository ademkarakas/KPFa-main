// API Configuration
import {
  ActivityDto,
  CreateActivityCommand,
  UpdateActivityCommand,
  CourseDto,
  CreateCourseCommand,
  UpdateCourseCommand,
  TeamMember,
  ValueItem,
  PartnerDto,
  CreatePartnerCommand,
  UpdatePartnerCommand,
  PaginatedResponse,
} from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7189/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

// Helper function to decode JWT token
const decodeJWT = (
  token: string,
): { exp?: number; [key: string]: unknown } | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Add 60 second buffer - consider expired if within 1 minute of expiry
  return currentTime >= expirationTime - 60000;
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("adminToken", token);
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminRole");
};

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> {
  const token = getAuthToken();

  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    clearAuthToken();
    throw new Error("Session expired. Please login again.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    signal, // Pass abort signal to fetch
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  // 204 No Content veya boş body kontrolü
  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType?.includes("application/json")) {
    return {} as T; // Boş obje döndür
  }

  const text = await response.text();
  if (!text) {
    return {} as T; // Boş response
  }

  return JSON.parse(text) as T;
}

// Types
export interface AdminDto {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface LoginResponse extends AdminDto {
  token: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);

      // Store admin ID for future API calls
      let adminId: string | undefined = response.id;

      // If ID is not in response, try to decode from JWT token
      if (!adminId) {
        const decoded = decodeJWT(response.token);
        // Try common JWT claim names for user ID
        const claimValue =
          decoded?.sub ||
          decoded?.userId ||
          decoded?.nameid ||
          decoded?.[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        adminId = typeof claimValue === "string" ? claimValue : undefined;
      }

      if (adminId) {
        localStorage.setItem("adminId", adminId);
      } else {
        console.warn(
          "Could not extract admin ID from login response or JWT token",
        );
      }
    }
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiFetch<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Admin ID not found. Please login again.");
    }

    const response = await apiFetch<AdminDto>(`/Admins/${adminId}`, {
      method: "PUT",
      body: JSON.stringify({
        id: adminId,
        email: data.email || localStorage.getItem("adminEmail") || "",
        name: data.name || localStorage.getItem("adminName") || "",
      }),
    });
    // Update localStorage with new values
    if (data.name) {
      localStorage.setItem("adminName", data.name);
    }
    if (data.email) {
      localStorage.setItem("adminEmail", data.email);
    }
    return response;
  },

  logout: () => {
    clearAuthToken();
    // Redirect to home page
    if (typeof globalThis !== "undefined") {
      globalThis.history.pushState(null, "", "/");
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
  },

  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    if (!token) return false;

    // Check if token is expired
    if (isTokenExpired(token)) {
      clearAuthToken();
      return false;
    }

    return true;
  },
};

// Activities API - Backend Guid tipi ile uyumlu
export const activitiesApi = {
  getAll: async (includeInactive = false, signal?: AbortSignal) => {
    const response = await apiFetch<PaginatedResponse<ActivityDto>>(
      `/activities?includeInactive=${includeInactive}`,
      {},
      signal,
    );
    // Backend pagination response'undan items array'ini döndür
    return response.items || [];
  },

  getById: (id: string, signal?: AbortSignal) =>
    apiFetch<ActivityDto>(`/activities/${id}`, {}, signal),

  create: (activity: CreateActivityCommand) =>
    apiFetch<ActivityDto>("/activities", {
      method: "POST",
      body: JSON.stringify(activity),
    }),

  update: (id: string, activity: UpdateActivityCommand) =>
    apiFetch<ActivityDto>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activity),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/activities/${id}`, {
      method: "DELETE",
    }),
};

// Courses API - Backend Guid tipi ile uyumlu - Backend Guid tipi ile uyumlu
export const coursesApi = {
  getAll: async (includeInactive = false, signal?: AbortSignal) => {
    // Not: Courses endpoint direkt array dönüyor, pagination wrapper yok
    const response = await apiFetch<CourseDto[]>(
      `/courses?includeInactive=${includeInactive}`,
      {},
      signal,
    );
    return response || [];
  },

  getById: (id: string) => apiFetch<CourseDto>(`/courses/${id}`),

  create: (course: CreateCourseCommand) =>
    apiFetch<CourseDto>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    }),

  update: (id: string, course: UpdateCourseCommand) =>
    apiFetch<CourseDto>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// Team Members API - Backend Guid tipi ile uyumlu
export const teamMembersApi = {
  getAll: (includeInactive = false) =>
    apiFetch<TeamMember[]>(`/teammembers?includeInactive=${includeInactive}`),

  getById: (id: string) => apiFetch<TeamMember>(`/teammembers/${id}`),

  create: (teamMember: Partial<TeamMember>) =>
    apiFetch<TeamMember>("/teammembers", {
      method: "POST",
      body: JSON.stringify(teamMember),
    }),

  update: (id: string, teamMember: Partial<TeamMember>) =>
    apiFetch<TeamMember>(`/teammembers/${id}`, {
      method: "PUT",
      body: JSON.stringify(teamMember),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/teammembers/${id}`, {
      method: "DELETE",
    }),
};

// Value Items API - Backend Guid tipi ile uyumlu
export const valueItemsApi = {
  getAll: (includeInactive = false) =>
    apiFetch<ValueItem[]>(`/valueitems?includeInactive=${includeInactive}`),

  getById: (id: string) => apiFetch<ValueItem>(`/valueitems/${id}`),

  create: (valueItem: Partial<ValueItem>) =>
    apiFetch<ValueItem>("/valueitems", {
      method: "POST",
      body: JSON.stringify(valueItem),
    }),

  update: (id: string, valueItem: Partial<ValueItem>) =>
    apiFetch<ValueItem>(`/valueitems/${id}`, {
      method: "PUT",
      body: JSON.stringify(valueItem),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/valueitems/${id}`, {
      method: "DELETE",
    }),
};

// Partners API - Backend Guid tipi ile uyumlu
export const partnersApi = {
  getAll: (includeInactive = false) =>
    apiFetch<PartnerDto[]>(`/partners?includeInactive=${includeInactive}`),

  getById: (id: string) => apiFetch<PartnerDto>(`/partners/${id}`),

  create: (partner: CreatePartnerCommand) =>
    apiFetch<PartnerDto>("/partners", {
      method: "POST",
      body: JSON.stringify(partner),
    }),

  update: (id: string, partner: UpdatePartnerCommand) =>
    apiFetch<PartnerDto>(`/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(partner),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/partners/${id}`, {
      method: "DELETE",
    }),
};

// Page Contents API - Backend Guid tipi ile uyumlu
interface PageContentDto {
  id: string;
  pageName: string;
  sectionKey: string;
  contentTr: string;
  contentDe: string;
  displayOrder?: number;
  isActive: boolean;
}

export const pageContentsApi = {
  getAll: () => apiFetch<PageContentDto[]>("/pagecontents"),

  getByPage: (pageName: string) =>
    apiFetch<PageContentDto[]>(`/pagecontents/${pageName}`),

  getByPageAndSection: (pageName: string, sectionKey: string) =>
    apiFetch<PageContentDto>(`/pagecontents/${pageName}/${sectionKey}`),

  create: (pageContent: Partial<PageContentDto>) =>
    apiFetch<PageContentDto>("/pagecontents", {
      method: "POST",
      body: JSON.stringify(pageContent),
    }),

  update: (id: string, pageContent: Partial<PageContentDto>) =>
    apiFetch<PageContentDto>(`/pagecontents/${id}`, {
      method: "PUT",
      body: JSON.stringify(pageContent),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/pagecontents/${id}`, {
      method: "DELETE",
    }),
};

// Volunteers API - Backend Guid tipi ile uyumlu
interface VolunteerSubmissionDto {
  id: string;
  fullName: string; // Backend returns FullName (PascalCase)
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  isProcessed: boolean;
}

interface CreateVolunteerSubmissionCommand {
  fullName: string; // Backend expects FullName (PascalCase)
  email: string; // Backend expects Email
  phone: string; // Backend expects Phone
  message: string; // Backend expects Message
}

export const volunteersApi = {
  submit: (submission: CreateVolunteerSubmissionCommand) =>
    apiFetch<VolunteerSubmissionDto>("/volunteersubmissions", {
      method: "POST",
      body: JSON.stringify(submission),
    }),

  getAll: (processedOnly = false) =>
    apiFetch<VolunteerSubmissionDto[]>(
      `/volunteersubmissions?processedOnly=${processedOnly}`,
    ),

  getById: (id: string) =>
    apiFetch<VolunteerSubmissionDto>(`/volunteersubmissions/${id}`),

  markAsProcessed: (id: string) =>
    apiFetch<{ message: string }>(`/volunteersubmissions/${id}/process`, {
      method: "PATCH",
    }),

  delete: (id: string) =>
    apiFetch<void>(`/volunteersubmissions/${id}`, {
      method: "DELETE",
    }),
};

// File Upload API
export const uploadApi = {
  uploadFile: async (
    file: File,
  ): Promise<{ fileName: string; url: string; size: number }> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  deleteFile: (fileName: string) =>
    apiFetch<{ message: string }>(`/upload/${fileName}`, {
      method: "DELETE",
    }),
};

// Contact Info API
export const contactInfoApi = {
  // İletişim bilgilerini al (Public)
  get: () => apiFetch<any>("/contactinfo"),

  // İletişim sayfası içeriği (Public - Frontend için)
  getPage: () => apiFetch<any>("/contactinfo/page"),

  // İletişim bilgilerini güncelle (Admin)
  update: (contactInfo: any) =>
    apiFetch<any>("/contactinfo", {
      method: "PUT",
      body: JSON.stringify(contactInfo),
    }),

  // İletişim mesajı gönder (Public - Contact form)
  sendMessage: (message: any) =>
    apiFetch<any>("/contactinfo/message", {
      method: "POST",
      body: JSON.stringify(message),
    }),
};

export const localizationApi = {
  // Tüm çevirileri getir (Admin)
  getAll: () => apiFetch<any>("/LocalizationResources"),

  // Belirli bir section'ın çevirilerini getir
  getBySection: (section: string) =>
    apiFetch<any>(`/LocalizationResources/section/${section}`),

  // Yeni çeviri oluştur (Admin)
  create: (translation: any) =>
    apiFetch<any>("/LocalizationResources", {
      method: "POST",
      body: JSON.stringify(translation),
    }),

  // Çeviri güncelle (Admin)
  update: (id: string, translation: any) =>
    apiFetch<any>(`/LocalizationResources/${id}`, {
      method: "PUT",
      body: JSON.stringify(translation),
    }),

  // Çeviri sil (Admin)
  delete: (id: string) =>
    apiFetch<any>(`/LocalizationResources/${id}`, {
      method: "DELETE",
    }),
};

// Imprint API - Backend ile %100 Uyumlu
export const imprintApi = {
  // Künye bilgilerini getir
  get: () => apiFetch<any>("/imprint"),

  // Künye oluştur (Admin)
  create: (data: any) =>
    apiFetch<any>("/imprint", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Künye bilgilerini güncelle (Admin)
  update: (id: string, data: any) =>
    apiFetch<any>(`/imprint/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Künye sil (Admin)
  delete: (id: string) =>
    apiFetch<void>(`/imprint/${id}`, {
      method: "DELETE",
    }),
};

// TeaEvent API - Backend ile %100 Uyumlu
export const teaEventApi = {
  getAll: () => apiFetch<any[]>("/teaevent"),

  getById: (id: string) => apiFetch<any>(`/teaevent/${id}`),

  create: (teaEvent: any) =>
    apiFetch<any>("/teaevent", {
      method: "POST",
      body: JSON.stringify(teaEvent),
    }),

  update: (id: string, teaEvent: any) =>
    apiFetch<any>(`/teaevent/${id}`, {
      method: "PUT",
      body: JSON.stringify(teaEvent),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/teaevent/${id}`, {
      method: "DELETE",
    }),
};

// Satzung API - Backend ile %100 Uyumlu
export const satzungApi = {
  getAll: () => apiFetch<any[]>("/satzung"),

  getById: (id: string) => apiFetch<any>(`/satzung/${id}`),

  getByKey: (key: string) => apiFetch<any>(`/satzung/${key}`),

  create: (satzung: any) =>
    apiFetch<any>("/satzung", {
      method: "POST",
      body: JSON.stringify(satzung),
    }),

  update: (id: string, satzung: any) =>
    apiFetch<any>(`/satzung/${id}`, {
      method: "PUT",
      body: JSON.stringify(satzung),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/satzung/${id}`, {
      method: "DELETE",
    }),
};

// GuelenMovement API - Backend ile %100 Uyumlu
export const guelenMovementApi = {
  getAll: () => apiFetch<any[]>("/guelenmovement"),

  getById: (id: string) => apiFetch<any>(`/guelenmovement/${id}`),

  create: (data: any) =>
    apiFetch<any>("/guelenmovement", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/guelenmovement/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/guelenmovement/${id}`, {
      method: "DELETE",
    }),
};

// DonatePage API - Backend ile %100 Uyumlu
export const donatePageApi = {
  get: () => apiFetch<any>("/donatepage"),

  update: (id: string, data: any) =>
    apiFetch<any>(`/donatepage/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// AboutUs API - Backend ile %100 Uyumlu
export const aboutUsApi = {
  get: () => apiFetch<any>("/aboutus"),

  update: (data: any) =>
    apiFetch<any>("/aboutus", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  createOrUpdate: (data: any) =>
    apiFetch<any>("/aboutus", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
