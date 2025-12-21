import { useCallback, useState } from "react";
import { authRepository } from "@/app/repository/authRepository";

export function useAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError("");

    try {
      await authRepository.login({ username, password });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, [username, password]);

  return {
    form: {
      username,
      setUsername,
      password,
      setPassword,
    },
    state: {
      error,
      isSubmitting,
    },
    actions: {
      submit,
      setError,
    },
  };
}
