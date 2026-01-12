export type Language = "tr" | "de";

export interface Translation {
  [key: string]: string;
}

export interface Activity {
  id: string;
  title: Translation;
  description: Translation;
  detailedContent?: Translation; // Detaylı içerik
  date: Translation;
  dateISO: string; // ISO 8601 format: YYYY-MM-DD
  location: string;
  category: "music" | "art" | "education" | "social";
  imageUrl: string;
  galleryImages?: string[]; // Galeri fotoğrafları
  videoUrl?: string; // Video URL (opsiyonel)
}

export interface ParticipantForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Course {
  id: string;
  title: Translation;
  description: Translation;
  details?: Translation; // Extended details for the modal
  schedule?: Translation;
  icon: string; // lucide icon name
  instructor?: string; // Kursu veren kişi
  date?: string; // Tarih (YYYY-MM-DD format)
  address?: string; // Adres
}

export interface TeamMember {
  id: string;
  name: string;
  role: Translation;
  bio: Translation;
  imageUrl: string;
}

export interface ValueItem {
  id: string;
  title: Translation;
  description: Translation;
}

export interface Partner {
  id: string;
  name: string;
  description?: { tr: string; de: string };
  logoUrl: string;
  websiteUrl: string;
}

export type PageView =
  | "home"
  | "about"
  | "activities"
  | "courses"
  | "contact"
  | "donate"
  | "teegespraeche"
  | "privacy"
  | "imprint"
  | "satzung"
  | "guelen"
  | "volunteer"
  | "volunteer-form";
