import { NextResponse, type NextRequest } from "next/server";

// Strict anti-caching security headers to prevent browser back-button BFCache retention
const NO_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("acadnexa_token")?.value;
  const role = request.cookies.get("acadnexa_role")?.value?.toUpperCase();

  const isAuthPage = pathname === "/login";
  const isAdminPath = pathname.startsWith("/admin");
  const isFacultyPath = pathname.startsWith("/faculty");
  const isStudentPath = pathname.startsWith("/student");
  const isProtectedPath = isAdminPath || isFacultyPath || isStudentPath;

  // 1. If user is already authenticated and visits /login, redirect to their role dashboard
  if (isAuthPage && token && role) {
    let destination = "/";
    if (role === "ADMIN") destination = "/admin/dashboard";
    else if (role === "FACULTY") destination = "/faculty/dashboard";
    else if (role === "STUDENT") destination = "/student/dashboard";

    const response = NextResponse.redirect(new URL(destination, request.url));
    Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // 2. If accessing a protected route without a valid token, redirect to /login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // 3. Enforce Role-Based Access Control (RBAC)
  if (isProtectedPath && role) {
    if (isAdminPath && role !== "ADMIN") {
      const fallback = role === "FACULTY" ? "/faculty/dashboard" : "/student/dashboard";
      const response = NextResponse.redirect(new URL(fallback, request.url));
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    if (isFacultyPath && role !== "FACULTY") {
      const fallback = role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";
      const response = NextResponse.redirect(new URL(fallback, request.url));
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    if (isStudentPath && role !== "STUDENT") {
      const fallback = role === "ADMIN" ? "/admin/dashboard" : "/faculty/dashboard";
      const response = NextResponse.redirect(new URL(fallback, request.url));
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }
  }

  // 4. For authorized requests, proceed while injecting anti-caching headers on protected routes
  const response = NextResponse.next();
  if (isProtectedPath) {
    Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/faculty/:path*",
    "/student/:path*",
    "/login",
  ],
};
