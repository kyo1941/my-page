"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useContactForm } from '../../hooks/useContactForm';
import { validateContactForm, hasValidationErrors, ValidationErrors } from '../../utils/formValidation';

export default function ContactForm() {
  // サイトキーを事前チェックする
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    if (process.env.NODE_ENV === 'production') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-14 text-gray-900">お問い合わせ</h2>
          <p className='text-center'>現在、システムの問題によりお問い合わせフォームをご利用いただけません。<br />ご不便をおかけし、大変申し訳ございません。</p>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-14 text-gray-900">お問い合わせ</h2>
          <div className="p-4 border-2 border-red-500 text-red-500">
            <p className="font-bold text-lg">開発者向けエラー:</p>
            <p>NEXT_PUBLIC_TURNSTILE_SITE_KEY が設定されていません。.env.local ファイルなどを確認してください。</p>
          </div>
        </div>
      );
    }
  }

  // サイトキーが存在することを確認したのち実際に表示するコンテンツの処理
  return <ContactFormContents siteKey={siteKey} />;
}


function ContactFormContents({ siteKey }: { siteKey : string }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [turnstileError, setTurnstileError] = useState<string>('');
  const [showStatus, setShowStatus] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  
  const turnstileRef = useRef<TurnstileInstance>(null);

  const { isSubmitting, submitStatus, submitForm } = useContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 前回の送信結果は初期化する
    setShowStatus(false);
    setValidationErrors({});
    setTurnstileError('');

    const errors = validateContactForm({ email, subject, message });

    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    if (!turnstileToken) {
      setTurnstileError('認証を完了してください')
      return;
    }

    const result = await submitForm({
      email,
      subject,
      message,
      turnstileToken,
    });

    if (result.success) {
      setEmail('');
      setSubject('');
      setMessage('');
    }

    setTurnstileToken('');
    turnstileRef.current?.reset();
  };

  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      setShowStatus(true);
    }
  }, [submitStatus]);

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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-14 text-gray-900">お問い合わせ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={handleTurnstileSuccess}
            onError={handleTurnstileError}
            onExpire={handleTurnstileExpire}
          />
        </div>
        {turnstileError && (
          <p className="mt-2 text-sm text-red-600 text-center">{turnstileError}</p>
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
