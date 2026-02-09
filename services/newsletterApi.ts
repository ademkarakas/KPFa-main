import { apiFetch } from "./api";

const NEWSLETTER_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7189/api";

// ========================
// Type Definitions
// ========================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  isVerified: boolean;
  subscribedAt: string;
  verifiedAt: string | null;
  unsubscribedAt: string | null;
  source: string;
}

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  verifiedSubscribers: number;
  unsubscribedCount: number;
  totalCampaignsSent: number;
  totalEmailsSent: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  contentTr: string;
  contentDe: string;
  headerImageUrl: string | null;
  status: "Draft" | "Scheduled" | "Sending" | "Sent" | "Failed";
  createdAt: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number;
  successfulSends: number;
  failedSends: number;
}

export interface CreateCampaignRequest {
  subject: string;
  contentTr: string;
  contentDe: string;
  headerImageUrl?: string;
  scheduledAt?: string;
}

export interface SendCampaignResponse {
  success: boolean;
  message: string;
  successful: number;
  failed: number;
  total: number;
}

// ========================
// Public API (No Auth Required)
// ========================

class NewsletterPublicApi {
  private readonly baseURL: string;

  constructor(baseURL: string = NEWSLETTER_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Subscribe to newsletter (Double Opt-In)
   */
  async subscribe(
    email: string,
    fullName?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName: fullName || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Verify subscription with token
   */
  async verify(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/newsletter/verify?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Newsletter verification error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unsubscribe failed");
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Newsletter unsubscribe error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unsubscribe failed",
      };
    }
  }
}

// ========================
// Admin API (Auth Required)
// ========================

export const newsletterAdminApi = {
  /**
   * Get all subscribers
   */
  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    return apiFetch<NewsletterSubscriber[]>("/newsletter/subscribers");
  },

  /**
   * Get subscriber statistics
   */
  async getStats(): Promise<NewsletterStats> {
    return apiFetch<NewsletterStats>("/newsletter/subscribers/stats");
  },

  /**
   * Get all campaigns
   */
  async getCampaigns(): Promise<NewsletterCampaign[]> {
    return apiFetch<NewsletterCampaign[]>("/newsletter/campaigns");
  },

  /**
   * Get single campaign by ID
   */
  async getCampaign(id: string): Promise<NewsletterCampaign> {
    return apiFetch<NewsletterCampaign>(`/newsletter/campaigns/${id}`);
  },

  /**
   * Create new campaign
   */
  async createCampaign(data: CreateCampaignRequest): Promise<{ id: string }> {
    return apiFetch<{ id: string }>("/newsletter/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Send campaign to all subscribers
   */
  async sendCampaign(campaignId: string): Promise<SendCampaignResponse> {
    return apiFetch<SendCampaignResponse>(
      `/newsletter/campaigns/${campaignId}/send`,
      {
        method: "POST",
      },
    );
  },

  /**
   * Send test email
   */
  async sendTestEmail(
    campaignId: string,
    testEmail: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(
      `/newsletter/campaigns/${campaignId}/test`,
      {
        method: "POST",
        body: JSON.stringify({ campaignId, testEmail }),
      },
    );
  },
};

// ========================
// Export instances
// ========================

export const newsletterApi = new NewsletterPublicApi();
export default newsletterApi;
