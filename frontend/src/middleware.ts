import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secretStr = process.env.JWT_SECRET;
if (!secretStr) {
  throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = new TextEncoder().encode(secretStr);

const JWT_ISSUER = process.env.JWT_ISSUER;
if (!JWT_ISSUER) {
  throw new Error("JWT_ISSUER environment variable is not set");
}

const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
if (!JWT_AUDIENCE) {
  throw new Error("JWT_AUDIENCE environment variable is not set");
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    response.cookies.delete("auth_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path+"],
};
