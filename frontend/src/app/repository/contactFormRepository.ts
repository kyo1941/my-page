import { API_BASE_URL, requestOrThrow } from "@/app/network/publicApi";

export interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

export class ContactFormRepository {
  async submitForm(data: ContactFormData) {
    const res = await requestOrThrow(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: true, data: result };
  }
}

export const contactFormRepository = new ContactFormRepository();
