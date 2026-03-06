import { API_BASE_URL } from "./api";

class ContactApi {
  private readonly baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async submitContactMessage(data: {
    anrede?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/ContactMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anrede: data.anrede || null,
          senderName: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.errors ||
            errorData?.message ||
            "Failed to submit contact message",
        );
      }

      const messageId = await response.json();
      return { success: true, id: messageId };
    } catch (error) {
      console.error("Contact submission error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const contactApi = new ContactApi();
