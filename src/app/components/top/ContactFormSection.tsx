"use client";

import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useContactForm } from '../../hooks/useContactForm';
import { validateContactForm, hasValidationErrors, ValidationErrors } from '../../utils/formValidation';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [recaptchaError, setRecaptchaError] = useState<string>('');
  const [showStatus, setShowStatus] = useState(true);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const { isSubmitting, submitStatus, submitForm } = useContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateContactForm({ email, subject, message });
    setValidationErrors(errors);

    if (hasValidationErrors(errors)) {
      return;
    }

    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setRecaptchaError('『私はロボットではありません』にチェックを入れてください')
      return;
    }
    setRecaptchaError('')

    const result = await submitForm({
      email,
      subject,
      message,
      recaptchaToken: recaptchaValue,
    });

    if (result.success) {
      setEmail('');
      setSubject('');
      setMessage('');
      setValidationErrors({});
      recaptchaRef.current?.reset();
    }
  };

  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      setShowStatus(true);
    }
  }, [submitStatus]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-14 text-gray-900">お問い合わせ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your-email@example.com"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            件名 *
          </label>
          <input
            type="text"
            id="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="お問い合わせの件名"
          />
          {validationErrors.subject && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            メッセージ *
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="お問い合わせ内容をご記入ください"
          />
          {validationErrors.message && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={() => setRecaptchaError('')}  
          />
        </div>
        {recaptchaError && (
          <p className="mt-2 text-sm text-red-600 text-center">{recaptchaError}</p>
        )}

        {submitStatus === 'success' && showStatus && (
          <div className="flex items-start justify-between p-4 bg-green-100 border border-green-400 text-green-700 rounded-md w-fit mx-auto max-w-full">
            <p>メッセージが正常に送信されました。ありがとうございます！</p>
            <button
              type="button"
              className="ml-4 -mt-3 text-3xl text-green-700 hover:text-green-900"
              onClick={() => setShowStatus(false)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        )}

        {submitStatus === 'error' && showStatus && (
          <div className="flex items-start justify-between p-4 bg-red-100 border border-red-400 text-red-700 rounded-md w-fit mx-auto max-w-full">
            <p>送信中にエラーが発生しました。もう一度お試しください。</p>
            <button
              type="button"
              className="ml-4 -mt-3 text-3xl text-red-700 hover:text-red-900"
              onClick={() => setShowStatus(false)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? '送信中...' : 'メッセージを送信'}
          </button>
        </div>
      </form>
    </div>
  );
}
