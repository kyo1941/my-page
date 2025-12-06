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
    errors.email = "メールアドレスは必須です";
  } else {
    const parts = data.email.split("@");
    if (parts.length !== 2) {
      errors.email = "「@」を1つだけ含めてください。";
    } else {
      const [localPart, domainPart] = parts;
      if (localPart.length === 0 || domainPart.length === 0) {
        errors.email = "「@」の前後には文字が必要です。";
      } else if (domainPart.indexOf(".") === -1) {
        errors.email = "ドメイン（「@」以降）には「.」が必要です。";
      } else if (domainPart.startsWith(".") || domainPart.endsWith(".")) {
        errors.email = "ドメインの最初や最後に「.」は使用できません。";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        // 上記のチェックをすべて通過してもなお無効な場合（最終チェック）
        errors.email = "有効なメールアドレスの形式で入力してください。";
      }
    }
  }

  // 件名の検証
  if (!data.subject) {
    errors.subject = "件名は必須です";
  } else if (data.subject.length < 3) {
    errors.subject = "件名は3文字以上で入力してください";
  }

  // メッセージの検証
  if (!data.message) {
    errors.message = "メッセージは必須です";
  } else if (data.message.length < 10) {
    errors.message = "メッセージは10文字以上で入力してください";
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
