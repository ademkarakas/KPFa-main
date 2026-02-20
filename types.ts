export type Language = "tr" | "de";

export interface Translation {
  [key: string]: string;
}

// ==========================================
// Pagination Response - Backend ile uyumlu
// ==========================================
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ==========================================
// Backend API DTO Tanımları - %100 Uyumlu
// ==========================================

// Address DTO - Backend ile tam uyumlu (PascalCase)
export interface AddressDto {
  Street: string;
  HouseNo?: string;
  ZipCode?: string;
  City: string;
  State?: string;
  Country: string;
}

// Gallery Image DTO - Backend ile tam uyumlu
export interface GalleryImageDto {
  url: string | null;
  base64Data: string | null;
  fileName: string | null;
}

// ==========================================
// Activity DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface CreateActivityCommand {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailedContentTr?: string;
  detailedContentDe?: string;
  dateTr: string;
  dateDe: string;
  dateISO: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ss
  street: string;
  houseNo: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  category: string;
  imageUrl?: string;
  galleryImages?: GalleryImageDto[];
  videoUrl?: string;
  isActive: boolean;
}

export interface UpdateActivityCommand extends CreateActivityCommand {
  id: string; // Guid
}

export interface ActivityDto {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailedContentTr?: string;
  detailedContentDe?: string;
  dateTr: string;
  dateDe: string;
  location: string;
  category: string;
  imageUrl?: string;
  galleryImages: GalleryImageDto[];
  videoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// Course DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface CreateCourseCommand {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailsTr?: string;
  detailsDe?: string;
  scheduleTr?: string;
  scheduleDe?: string;
  icon?: string;
  instructor?: string;
  date?: string; // ISO DateTime
  address?: AddressDto;
  category?: string;
}

export interface UpdateCourseCommand extends CreateCourseCommand {
  id: string; // Guid
  time: string; // ISO DateTime
  isActive: boolean;
}

export interface CourseDto {
  id: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailsTr?: string;
  detailsDe?: string;
  scheduleTr?: string;
  scheduleDe?: string;
  icon?: string;
  instructor?: string;
  date?: string;
  courseLocation?: string;
  courseCategory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// TeaEvent DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface CreateTeaEventCommand {
  titleTr: string;
  titleDe: string;
  introTr: string;
  introDe: string;
  heritageTextTr: string;
  heritageTextDe: string;
  participationTextTr: string;
  participationTextDe: string;
  contactEmail: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

export interface UpdateTeaEventCommand {
  id: string; // Guid
  titleTr: string;
  titleDe: string;
  introTr: string;
  introDe: string;
  heritageTextTr: string;
  heritageTextDe: string;
  participationTextTr: string;
  participationTextDe: string;
  contactEmail: string;
  date: string;
  time: string;
}

export interface TeaEventDto {
  id: string;
  titleTr: string;
  titleDe: string;
  introTr: string;
  introDe: string;
  heritageTextTr: string;
  heritageTextDe: string;
  participationTextTr: string;
  participationTextDe: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  contactEmail: string;
  isActive: boolean;
}

// ==========================================
// Partner DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface CreatePartnerCommand {
  name: string;
  displayOrder: number;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface UpdatePartnerCommand extends CreatePartnerCommand {
  id: string; // Guid
  isActive: boolean;
}

export interface PartnerDto {
  id: string;
  name: string;
  displayOrder: number;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
}

// ==========================================
// Imprint DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface ImprintDto {
  id: string;
  organizationName: string;
  organizationType: string;
  address: AddressDto;
  email: string;
  phone: string;
  president: string;
  vicePresident: string;
  legalStructureTurkish: string;
  legalStructureGerman: string;
  purposeTurkish: string;
  purposeGerman: string;
  taxExemptionTurkish: string;
  taxExemptionGerman: string;
  contentResponsibilityTurkish: string;
  contentResponsibilityGerman: string;
  linksResponsibilityTurkish: string;
  linksResponsibilityGerman: string;
  copyrightTurkish: string;
  copyrightGerman: string;
}

// ==========================================
// Contact Info DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface SocialMediaLinksDto {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface SaveContactInfoDto {
  email: string;
  phone: string;
  address: AddressDto;
  socialMedia?: SocialMediaLinksDto;
  officeHours?: string;
}

// ==========================================
// GuelenMovement DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface CreateGuelenMovementCommand {
  titleTr: string;
  titleDe: string;
  contentTr: string;
  contentDe: string;
  imageUrl: string;
}

export interface UpdateGuelenMovementCommand extends CreateGuelenMovementCommand {
  id: string; // Guid
}

// ==========================================
// DonatePage DTOs - Backend ile %100 Uyumlu
// ==========================================
export interface UpdateDonatePageCommand {
  id: string; // Guid
  heroTitleTr: string;
  heroTitleDe: string;
  heroSubtitleTr: string;
  heroSubtitleDe: string;
  heroImageUrl: string;
  accountHolder: string;
  iban: string;
  bankName: string;
  contentTr: string;
  contentDe: string;
}

// ==========================================
// Legacy Interfaces (Frontend kullanımı için)
// ==========================================
export interface Activity {
  id: string;
  title: Translation;
  description: Translation;
  detailedContent?: Translation;
  date: Translation;
  dateISO: string;
  location: string;
  category: "music" | "art" | "education" | "social" | "sports";
  imageUrl: string;
  galleryImages?: GalleryImageDto[];
  videoUrl?: string;
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
  date?: string; // Formatlanmış tarih (DD.MM.YYYY)
  dateISO?: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ss
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
  | "volunteer-form"
  | "newsletter-verify"
  | "newsletter-unsubscribe";
