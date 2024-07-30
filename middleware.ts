import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Chuyển hướng người dùng đến trang login nếu không có token
  if (!token && request.nextUrl.pathname !== "/login" && request.nextUrl.pathname !== "/forgot-password") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Chuyển hướng người dùng đã đăng nhập khỏi trang login và forgot-password
  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/forgot-password")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Các route cần bảo vệ
export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|login|forgot-password).*)',
  ],
};
