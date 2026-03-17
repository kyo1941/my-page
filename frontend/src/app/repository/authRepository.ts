import { requestOrThrow } from "@/app/network/publicApi";

export type LoginInput = {
  username: string;
  password: string;
};

export class AuthRepository {
  async login(input: LoginInput): Promise<void> {
    await requestOrThrow("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    });
  }
}

export const authRepository = new AuthRepository();
