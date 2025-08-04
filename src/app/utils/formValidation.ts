export interface FormData {
  email: string;
  subject: string;
  message: string;
}

export interface ValidationErrors {
  email?: string;
  subject?: string;
  message?: string;
}

export const validateContactForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // メールアドレスの検証
  if (!data.email) {
    errors.email = 'メールアドレスは必須です';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  // 件名の検証
  if (!data.subject) {
    errors.subject = '件名は必須です';
  } else if (data.subject.length < 3) {
    errors.subject = '件名は3文字以上で入力してください';
  }

  // メッセージの検証
  if (!data.message) {
    errors.message = 'メッセージは必須です';
  } else if (data.message.length < 10) {
    errors.message = 'メッセージは10文字以上で入力してください';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
