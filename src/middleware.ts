import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PREFIX = process.env.NEXT_PUBLIC_PREFIX || "";

export async function middleware(req: NextRequest) {
  const redirect = checkAccessibility(req);

  if (redirect) {
    return redirect;
  }

  return NextResponse.next();
}

const PUBLIC_PATHS = [
  "/login",
  "/forbidden",
  "/register",
  "/set-password",
  "/reset-password",
  "/forgot-password",
];

const checkAccessibility = (request: NextRequest) => {
  const token = request.cookies.get(PREFIX + "token")?.value;
  const refreshToken = request.cookies.get(PREFIX + "refreshToken")?.value;

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (!refreshToken && !token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return false;
};

export const config = {
  matcher:
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|images/|fonts/|css/).*)",
};
