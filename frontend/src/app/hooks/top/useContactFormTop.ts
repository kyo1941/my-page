import { useState, useRef, useEffect, useCallback } from 'react';
import { TurnstileInstance } from '@marsidev/react-turnstile';
import { validateContactForm, hasValidationErrors, ValidationErrors } from '@/app/utils/formValidation';
import { contactFormRepository } from '@/app/repository/contactFormRepository';

export interface ContactFormInput {
  email: string;
  subject: string;
  message: string;
}

export function useContactFormTop(siteKey: string) {
  // 入力値
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // バリデーション
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  // Turnstile
  const [turnstileError, setTurnstileError] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileInstance>(null);
  // 送信状態
  const [showStatus, setShowStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 送信イベント
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowStatus(false);
    setValidationErrors({});
    setTurnstileError('');
    const errors = validateContactForm({ email, subject, message });
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }
    if (!turnstileToken) {
      setTurnstileError('認証を完了してください');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const result = await contactFormRepository.submitForm({ email, subject, message, turnstileToken });
      setSubmitStatus('success');
      if (result.success) {
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTurnstileToken('');
      turnstileRef.current?.reset();
    }
  };

  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      setShowStatus(true);
    }
  }, [submitStatus]);

  // Turnstileハンドラ
  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError('');
  }, []);
  const handleTurnstileError = useCallback(() => {
    setTurnstileError('認証に失敗しました。もう一度お試しください。');
  }, []);
  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
    setTurnstileError('認証の有効期限が切れました。再度認証してください。');
  }, []);

  return {
    form: {
      email, setEmail,
      subject, setSubject,
      message, setMessage,
    },
    validation: {
      validationErrors,
    },
    turnstile: {
      turnstileError,
      turnstileToken,
      turnstileRef,
      handleTurnstileSuccess,
      handleTurnstileError,
      handleTurnstileExpire,
    },
    submit: {
      isSubmitting,
      submitStatus,
      showStatus,
      setShowStatus,
    },
    handlers: {
      handleSubmit,
    },
  };
}
