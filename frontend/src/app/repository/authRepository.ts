import { API_BASE_URL, requestOrThrow } from "@/app/network/publicApi";

export type LoginInput = {
  username: string;
  password: string;
};

export class AuthRepository {
  async login(input: LoginInput): Promise<void> {
    await requestOrThrow(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    });
  }
}

export const authRepository = new AuthRepository();
