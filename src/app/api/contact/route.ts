import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, hasValidationErrors } from '../../utils/formValidation';

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message, turnstileToken } = await request.json();

    // サーバー側でもバリデーションを行う
    const validationErrors = validateContactForm({ email, subject, message });
    if (hasValidationErrors(validationErrors)) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationErrors },
        { status: 400 }
      );
    }

    if(!turnstileToken) {
      return NextResponse.json(
        { error: 'Turnstile token is missing' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
      }),
    });

    // リクエストデータの不備チェック
    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { error: 'Turnstile verification failed' },
        { status: 400 }
      );
    }

    // 受信メールアドレスの確認
    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!recipientEmail) {
      console.error('CONTACT_EMAIL environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 現在は開発用にコンソール出力（実際のメール送信は未実装）
    console.log('Email to send:', {
      to: recipientEmail,
      from: email,
      subject,
      message,
    });

    // TODO: 実際のメール送信サービスの実装
    // 例：SendGrid, Nodemailer, Resend などを使用
    // await sendEmail({
    //   to: recipientEmail,
    //   from: email,
    //   subject: `[お問い合わせ] ${subject}`,
    //   html: `
    //     <h3>新しいお問い合わせ</h3>
    //     <p><strong>送信者:</strong> ${email}</p>
    //     <p><strong>件名:</strong> ${subject}</p>
    //     <p><strong>メッセージ:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return NextResponse.json(
      { message: 'メール送信が完了しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
