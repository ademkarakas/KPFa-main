import { ArrowRight, Calendar, MapPin, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { MOCK_ACTIVITIES, TEXTS } from "../constants";
import { activitiesApi } from "../services/api";
import { Activity, Language, ParticipantForm } from "../types";
import ActivityDetail from "./ActivityDetail";

interface ActivitiesProps {
  lang: Language;
}

const Activities: React.FC<ActivitiesProps> = ({ lang }) => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [showDetailPage, setShowDetailPage] = useState<boolean>(false);
  const [showParticipationForm, setShowParticipationForm] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<ParticipantForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: string) => TEXTS[key][lang];

  // Backend'den etkinlikleri yükle
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesApi.getAll(false); // Sadece aktif olanlar

      // Backend'den gelen verileri frontend formatına çevir
      const formattedActivities: Activity[] = data.map((item: any) => ({
        id: item.id,
        title: { tr: item.titleTr, de: item.titleDe },
        description: { tr: item.descriptionTr, de: item.descriptionDe },
        detailedContent: {
          tr: item.detailedContentTr || item.descriptionTr,
          de: item.detailedContentDe || item.descriptionDe,
        },
        date: { tr: item.dateTr, de: item.dateDe },
        dateISO: item.dateISO,
        location: item.location,
        imageUrl: item.imageUrl,
        category: item.category,
        videoUrl: item.videoUrl,
        galleryImages: item.galleryImages || [],
      }));

      setActivities(formattedActivities);
    } catch (error) {
      console.error("Etkinlikler yüklenemedi, mock data kullanılıyor:", error);
      // Hata durumunda mock data kullan
      setActivities(MOCK_ACTIVITIES);
    } finally {
      setLoading(false);
    }
  };

  // Check if activity date has passed
  const isActivityPassed = (dateISO: string): boolean => {
    const activityDate = new Date(dateISO);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return activityDate < today;
  };

  // Filter activities by search query and category
  const filteredActivities = useMemo(() => {
    let result = activities; // Backend'den gelen verileri kullan

    // Apply category filter
    if (filter !== "all") {
      result = result.filter((a) => a.category === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title[lang].toLowerCase().includes(query) ||
          a.description[lang].toLowerCase().includes(query) ||
          a.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [filter, searchQuery, lang, activities]);

  const categories = [
    { id: "all", label: t("activities_filter_all") },
    { id: "music", label: t("activities_filter_music") },
    { id: "art", label: t("activities_filter_art") },
    { id: "education", label: t("activities_filter_education") },
  ];

  // Open Google Calendar with event details
  const addToGoogleCalendar = (activity: Activity) => {
    const eventTitle = activity.title[lang];
    const eventDescription = activity.description[lang];
    const eventLocation = activity.location;
    const eventDate = activity.dateISO;

    // Parse date for Google Calendar (YYYYMMDD format)
    const [year, month, day] = eventDate.split("-");
    const startTime = `${year}${month}${day}T100000Z`;
    const endTime = `${year}${month}${day}T120000Z`;

    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      eventDescription
    )}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Send participation email
  const handleSubmitParticipation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !formData.name || !formData.email) return;

    setFormSubmitting(true);
    try {
      // Simulate email sending (in production, this would call a backend API)
      const emailData = {
        to: formData.email,
        subject: `${
          lang === "tr" ? "Katılım Onayı" : "Teilnahmebestätigung"
        }: ${selectedActivity.title[lang]}`,
        activity: {
          title: selectedActivity.title[lang],
          date: selectedActivity.date[lang],
          location: selectedActivity.location,
          description: selectedActivity.description[lang],
        },
        participant: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        message: formData.message,
      };

      console.log("Email Data:", emailData);

      // Uncomment when backend is ready:
      // const response = await fetch('/api/send-participation-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData),
      // });

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setShowParticipationForm(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
        // Add to Google Calendar
        addToGoogleCalendar(selectedActivity);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // If detail page is shown, render it
  if (showDetailPage && selectedActivity) {
    return (
      <ActivityDetail
        activity={selectedActivity}
        lang={lang}
        onBack={() => {
          setShowDetailPage(false);
          setSelectedActivity(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red mx-auto mb-4"></div>
          <p className="text-slate-600">
            {lang === "tr"
              ? "Etkinlikler yükleniyor..."
              : "Aktivitäten werden geladen..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-kpf-dark mb-4">
          {t("activities_title")}
        </h1>
        <div className="w-20 h-1 bg-kpf-red rounded-full mb-8"></div>

        {/* Search Bar and Filters Container */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === cat.id
                    ? "bg-kpf-teal text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder={
                lang === "tr" ? "Etkinlik ara..." : "Aktivität suchen..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kpf-teal shadow-sm"
            />
          </div>
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {lang === "tr"
                ? "Arama sonucunda etkinlik bulunamadı."
                : "Keine Aktivitäten gefunden."}
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => {
            const isPassed = isActivityPassed(activity.dateISO);
            return (
              <div
                key={activity.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full group"
              >
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedActivity(activity);
                    setShowDetailPage(true);
                  }}
                >
                  <img
                    src={activity.imageUrl}
                    alt={activity.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Calendar size={14} /> {activity.date[lang]}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <MapPin size={14} /> {activity.location}
                    </div>
                  </div>
                  {isPassed && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {lang === "tr" ? "GEÇTİ" : "ABGELAUFEN"}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {activity.title[lang]}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                    {activity.description[lang]}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowDetailPage(true);
                      }}
                      className="text-kpf-red font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      {lang === "tr" ? "Detayları Gör" : "Details anzeigen"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Activities;
