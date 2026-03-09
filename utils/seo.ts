// SEO utility functions for dynamic meta tags
export interface PageMetaData {
  titleDe: string;
  titleTr: string;
  descriptionDe: string;
  descriptionTr: string;
  keywords?: string;
}

export const PAGE_META_CONFIG: Record<string, PageMetaData> = {
  home: {
    titleDe: "Kultur Plattform Freiburg - Kultureller Austausch & Engagement",
    titleTr: "Kültür Platformu Freiburg - Kültürel Değişim & Katılım",
    descriptionDe:
      "Kultur Plattform Freiburg e.V. - Gemeinnütziger Verein für kulturellen Austausch, interkultureller Dialog und Integration in Freiburg im Breisgau.",
    descriptionTr:
      "Kültür Platformu Freiburg e.V. - Freiburg'da kültürel değişim, kültürlerarası diyalog ve integrasyon için kar amacı gütmeyen dernek.",
    keywords:
      "kultur freiburg, kulturplattform, verein freiburg, integration freiburg, dialog, austausch, gemeinnützig, freiburg im breisgau, interkultureller dialog",
  },
  about: {
    titleDe: "Über uns - Kultur Plattform Freiburg",
    titleTr: "Hakkımızda - Kültür Platformu Freiburg",
    descriptionDe:
      "Erfahren Sie mehr über unsere Mission, Vision und Werte. Kultur Plattform Freiburg e.V. fördert kulturelle Vielfalt und gesellschaftliches Engagement.",
    descriptionTr:
      "Misyonumuz, vizyonumuz ve değerlerimiz hakkında daha fazla bilgi edinin. Kültür Platformu Freiburg e.V. kültürel çeşitliliği ve toplumsal katılımı teşvik eder.",
    keywords:
      "über uns, mission, vision, werte, team, partner, integration, dialog, kulturelle veranstaltungen",
  },
  activities: {
    titleDe: "Aktivitäten & Veranstaltungen - Kultur Plattform Freiburg",
    titleTr: "Etkinlikler & Aktiviteler - Kültür Platformu Freiburg Freiburg",
    descriptionDe:
      "Entdecken Sie unsere kulturellen Veranstaltungen, Workshops und Events in Freiburg. Werden Sie Teil unserer Gemeinschaft!",
    descriptionTr:
      "Freiburg'daki kültürel etkinliklerimizi, atölyelerimizi ve organizasyonlarımızı keşfedin. Topluluğumuzun bir parçası olun!",
    keywords:
      "veranstaltungen freiburg, events freiburg, workshops, kultur, aktivitäten, kulturelle veranstaltungen, dialog, integration",
  },
  courses: {
    titleDe: "Kurse & Bildung - Kultur Plattform Freiburg",
    titleTr: "Kurslar & Eğitim - Kültür Platformu Freiburg Freiburg",
    descriptionDe:
      "Nehmen Sie an unseren Bildungskursen teil: Sprachkurse, kulturelle Workshops und mehr. Jetzt anmelden!",
    descriptionTr:
      "Eğitim kurslarımıza katılın: Dil kursları, kültürel atölyeler ve daha fazlası. Şimdi kayıt olun!",
    keywords:
      "kurse freiburg, bildung, kulturelle veranstaltungen, dialog, integration, workshops, interkultureller austausch",
  },
  volunteer: {
    titleDe: "Freiwillig engagieren - Kultur Plattform Freiburg",
    titleTr: "Gönüllü Ol - Kültür Platformu Freiburg",
    descriptionDe:
      "Werden Sie Freiwilliger bei Kultur Plattform Freiburg! Unterstützen Sie unsere kulturelle Arbeit und machen Sie einen Unterschied.",
    descriptionTr:
      "Kültür Platformu Freiburg'de gönüllü olun! Kültürel çalışmalarımızı destekleyin ve fark yaratın.",
    keywords: "freiwillig, ehrenamt, mitmachen, engagement, helfen",
  },
  contact: {
    titleDe: "Kontakt - Kultur Plattform Freiburg",
    titleTr: "İletişim - Kültür Platformu Freiburg",
    descriptionDe:
      "Kontaktieren Sie uns! Wir freuen uns auf Ihre Nachricht, Fragen oder Anregungen.",
    descriptionTr:
      "Bizimle iletişime geçin! Mesajlarınızı, sorularınızı veya önerilerinizi bekliyoruz.",
    keywords: "kontakt, email, telefon, adresse, ansprechpartner",
  },
  donate: {
    titleDe: "Spenden - Kultur Plattform Freiburg unterstützen",
    titleTr: "Bağış - Kültür Platformu Freiburg'u Destekle",
    descriptionDe:
      "Unterstützen Sie unsere kulturelle Arbeit mit Ihrer Spende. Jeder Beitrag macht einen Unterschied!",
    descriptionTr:
      "Bağışınızla kültürel çalışmalarımızı destekleyin. Her katkı fark yaratır!",
    keywords: "spenden, donation, unterstützen, fördern, beitrag",
  },
  satzung: {
    titleDe: "Satzung - Kultur Plattform Freiburg",
    titleTr: "Tüzük - Kültür Platformu Freiburg",
    descriptionDe:
      "Lesen Sie unsere Vereinssatzung und erfahren Sie mehr über unsere organisatorische Struktur.",
    descriptionTr:
      "Dernek tüzüğümüzü okuyun ve organizasyon yapımız hakkında daha fazla bilgi edinin.",
    keywords: "satzung, vereinsstatut, organisation, struktur",
  },
  guelen: {
    titleDe: "Über die Bewegung - Gülen Bewegung",
    titleTr: "Hareket Hakkında - Gülen Hareketi",
    descriptionDe:
      "Erfahren Sie mehr über die Gülen-Bewegung, ihre Werte und ihren Beitrag zum interkulturellen Dialog.",
    descriptionTr:
      "Gülen Hareketi, değerleri ve kültürlerarası diyaloğa katkısı hakkında daha fazla bilgi edinin.",
    keywords: "gülen bewegung, fethullah gülen, dialog, interkulturell",
  },
  teegespraeche: {
    titleDe: "Teegespräche - Kultur Plattform Freiburg",
    titleTr: "Çay Sohbetleri - Kültür Platformu Freiburg",
    descriptionDe:
      "Nehmen Sie an unseren Teegesprächen teil: Informelle Treffen für interkulturellen Austausch und Dialog.",
    descriptionTr:
      "Çay sohbetlerimize katılın: Kültürlerarası değişim ve diyalog için gayri resmi buluşmalar.",
    keywords: "teegespräche, dialog, austausch, treffen, diskussion",
  },
  privacy: {
    titleDe: "Datenschutzerklärung - Kultur Plattform Freiburg",
    titleTr: "Gizlilik Politikası - Kültür Platformu Freiburg",
    descriptionDe:
      "Unsere Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten.",
    descriptionTr:
      "Gizlilik politikamız, kişisel verilerin işlenmesi hakkında sizi bilgilendirir.",
    keywords: "datenschutz, privacy, dsgvo, daten",
  },
  imprint: {
    titleDe: "Impressum - Kultur Plattform Freiburg",
    titleTr: "Künye - Kültür Platformu Freiburg",
    descriptionDe:
      "Impressum und rechtliche Informationen der Kultur Plattform Freiburg.",
    descriptionTr: "Kültür Platformu Freiburg'un künye ve yasal bilgileri.",
    keywords: "impressum, rechtliches, anbieter, verantwortlich",
  },
};

/**
 * Updates the document meta tags for SEO
 */
export function updatePageMeta(
  page: string,
  lang: "de" | "tr",
  customTitle?: string,
  customDescription?: string,
): void {
  const metaConfig = PAGE_META_CONFIG[page];

  if (!metaConfig) {
    return;
  }

  // Update title
  const title =
    customTitle || (lang === "de" ? metaConfig.titleDe : metaConfig.titleTr);
  document.title = title;

  // Update meta description
  const description =
    customDescription ||
    (lang === "de" ? metaConfig.descriptionDe : metaConfig.descriptionTr);
  updateMetaTag("name", "description", description);

  // Update Open Graph tags
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);

  // Update Twitter Card tags
  updateMetaTag("name", "twitter:title", title);
  updateMetaTag("name", "twitter:description", description);

  // Update keywords if available
  if (metaConfig.keywords) {
    updateMetaTag("name", "keywords", metaConfig.keywords);
  }

  // Update canonical URL
  updateCanonicalUrl(page, lang);
}

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(
  attribute: "name" | "property",
  value: string,
  content: string,
): void {
  let metaTag = document.querySelector(
    `meta[${attribute}="${value}"]`,
  ) as HTMLMetaElement;

  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute(attribute, value);
    document.head.appendChild(metaTag);
  }

  metaTag.content = content;
}

/**
 * Updates the canonical URL based on current page
 */
function updateCanonicalUrl(page: string, lang: "de" | "tr"): void {
  const baseUrl = "https://www.kulturplattformfreiburg.org";
  const langParam = lang === "tr" ? "?lang=tr" : "";
  const hash = page === "home" ? "" : `#${page}`;
  const url = `${baseUrl}${langParam}${hash}`;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = url;
}

/**
 * Generates JSON-LD structured data for events/activities
 */
export function generateEventStructuredData(
  name: string,
  description: string,
  startDate: string,
  location: string,
  imageUrl?: string,
): string {
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    location: {
      "@type": "Place",
      name: location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Freiburg",
        addressCountry: "DE",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Kultur Plattform Freiburg",
      url: "https://www.kulturplattformfreiburg.org",
    },
    ...(imageUrl && { image: imageUrl }),
  };

  return JSON.stringify(event);
}
