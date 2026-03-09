// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>,
    ) => void;
    dataLayer?: any[];
  }
}

// Event tracking function
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>,
) => {
  const w = globalThis as typeof globalThis & Window;
  w.gtag?.("event", eventName, eventParams);
};

// Page view tracking
export const trackPageView = (pagePath: string, pageTitle: string) => {
  const w = globalThis as typeof globalThis & Window;
  w.gtag?.("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Custom event trackers
export const analytics = {
  // Button clicks
  trackDonateClick: () => {
    trackEvent("donate_button_click", {
      button_location: "homepage",
    });
  },

  trackVolunteerClick: () => {
    trackEvent("volunteer_button_click", {
      button_location: "homepage",
    });
  },

  trackContactClick: () => {
    trackEvent("contact_button_click", {
      button_location: "homepage",
    });
  },

  // Outbound links
  trackInstagramClick: () => {
    trackEvent("outbound_link_click", {
      link_destination: "instagram",
      link_url: "https://www.instagram.com/kulturplattformfreiburg",
    });
  },

  trackFacebookClick: () => {
    trackEvent("outbound_link_click", {
      link_destination: "facebook",
      link_url: "https://www.facebook.com/kulturplattformfreiburg",
    });
  },

  // Form submissions
  trackContactFormSubmission: (success: boolean) => {
    trackEvent("contact_form_submit", {
      form_type: "contact",
      success: success,
    });
  },

  trackNewsletterSubscription: (success: boolean) => {
    trackEvent("newsletter_subscribe", {
      success: success,
    });
  },

  trackVolunteerFormSubmission: (success: boolean) => {
    trackEvent("volunteer_form_submit", {
      success: success,
    });
  },

  // Activity interactions
  trackActivityView: (activityId: string, activityTitle: string) => {
    trackEvent("activity_view", {
      activity_id: activityId,
      activity_title: activityTitle,
    });
  },

  trackActivityImageView: (activityId: string, imageIndex: number) => {
    trackEvent("activity_image_view", {
      activity_id: activityId,
      image_index: imageIndex,
    });
  },

  // Navigation
  trackNavigation: (from: string, to: string) => {
    trackEvent("navigation", {
      from_page: from,
      to_page: to,
    });
  },

  // Scroll depth
  trackScrollDepth: (depth: number, pageName: string) => {
    trackEvent("scroll_depth", {
      scroll_percentage: depth,
      page_name: pageName,
    });
  },
};
