// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7189/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("adminToken", token);
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem("adminToken");
};

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ API Request WITHOUT TOKEN:", endpoint);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  // 204 No Content veya boş body kontrolü
  const contentType = response.headers.get("content-type");
  if (
    response.status === 204 ||
    !contentType ||
    !contentType.includes("application/json")
  ) {
    return {} as T; // Boş obje döndür
  }

  const text = await response.text();
  if (!text) {
    return {} as T; // Boş response
  }

  return JSON.parse(text) as T;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<{
      [x: string]: string;
      token: string;
      email: string;
      name?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiFetch<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    clearAuthToken();
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Activities API
export const activitiesApi = {
  getAll: (includeInactive = false) =>
    apiFetch<any[]>(`/activities?includeInactive=${includeInactive}`),

  getById: (id: number) => apiFetch<any>(`/activities/${id}`),

  create: (activity: any) =>
    apiFetch<any>("/activities", {
      method: "POST",
      body: JSON.stringify(activity),
    }),

  update: (id: number, activity: any) =>
    apiFetch<any>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activity),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/activities/${id}`, {
      method: "DELETE",
    }),
};

// Courses API
export const coursesApi = {
  getAll: (includeInactive = false) =>
    apiFetch<any[]>(`/courses?includeInactive=${includeInactive}`),

  getById: (id: number) => apiFetch<any>(`/courses/${id}`),

  create: (course: any) =>
    apiFetch<any>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    }),

  update: (id: number, course: any) =>
    apiFetch<any>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// Team Members API
export const teamMembersApi = {
  getAll: (includeInactive = false) =>
    apiFetch<any[]>(`/teammembers?includeInactive=${includeInactive}`),

  getById: (id: number) => apiFetch<any>(`/teammembers/${id}`),

  create: (teamMember: any) =>
    apiFetch<any>("/teammembers", {
      method: "POST",
      body: JSON.stringify(teamMember),
    }),

  update: (id: number, teamMember: any) =>
    apiFetch<any>(`/teammembers/${id}`, {
      method: "PUT",
      body: JSON.stringify(teamMember),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/teammembers/${id}`, {
      method: "DELETE",
    }),
};

// Value Items API
export const valueItemsApi = {
  getAll: (includeInactive = false) =>
    apiFetch<any[]>(`/valueitems?includeInactive=${includeInactive}`),

  getById: (id: number) => apiFetch<any>(`/valueitems/${id}`),

  create: (valueItem: any) =>
    apiFetch<any>("/valueitems", {
      method: "POST",
      body: JSON.stringify(valueItem),
    }),

  update: (id: number, valueItem: any) =>
    apiFetch<any>(`/valueitems/${id}`, {
      method: "PUT",
      body: JSON.stringify(valueItem),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/valueitems/${id}`, {
      method: "DELETE",
    }),
};

// Partners API
export const partnersApi = {
  getAll: (includeInactive = false) =>
    apiFetch<any[]>(`/partners?includeInactive=${includeInactive}`),

  getById: (id: number) => apiFetch<any>(`/partners/${id}`),

  create: (partner: any) =>
    apiFetch<any>("/partners", {
      method: "POST",
      body: JSON.stringify(partner),
    }),

  update: (id: number, partner: any) =>
    apiFetch<any>(`/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(partner),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/partners/${id}`, {
      method: "DELETE",
    }),
};

// Page Contents API
export const pageContentsApi = {
  getAll: () => apiFetch<any[]>("/pagecontents"),

  getByPage: (pageName: string) => apiFetch<any[]>(`/pagecontents/${pageName}`),

  getByPageAndSection: (pageName: string, sectionKey: string) =>
    apiFetch<any>(`/pagecontents/${pageName}/${sectionKey}`),

  create: (pageContent: any) =>
    apiFetch<any>("/pagecontents", {
      method: "POST",
      body: JSON.stringify(pageContent),
    }),

  update: (id: number, pageContent: any) =>
    apiFetch<any>(`/pagecontents/${id}`, {
      method: "PUT",
      body: JSON.stringify(pageContent),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/pagecontents/${id}`, {
      method: "DELETE",
    }),
};

// Volunteers API
export const volunteersApi = {
  submit: (submission: any) =>
    apiFetch<any>("/volunteersubmissions", {
      method: "POST",
      body: JSON.stringify(submission),
    }),

  getAll: (processedOnly = false) =>
    apiFetch<any[]>(`/volunteersubmissions?processedOnly=${processedOnly}`),

  getById: (id: number) => apiFetch<any>(`/volunteersubmissions/${id}`),

  markAsProcessed: (id: number) =>
    apiFetch<{ message: string }>(`/volunteersubmissions/${id}/process`, {
      method: "PATCH",
    }),

  delete: (id: number) =>
    apiFetch<void>(`/volunteersubmissions/${id}`, {
      method: "DELETE",
    }),
};

// File Upload API
export const uploadApi = {
  uploadFile: async (
    file: File
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

export const imprintApi = {
  // Künye bilgilerini getir
  get: () => apiFetch<any>("/Imprint"),

  // Künye bilgilerini güncelle (Admin)
  update: (data: any) =>
    apiFetch<any>("/Imprint", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
