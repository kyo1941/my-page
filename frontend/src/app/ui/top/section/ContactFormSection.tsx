"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useContactFormTop } from "@/app/hooks/top/useContactFormTop";

export default function ContactForm() {
  // サイトキーを事前チェックする
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    if (process.env.NODE_ENV === "production") {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-14 text-gray-900">
            お問い合わせ
          </h2>
          <p className="text-center">
            現在、システムの問題によりお問い合わせフォームをご利用いただけません。
            <br />
            ご不便をおかけし、大変申し訳ございません。
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-14 text-gray-900">
            お問い合わせ
          </h2>
          <div className="p-4 border-2 border-red-500 text-red-500">
            <p className="font-bold text-lg">開発者向けエラー:</p>
            <p>
              NEXT_PUBLIC_TURNSTILE_SITE_KEY が設定されていません。.env.local
              ファイルなどを確認してください。
            </p>
          </div>
        </div>
      );
    }
  }

  // サイトキーが存在することを確認したのち実際に表示するコンテンツの処理
  return <ContactFormContents siteKey={siteKey} />;
}

function ContactFormContents({ siteKey }: { siteKey: string }) {
  const { form, validation, turnstile, submit, handlers } = useContactFormTop();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-14 text-gray-900">お問い合わせ</h2>

      <form onSubmit={handlers.handleSubmit} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            required
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.validationErrors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="your-email@example.com"
          />
          {validation.validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {validation.validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            件名 *
          </label>
          <input
            type="text"
            id="subject"
            required
            value={form.subject}
            onChange={(e) => form.setSubject(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.validationErrors.subject
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="お問い合わせの件名"
          />
          {validation.validationErrors.subject && (
            <p className="mt-1 text-sm text-red-600">
              {validation.validationErrors.subject}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            メッセージ *
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={form.message}
            onChange={(e) => form.setMessage(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.validationErrors.message
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="お問い合わせ内容をご記入ください"
          />
          {validation.validationErrors.message && (
            <p className="mt-1 text-sm text-red-600">
              {validation.validationErrors.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Turnstile
            ref={turnstile.turnstileRef}
            siteKey={siteKey}
            onSuccess={turnstile.handleTurnstileSuccess}
            onError={turnstile.handleTurnstileError}
            onExpire={turnstile.handleTurnstileExpire}
          />
        </div>
        {turnstile.turnstileError && (
          <p className="mt-2 text-sm text-red-600 text-center">
            {turnstile.turnstileError}
          </p>
        )}

        {submit.submitStatus === "success" && submit.showStatus && (
          <div className="flex items-start justify-between p-4 bg-green-100 border border-green-400 text-green-700 rounded-md w-fit mx-auto max-w-full">
            <p>メッセージが正常に送信されました。ありがとうございます！</p>
            <button
              type="button"
              className="ml-4 -mt-3 text-3xl text-green-700 hover:text-green-900"
              onClick={() => submit.setShowStatus(false)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        )}

        {submit.submitStatus === "error" && submit.showStatus && (
          <div className="flex items-start justify-between p-4 bg-red-100 border border-red-400 text-red-700 rounded-md w-fit mx-auto max-w-full">
            <p>送信中にエラーが発生しました。もう一度お試しください。</p>
            <button
              type="button"
              className="ml-4 -mt-3 text-3xl text-red-700 hover:text-red-900"
              onClick={() => submit.setShowStatus(false)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={submit.isSubmitting}
            className={`px-8 py-3 rounded-md font-medium text-white transition-colors ${
              submit.isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {submit.isSubmitting ? "送信中..." : "メッセージを送信"}
          </button>
        </div>
      </form>
    </div>
  );
}
