export interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

export class ContactFormRepository {
  async submitForm(data: ContactFormData) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (process.env.NODE_ENV === "production" && !baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URLは本番環境で定義されている必要があります。",
      );
    }
    const apiUrl = baseUrl || "http://localhost:8080";
    const response = await fetch(`${apiUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to send message");
    }
    const result = await response.json();
    return { success: true, data: result };
  }
}

export const contactFormRepository = new ContactFormRepository();
