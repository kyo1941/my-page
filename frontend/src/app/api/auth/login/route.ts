import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(text || "Invalid credentials", {
        status: backendRes.status,
      });
    }

    const { token } = await backendRes.json();

    if (typeof token !== "string") {
      console.error("Token is missing or not a string in the backend response");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Login API route error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
