import { useState } from 'react';

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      setSubmitStatus('success');
      return { success: true, data: result };
    } catch (error) {
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
