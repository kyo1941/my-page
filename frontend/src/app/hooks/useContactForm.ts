import { useState } from 'react';

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 環境に応じてAPIエンドポイントを決定
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-backend-domain.com'
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      return { success: true, data: result };
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitStatus,
    submitForm,
  };
};
