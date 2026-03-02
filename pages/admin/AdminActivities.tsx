import React, { useState, useEffect, useRef } from "react";
import { isRequestCancelled } from "../../hooks/useCancelableRequest";
import { GalleryImageDto } from "../../types";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  Languages,
} from "lucide-react";
import { activitiesApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ConfirmDialog from "../../components/ConfirmDialog";

// --- React 19 Uyumlu Modern Editör Bileşeni ---
const QuillEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder: placeholder ?? "",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
      });

      quill.on("text-change", () => {
        if (!isUpdating.current) {
          const html = quill.root.innerHTML;
          onChange(html === "<p><br></p>" ? "" : html);
        }
      });

      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      const normalizedValue = value || "";
      const normalizedCurrent =
        currentContent === "<p><br></p>" ? "" : currentContent;

      if (normalizedValue !== normalizedCurrent) {
        isUpdating.current = true;
        quillRef.current.root.innerHTML = normalizedValue;
        setTimeout(() => {
          isUpdating.current = false;
        }, 100);
      }
    }
  }, [value]);

  return (
    <div className="quill-modern-container">
      <div ref={containerRef} />
    </div>
  );
};

interface GalleryImage {
  url: string | null;
  base64Data: string | null;
  fileName: string | null;
}

interface ActivityFormData {
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  detailedContentTr: string;
  detailedContentDe: string;
  date: string;
  location: string;
  address?: {
    street?: string;
    houseNo?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  category: string;
  imageUrl: string | null;
  imageBase64: string | null;
  imageFileName: string | null;
  videoUrl: string;
  galleryImages: GalleryImage[];
  isActive: boolean;
}

type NotificationType = "success" | "error" | "info";

const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  // Modern bildirim sistemi
  const [notification, setNotification] = useState<{
    show: boolean;
    type: NotificationType;
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 3000);
  };

  const notificationThemeByType: Record<NotificationType, string> = {
    success:
      "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800",
    error:
      "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-800",
    info: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800",
  };

  const renderNotificationIcon = (type: NotificationType) => {
    if (type === "success") {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }

    if (type === "error") {
      return (
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  const readAsDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(reader.error ?? new Error("File could not be read"));
      reader.readAsDataURL(blob);
    });

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = src;
    });

  const canvasToJpegBlob = (
    canvas: HTMLCanvasElement,
    quality: number,
  ): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas compression failed"));
        },
        "image/jpeg",
        quality,
      );
    });

  // Build activity DTO that matches backend CreateActivityCommand / UpdateActivityCommand
  // Backend uses flat fields: DateTr, DateDe, DateISO, Street, HouseNo, City, State, Country, ZipCode
  const buildActivityDto = (id: string | null, data: ActivityFormData) => {
    // Parse date and generate localized date strings
    const dateISO = data.date ? new Date(data.date) : new Date();
    const dateTr = dateISO.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const dateDe = dateISO.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Extract address components - backend uses flat fields, not nested Address object
    const address = data.address || {};

    // Always send required fields for backend validation
    return {
      ...(id && { id }),
      titleTr: data.titleTr,
      titleDe: data.titleDe,
      descriptionTr: data.descriptionTr,
      descriptionDe: data.descriptionDe,
      detailedContentTr: data.detailedContentTr || undefined,
      detailedContentDe: data.detailedContentDe || undefined,
      // Backend expects both flat and objects (PascalCase for command validation)
      dateTr: dateTr,
      dateDe: dateDe,
      dateISO: dateISO.toISOString(),
      date: dateISO.toISOString(),
      Date: dateISO.toISOString(),

      // Backend expects both flat and objects
      street: address.street || data.location || "",
      houseNo: address.houseNo || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "Deutschland",
      zipCode: address.zipCode || "",
      address: {
        street: address.street || data.location || "",
        houseNo: address.houseNo || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "Deutschland",
        zipCode: address.zipCode || "",
      },
      Address: {
        Street: address.street || data.location || "",
        HouseNo: address.houseNo || "",
        City: address.city || "",
        State: address.state || "",
        Country: address.country || "Deutschland",
        ZipCode: address.zipCode || "",
      },
      category: data.category,
      imageUrl: data.imageBase64 ? undefined : data.imageUrl || undefined,
      imageBase64: data.imageBase64 || undefined,
      imageFileName: data.imageFileName || undefined,
      galleryImages: data.galleryImages
        .filter((img) => img.url || img.base64Data)
        .map((img) => ({
          url: img.url || null,
          base64Data: img.base64Data || null,
          fileName: img.fileName || null,
        })) as GalleryImageDto[],
      videoUrl: data.videoUrl || undefined,
      isActive: data.isActive,
    };
  };

  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [formData, setFormData] = useState<ActivityFormData>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    detailedContentTr: "",
    detailedContentDe: "",
    date: "",
    location: "",
    address: undefined,
    category: "music",
    imageUrl: null,
    imageBase64: null,
    imageFileName: null,
    videoUrl: "",
    galleryImages: [],
    isActive: true,
  });

  const loadActivities = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = await activitiesApi.getAll(true, signal);
      const formatted = data.map(formatAdminActivity);
      setActivities(formatted);
    } catch (error) {
      if (!isRequestCancelled(error)) {
        console.error("Etkinlikler yüklenirken hata:", error);
        showNotification("error", t("admin_activities_load_failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    loadActivities(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Use same compression as gallery images for consistency
      const compressed = await convertFileToBase64(file);

      setFormData({
        ...formData,
        imageBase64: compressed.base64Data,
        imageFileName: compressed.fileName,
        imageUrl: null, // Clear URL when using Base64
      });

      const sizeKB = compressed.base64Data
        ? (compressed.base64Data.length * 0.75) / 1024
        : 0;
      showNotification(
        "success",
        `${t("admin_activities_image_upload_success")} (${sizeKB.toFixed(0)}KB)`,
      );
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      const fallbackMessage = t("admin_activities_image_upload_failed");
      const errorMessage =
        error instanceof Error ? error.message : fallbackMessage;
      showNotification("error", errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  // Compress image using canvas
  const compressImage = (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.7,
  ): Promise<Blob> => {
    return (async () => {
      const dataUrl = await readAsDataUrl(file);
      const img = await loadImage(dataUrl);

      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      return canvasToJpegBlob(canvas, quality);
    })();
  };

  const convertFileToBase64 = async (file: File): Promise<GalleryImage> => {
    // Validate file size (max 5MB before compression)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      const currentSizeMb = (file.size / 1024 / 1024).toFixed(2);
      throw new Error(
        `${t("admin_activities_file_too_large")} ${currentSizeMb}MB`,
      );
    }

    const compressedBlob = await compressImage(file, 1200, 1200, 0.7);
    const dataUrl = await readAsDataUrl(compressedBlob);
    const base64String = dataUrl.split(",")[1] ?? "";

    // Check base64 size (max 2MB)
    const base64Size = base64String.length * 0.75;
    const MAX_BASE64_SIZE = 2 * 1024 * 1024;
    if (base64Size > MAX_BASE64_SIZE) {
      throw new Error(t("admin_activities_compressed_image_too_large"));
    }

    return {
      url: null,
      base64Data: base64String,
      fileName: file.name,
    };
  };

  const processGalleryFiles = async (filesToProcess: File[]) => {
    const processedItems: GalleryImage[] = [];
    const errors: string[] = [];

    for (const file of filesToProcess) {
      try {
        const item = await convertFileToBase64(file);
        processedItems.push(item);
      } catch (fileError) {
        const errorMsg =
          fileError instanceof Error
            ? fileError.message
            : t("admin_unknown_error");
        errors.push(`${file.name}: ${errorMsg}`);
      }
    }

    return { processedItems, errors };
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);

      // Max 10 gallery images total
      const MAX_GALLERY_IMAGES = 10;
      const currentGalleryCount = formData.galleryImages.length;
      const remainingSlots = MAX_GALLERY_IMAGES - currentGalleryCount;

      if (remainingSlots <= 0) {
        showNotification(
          "error",
          `${t("admin_activities_gallery_limit_reached")} (${MAX_GALLERY_IMAGES} max)`,
        );
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const { processedItems, errors } =
        await processGalleryFiles(filesToProcess);

      if (processedItems.length > 0) {
        setFormData({
          ...formData,
          galleryImages: [...formData.galleryImages, ...processedItems],
        });

        showNotification(
          "success",
          `${processedItems.length} ${t("admin_activities_gallery_upload_success")}`,
        );
      }

      if (errors.length > 0) {
        showNotification(
          "error",
          `${errors.length} ${t("admin_activities_gallery_upload_failed")} ${errors.join(", ")}`,
        );
      }
    } catch (error) {
      console.error("Galeri resimleri yüklenirken hata:", error);
      showNotification(
        "error",
        t("admin_activities_gallery_upload_failed_generic"),
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const dto = buildActivityDto(editingId, formData);

      // Check approximate payload size to prevent header size errors
      const payloadSize = JSON.stringify(dto).length;
      const MAX_PAYLOAD_SIZE = 20 * 1024 * 1024; // 20MB
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        const payloadMb = (payloadSize / 1024 / 1024).toFixed(2);
        showNotification(
          "error",
          `${t("admin_activities_payload_too_large")} (${payloadMb}MB). ${t("admin_activities_payload_too_large_hint")}`,
        );
        return;
      }

      if (editingId) {
        // Update requires id in the DTO
        await activitiesApi.update(editingId, { ...dto, id: editingId });
        showNotification("success", t("admin_activities_update_success"));
      } else {
        // Create doesn't need id
        const { id, ...createDto } = dto;
        await activitiesApi.create(createDto);
        showNotification("success", t("admin_activities_create_success"));
      }

      await loadActivities();
      resetForm();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification("error", t("admin_operation_failed"));
    }
  };

  const handleEdit = (activity: any) => {
    // Backend'den gelen tarihi aynen kullan (YYYY-MM-DD formatında)
    // galleryImages Backend'den gelen GalleryImageDto nesneleri (tip dönüştürme gerekli değil)
    setFormData({
      titleTr: activity.titleTr,
      titleDe: activity.titleDe,
      descriptionTr: activity.descriptionTr,
      descriptionDe: activity.descriptionDe,
      detailedContentTr: activity.detailedContentTr || "",
      detailedContentDe: activity.detailedContentDe || "",
      date: activity.date, // Backend'den gelen ISO formatı kullan
      location: activity.location,
      address: activity.address, // Orijinal address objesini sakla
      category: activity.category,
      // Ön izleme için: URL varsa URL'yi, Base64 varsa Base64'ü yükle
      imageUrl: activity.imageUrl?.startsWith("data:")
        ? null
        : activity.imageUrl || null,
      imageBase64: activity.imageBase64?.startsWith("data:")
        ? activity.imageBase64.replace("data:image/jpeg;base64,", "")
        : activity.imageBase64 || null,
      imageFileName: activity.imageFileName || null,
      videoUrl: activity.videoUrl || "",
      galleryImages: activity.galleryImages || [],
      isActive: activity.isActive,
    });
    setEditingId(activity.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("admin_activities_delete_title"),
      message: t("admin_activities_delete_confirm"),
      onConfirm: () => {
        void (async () => {
          try {
            await activitiesApi.delete(id);
            await loadActivities();
            showNotification("success", t("admin_activities_delete_success"));
          } catch (error) {
            console.error("Silme hatası:", error);
            showNotification("error", t("admin_activities_delete_failed"));
          }
        })();
      },
    });
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const activity = activities.find((a) => a.id === id);
      if (!activity) {
        console.error("Etkinlik bulunamadı:", id);
        showNotification("error", t("admin_activities_not_found"));
        return;
      }

      // Parse date and generate localized date strings
      const dateISO = activity.originalDate
        ? new Date(activity.originalDate)
        : new Date();
      const dateTr = dateISO.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      const dateDe = dateISO.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Backend expects flat address fields, not nested Address object
      const address = activity.address || {};

      const dto = {
        id: id,
        titleTr: activity.titleTr,
        titleDe: activity.titleDe,
        descriptionTr: activity.descriptionTr,
        descriptionDe: activity.descriptionDe,
        detailedContentTr: activity.detailedContentTr || null,
        detailedContentDe: activity.detailedContentDe || null,

        // Required for backend validation (matching buildActivityDto)
        dateTr: dateTr,
        dateDe: dateDe,
        dateISO: dateISO.toISOString(),
        date: dateISO.toISOString(),
        Date: dateISO.toISOString(),

        // Backend expects both flat and objects
        street: address.street || activity.location || "",
        houseNo: address.houseNo || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "Deutschland",
        zipCode: address.zipCode || "",
        address: {
          street: address.street || activity.location || "",
          houseNo: address.houseNo || "",
          city: address.city || "",
          state: address.state || "",
          country: address.country || "Deutschland",
          zipCode: address.zipCode || "",
        },
        Address: {
          Street: address.street || activity.location || "",
          HouseNo: address.houseNo || "",
          City: address.city || "",
          State: address.state || "",
          Country: address.country || "Deutschland",
          ZipCode: address.zipCode || "",
        },

        category: activity.category,
        imageUrl: activity.imageBase64 ? null : activity.imageUrl,
        imageBase64: activity.imageBase64 || null,
        imageFileName: activity.imageFileName || null,
        videoUrl: activity.videoUrl || null,
        galleryImages: (activity.galleryImages || [])
          .filter((img: any) => img.url || img.base64Data)
          .map((img: any) => ({
            url: img.url || null,
            base64Data: img.base64Data || null,
            fileName: img.fileName || null,
          })),
        isActive: !currentStatus,
      };

      await activitiesApi.update(id, dto);
      await loadActivities();
      const nextIsActive = dto.isActive;
      const successMessage = nextIsActive
        ? t("admin_activities_activated_success")
        : t("admin_activities_deactivated_success");
      showNotification("success", successMessage);
    } catch (error) {
      console.error("Durum değiştirme hatası detayı:", error);
      showNotification("error", t("admin_activities_toggle_failed"));
    }
  };

  const resetForm = () => {
    setFormData({
      titleTr: "",
      titleDe: "",
      descriptionTr: "",
      descriptionDe: "",
      detailedContentTr: "",
      detailedContentDe: "",
      date: "",
      location: "",
      address: undefined,
      category: "music",
      imageUrl: null,
      imageBase64: null,
      imageFileName: null,
      videoUrl: "",
      galleryImages: [],
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredActivities = activities.filter(
    (a) =>
      a.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.titleDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatAdminActivity = (item: any) => {
    const formatAddress = (address: any) => {
      if (!address) return "";
      const parts = [];
      // Backend PascalCase kullanıyor, camelCase'e çevir
      const street = address.Street || address.street;
      const houseNo = address.HouseNo || address.houseNo;
      const zipCode = address.ZipCode || address.zipCode;
      const city = address.City || address.city;
      const state = address.State || address.state;
      const country = address.Country || address.country;

      if (street) parts.push(street);
      if (houseNo) parts.push(houseNo);
      if (zipCode) parts.push(zipCode);
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (country) parts.push(country);
      return parts.join(", ");
    };

    // Backend'den gelen PascalCase address'i camelCase'e dönüştür
    const convertAddress = (address: any) => {
      if (!address) return undefined;
      return {
        street: address.Street || address.street || "",
        houseNo: address.HouseNo || address.houseNo || "",
        zipCode: address.ZipCode || address.zipCode || "",
        city: address.City || address.city || "",
        state: address.State || address.state || "",
        country: address.Country || address.country || "",
      };
    };

    return {
      id: item.id,

      titleTr: item.titleTr || "",
      titleDe: item.titleDe || "",

      descriptionTr: item.descriptionTr || "",
      descriptionDe: item.descriptionDe || "",

      detailedContentTr: item.detailedContentTr || item.descriptionTr || "",
      detailedContentDe: item.detailedContentDe || item.descriptionDe || "",

      // input[type="date"] uyumlu ISO (YYYY-MM-DD)
      date: item.date ? item.date.split("T")[0] : "",
      originalDate: item.date, // Backend için orijinal ISO formatı

      location: formatAddress(item.address) || item.location || "",
      address: convertAddress(item.address), // PascalCase -> camelCase

      category: item.category || "music",
      imageUrl: item.imageSource || item.imageUrl || null,
      imageBase64: item.imageBase64 || item.ImageBase64 || null,
      imageFileName: item.imageFileName || item.ImageFileName || null,
      videoUrl: item.videoUrl || "",
      galleryImages: item.galleryImages || [],
      isActive: item.isActive ?? true,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-teal"></div>
        <p className="mt-4 text-slate-500 font-medium">
          {t("admin_activities_loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="space-y-6">
        {/* Üst Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Calendar className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("admin_activities_title")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {t("admin_activities_total")}: {activities.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Plus size={18} />
            {t("admin_activities_new")}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-kpf-teal"
            size={22}
          />
          <input
            type="text"
            placeholder={t("admin_activities_search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-kpf-teal/30 focus:border-kpf-teal text-base shadow-sm"
          />
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Search size={40} className="text-slate-400" />
              </div>
              <p className="text-slate-600 text-xl font-semibold mb-2">
                {t("admin_activities_no_results_title")}
              </p>
              <p className="text-slate-500 text-sm">
                {t("admin_activities_no_results_subtitle")}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/80 transition-all font-semibold"
                >
                  {t("admin_clear_search")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Desktop View - Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-white bg-gradient-to-r from-kpf-teal to-kpf-teal uppercase tracking-wide">
            <div className="col-span-4">
              {t("admin_activities_header_activity")}
            </div>
            <div className="col-span-2">
              {t("admin_activities_header_category")}
            </div>
            <div className="col-span-2">
              {t("admin_activities_header_date")}
            </div>
            <div className="col-span-2">
              {t("admin_activities_header_location")}
            </div>
            <div className="col-span-1 text-center">
              {t("admin_activities_header_status")}
            </div>
            <div className="col-span-1 text-right">
              {t("admin_activities_header_actions")}
            </div>
          </div>

          {/* Desktop View - Rows */}
          <div className="hidden md:block divide-y divide-slate-100">
            {filteredActivities.map((activity) => {
              const categoryIcons: Record<string, string> = {
                music: "🎵",
                art: "🎨",
                education: "📚",
                culture: "🌍",
                sport: "⚽",
                social: "🤝",
              };
              const categoryIcon = categoryIcons[activity.category] || "📌";

              return (
                <div
                  key={activity.id}
                  className="grid grid-cols-12 gap-4 px-4 md:px-6 py-5 items-center hover:bg-gradient-to-r hover:from-kpf-teal/5 hover:to-kpf-teal/5 transition-all duration-200 border-l-4 border-transparent hover:border-kpf-teal"
                >
                  {/* Title + Image */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={activity.imageUrl}
                        alt={activity.titleTr}
                        className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-white"
                      />
                      {!activity.isActive && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <EyeOff size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 line-clamp-1 text-base">
                        {language === "tr"
                          ? activity.titleTr
                          : activity.titleDe}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {language === "tr"
                          ? activity.descriptionTr
                          : activity.descriptionDe}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-kpf-teal/10 to-blue-500/10 text-kpf-teal text-xs font-bold rounded-full border border-kpf-teal/20">
                      <span>{categoryIcon}</span>
                      <span className="capitalize">{activity.category}</span>
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-slate-700 font-semibold flex items-center gap-2">
                    <Calendar size={16} className="text-kpf-teal" />
                    <span>{activity.date}</span>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={16} className="text-kpf-teal flex-shrink-0" />
                    <span className="line-clamp-1" title={activity.location}>
                      {activity.location}
                    </span>
                  </div>

                  {/* Status - Tıklanabilir Toggle */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() =>
                        toggleActive(activity.id, activity.isActive)
                      }
                      className="group relative"
                      title={
                        activity.isActive
                          ? t("admin_activities_deactivate")
                          : t("admin_activities_activate")
                      }
                    >
                      {activity.isActive ? (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-green-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                          <Eye size={14} />
                          {t("admin_active")}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 text-xs font-bold rounded-full flex items-center gap-1.5 border border-slate-200 cursor-pointer group-hover:shadow-lg group-hover:scale-105 transition-all">
                          <EyeOff size={14} />
                          {t("admin_inactive")}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all hover:shadow-md"
                      title={t("admin_edit")}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all hover:shadow-md"
                      title={t("admin_delete")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredActivities.map((activity) => {
              const categoryIcons: Record<string, string> = {
                music: "🎵",
                art: "🎨",
                education: "📚",
                culture: "🌍",
                sport: "⚽",
                social: "🤝",
              };
              const categoryIcon = categoryIcons[activity.category] || "📌";

              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-slate-50 transition-all"
                >
                  {/* Image */}
                  <div className="relative mb-3">
                    <img
                      src={activity.imageUrl}
                      alt={activity.titleTr}
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                    {!activity.isActive && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <EyeOff size={24} className="text-white" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          toggleActive(activity.id, activity.isActive)
                        }
                        className="shadow-lg"
                        title={
                          activity.isActive
                            ? t("admin_activities_deactivate")
                            : t("admin_activities_activate")
                        }
                      >
                        {activity.isActive ? (
                          <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                            <Eye size={14} />
                            {t("admin_active")}
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                            <EyeOff size={14} />
                            {t("admin_inactive")}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2.5">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                      {language === "tr" ? activity.titleTr : activity.titleDe}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {language === "tr"
                        ? activity.descriptionTr
                        : activity.descriptionDe}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-kpf-teal/10 text-kpf-teal font-bold rounded-full">
                        {categoryIcon} {activity.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full">
                        <Calendar size={14} className="text-kpf-teal" />
                        {activity.date}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin
                        size={14}
                        className="text-kpf-teal flex-shrink-0 mt-0.5"
                      />
                      <span className="line-clamp-2">{activity.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all font-semibold text-sm"
                    >
                      <Edit size={18} />
                      {t("admin_edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="py-3 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all"
                      title={t("admin_delete")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] w-full max-w-[98vw] md:max-w-4xl lg:max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto my-4 md:my-8 shadow-2xl border border-slate-100">
              {/* Üst Bar - AdminVolunteerPage tarzı */}
              <form onSubmit={handleSubmit} className="contents">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-t-2xl md:rounded-t-[2.5rem] border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-kpf-teal/10 rounded-2xl">
                      <Calendar className="text-kpf-teal" size={28} />
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-slate-800">
                        {editingId
                          ? t("admin_activities_edit")
                          : t("admin_activities_create")}
                      </h1>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle size={10} className="text-green-500" />
                        {t("admin_fill_all_fields")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={
                        uploadingImage ||
                        !formData.titleTr ||
                        !formData.titleDe ||
                        !formData.descriptionTr ||
                        !formData.descriptionDe
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-kpf-teal to-blue-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-base min-h-[44px]"
                    >
                      <Save size={20} />
                      <span>{t("admin_publish")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-colors min-h-[44px] min-w-[44px]"
                    >
                      <X size={24} className="text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8 lg:space-y-10">
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Türkçe */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-blue-50 pb-2 italic">
                          <Languages size={20} />
                          <span className="font-bold text-xs uppercase tracking-widest">
                            {t("admin_content_tr")}
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.titleTr}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              titleTr: e.target.value,
                            })
                          }
                          placeholder={t(
                            "admin_activities_form_title_tr_placeholder",
                          )}
                          className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                        />
                        <div className="pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                            {t("admin_activities_short_description_label")}
                          </span>
                          <textarea
                            required
                            rows={3}
                            value={formData.descriptionTr}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                descriptionTr: e.target.value,
                              })
                            }
                            placeholder={t(
                              "admin_activities_short_description_tr_placeholder",
                            )}
                            className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                          />
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                            {t("admin_activities_detailed_content_label")}
                          </span>
                          <QuillEditor
                            value={formData.detailedContentTr}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                detailedContentTr: val,
                              })
                            }
                            placeholder={t(
                              "admin_activities_detailed_content_tr_placeholder",
                            )}
                          />
                        </div>
                      </div>

                      {/* Almanca */}
                      <div className="space-y-6 lg:border-l lg:border-slate-50 lg:pl-12">
                        <div className="flex items-center gap-2 text-amber-600 mb-4 border-b border-amber-50 pb-2 italic">
                          <Languages size={20} />
                          <span className="font-bold text-xs uppercase tracking-widest">
                            {t("admin_content_de")}
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.titleDe}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              titleDe: e.target.value,
                            })
                          }
                          placeholder={t(
                            "admin_activities_form_title_de_placeholder",
                          )}
                          className="w-full text-3xl font-black border-none focus:ring-0 p-0 placeholder:text-slate-200 bg-transparent"
                        />
                        <div className="pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                            {t("admin_activities_short_description_label")}
                          </span>
                          <textarea
                            required
                            rows={3}
                            value={formData.descriptionDe}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                descriptionDe: e.target.value,
                              })
                            }
                            placeholder={t(
                              "admin_activities_short_description_de_placeholder",
                            )}
                            className="w-full text-base text-slate-600 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder:text-slate-300"
                          />
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                            {t("admin_activities_detailed_content_label")}
                          </span>
                          <QuillEditor
                            value={formData.detailedContentDe}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                detailedContentDe: val,
                              })
                            }
                            placeholder={t(
                              "admin_activities_detailed_content_de_placeholder",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarih ve Kategori */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest flex items-center gap-2">
                        <Calendar size={14} className="text-kpf-teal" />
                        {t("admin_activities_date_label")} *
                      </span>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                      />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 block tracking-widest">
                        {t("admin_activities_category_label")} *
                      </span>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full text-xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-kpf-teal outline-none pb-2 transition-all"
                      >
                        <option value="music">
                          {t("admin_activities_category_music")}
                        </option>
                        <option value="art">
                          {t("admin_activities_category_art")}
                        </option>
                        <option value="education">
                          {t("admin_activities_category_education")}
                        </option>
                        <option value="culture">
                          {t("admin_activities_category_culture")}
                        </option>
                        <option value="sport">
                          {t("admin_activities_category_sport")}
                        </option>
                        <option value="social">
                          {t("admin_activities_category_social")}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Adres Bilgileri */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-kpf-teal" />
                      {t("admin_activities_address_section_title")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sokak */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_street")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address?.street || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                street: e.target.value,
                              },
                              location: `${e.target.value}${
                                formData.address?.houseNo
                                  ? " " + formData.address.houseNo
                                  : ""
                              }, ${formData.address?.zipCode || ""} ${
                                formData.address?.city || ""
                              }`.trim(),
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_street_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>

                      {/* Ev Numarası */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_houseNo")}
                        </label>
                        <input
                          type="text"
                          value={formData.address?.houseNo || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                houseNo: e.target.value,
                              },
                              location: `${formData.address?.street || ""} ${
                                e.target.value
                              }, ${formData.address?.zipCode || ""} ${
                                formData.address?.city || ""
                              }`.trim(),
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_house_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>

                      {/* Posta Kodu */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_postalCode")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address?.zipCode || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                zipCode: e.target.value,
                              },
                              location: `${formData.address?.street || ""} ${
                                formData.address?.houseNo || ""
                              }, ${e.target.value} ${
                                formData.address?.city || ""
                              }`.trim(),
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_zip_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>

                      {/* Şehir */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_city")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address?.city || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                              location: `${formData.address?.street || ""} ${
                                formData.address?.houseNo || ""
                              }, ${formData.address?.zipCode || ""} ${
                                e.target.value
                              }`.trim(),
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_city_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>

                      {/* Eyalet */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_state")}
                        </label>
                        <input
                          type="text"
                          value={formData.address?.state || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_state_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>

                      {/* Ülke */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {t("admin_address_country")} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address?.country || "Deutschland"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: e.target.value,
                              },
                            })
                          }
                          placeholder={t(
                            "admin_activities_address_country_placeholder",
                          )}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 bg-white/50 p-3 rounded-lg">
                      💡 {t("admin_activities_address_help")}
                    </p>
                  </div>

                  {/* Ana Resim */}
                  <div className="bg-gradient-to-br from-kpf-teal/5 to-kpf-teal/5 p-6 rounded-xl border-2 border-dashed border-slate-300">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      📷 {t("admin_activities_main_image")} *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal bg-white text-base file:mr-3 file:py-3 file:px-5 md:file:py-2 md:file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-kpf-teal file:text-white hover:file:bg-kpf-teal/80 file:cursor-pointer"
                    />
                    {(formData.imageUrl || formData.imageBase64) && (
                      <div className="mt-4 space-y-3">
                        <div className="relative">
                          <img
                            src={
                              formData.imageBase64
                                ? `data:image/jpeg;base64,${formData.imageBase64}`
                                : formData.imageUrl || undefined
                            }
                            alt="Preview"
                            className="w-full h-40 md:h-48 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            ✓ {t("admin_uploaded")}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                imageUrl: null,
                                imageBase64: null,
                                imageFileName: null,
                              })
                            }
                            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-3 md:py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors min-h-[36px] min-w-[36px] justify-center"
                          >
                            <X size={16} />
                            <span className="hidden sm:inline">
                              {t("admin_delete")}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="mt-3 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-kpf-teal"></div>
                        <p className="text-sm text-slate-600 mt-2">
                          {t("admin_loading")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🎬 {t("admin_activities_video_label")}
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      placeholder={t("admin_activities_video_placeholder")}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {t("admin_activities_video_help")}
                    </p>
                  </div>

                  {/* Galeri */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      🖼️ {t("admin_activities_gallery_label")}
                    </label>

                    {/* Gallery URL Input */}
                    <div className="mb-4 flex gap-2">
                      <input
                        type="url"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder={t(
                          "admin_activities_gallery_url_placeholder",
                        )}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            galleryUrlInput.trim() &&
                            galleryUrlInput.startsWith("http")
                          ) {
                            setFormData({
                              ...formData,
                              galleryImages: [
                                ...formData.galleryImages,
                                {
                                  url: galleryUrlInput.trim(),
                                  base64Data: null,
                                  fileName: null,
                                },
                              ],
                            });
                            setGalleryUrlInput("");
                            showNotification(
                              "success",
                              t("admin_activities_gallery_add_success"),
                            );
                          } else {
                            showNotification(
                              "error",
                              t("admin_activities_gallery_add_invalid_url"),
                            );
                          }
                        }}
                        className="px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-teal-700 transition font-medium"
                      >
                        {t("admin_add")}
                      </button>
                    </div>

                    {/* File Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal bg-white text-base file:mr-3 file:py-3 file:px-5 md:file:py-2 md:file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-kpf-teal file:text-white hover:file:bg-teal-700 file:cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      {t("admin_activities_gallery_help")}
                    </p>
                    {formData.galleryImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {formData.galleryImages.map((img, index) => {
                          const displayUrl = img.url || img.base64Data;
                          const imageId =
                            img.url || img.fileName || `img-${index}`;
                          // Base64 Bilder müssen das data: URI-Schema verwenden
                          const imageSrc = img.url
                            ? img.url
                            : `data:image/jpeg;base64,${img.base64Data}`;
                          return (
                            <div
                              key={`gallery-${index}-${imageId.substring(
                                Math.max(0, imageId.length - 10),
                              )}`}
                              className="relative group"
                            >
                              {displayUrl && (
                                <>
                                  <img
                                    src={imageSrc}
                                    alt={`${t("admin_activities_gallery_image_alt")} ${index + 1}`}
                                    className="h-28 sm:h-24 w-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        galleryImages:
                                          formData.galleryImages.filter(
                                            (_, i) => i !== index,
                                          ),
                                      })
                                    }
                                    className="absolute -top-2 -right-2 p-2 sm:p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 min-w-[32px] min-h-[32px] flex items-center justify-center"
                                    title={t("admin_delete")}
                                  >
                                    <X size={16} />
                                  </button>
                                  <div className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                                    {img.base64Data ? "📤" : "🔗"} #{index + 1}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Aktif/Pasif */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="isActive"
                          className="text-base font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
                        >
                          {formData.isActive ? (
                            <Eye size={20} className="text-green-600" />
                          ) : (
                            <EyeOff size={20} className="text-slate-400" />
                          )}
                          {t("admin_publish_status_label")}
                        </label>
                        <p className="text-sm text-slate-600 mt-1">
                          {t("admin_publish_status_help")}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-16 h-8 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-kpf-teal/30 rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-500 cursor-pointer"></div>
                        <span className="absolute top-1.5 left-2 text-xs font-bold text-white pointer-events-none">
                          {formData.isActive
                            ? t("admin_toggle_on")
                            : t("admin_toggle_off")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modern Bildirim Penceresi */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
            <div
              className={`
              min-w-[300px] max-w-md rounded-xl shadow-2xl p-4 flex items-start gap-3 border-2
              ${notificationThemeByType[notification.type]}
            `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {renderNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setNotification({ show: false, type: "success", message: "" })
                }
                className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={language === "tr" ? "Sil" : "Löschen"}
          cancelText={language === "tr" ? "İptal" : "Abbrechen"}
          type="danger"
        />

        {/* Editor Özelleştirme CSS */}
        <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
      `}</style>
      </div>
    </div>
  );
};

export default AdminActivities;
