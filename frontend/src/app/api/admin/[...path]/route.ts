import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function proxyAdmin(
  request: NextRequest,
  path: string[],
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const backendUrl = new URL(`/api/admin/${path.join("/")}`, BACKEND_URL);
    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const forwardHeaders: HeadersInit = {};

    const contentType = request.headers.get("content-type");
    if (contentType) forwardHeaders["Content-Type"] = contentType;

    if (token) forwardHeaders["Cookie"] = `auth_token=${token}`;

    const origin = request.headers.get("origin");
    if (origin) forwardHeaders["Origin"] = origin;

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.text() : undefined;

    const backendRes = await fetch(backendUrl.toString(), {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const resBody = await backendRes.text();
    const resContentType =
      backendRes.headers.get("content-type") ?? "application/json";

    if (backendRes.ok && hasBody) {
      if (path[0] === "blogs") {
        if (path[1]) revalidatePath(`/ui/blog/${path[1]}`);
      } else if (path[0] === "portfolios") {
        if (path[1]) revalidatePath(`/ui/portfolio/${path[1]}`);
      }
    }

    return new NextResponse(resBody || null, {
      status: backendRes.status,
      headers: { "Content-Type": resContentType },
    });
  } catch (error) {
    console.error("Admin proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyAdmin(request, (await params).path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyAdmin(request, (await params).path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyAdmin(request, (await params).path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyAdmin(request, (await params).path);
}
