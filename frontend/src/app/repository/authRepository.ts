import { ApiError } from "@/app/types/errors";

function getApiUrl(path: string) {
  return path;
}

export type LoginInput = {
  username: string;
  password: string;
};

export class AuthRepository {
  async login(input: LoginInput): Promise<void> {
    const res = await fetch(getApiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(text || "Invalid credentials", res.status);
    }
  }
}

export const authRepository = new AuthRepository();
