import { NextResponse } from "next/server";
import { buildCsp, makeNonce } from "@/lib/csp";
import { hasLocale, pickLocale } from "@/lib/i18n";
import { cookieOptions, isOld, readToken, signToken, WEEK } from "@/lib/session-token";

// The pages that need a session
const PROTECTED = ["/account", "/admin", "/studio"];
// The pages with a strict policy
const STRICT = ["/account", "/admin"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Maintenance: answer at once, with a 503
  if (process.env.MAINTENANCE === "on") {
    return new NextResponse("Trailhead is being updated. Back soon.\n", {
      status: 503,
      headers: { "Retry-After": "300", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // The front door: to their language
  if (pathname === "/intl" || pathname.startsWith("/intl/")) {
    const locale = pickLocale({
      cookie: request.cookies.get("NEXT_LOCALE")?.value,
      acceptLanguage: request.headers.get("accept-language"),
    });
    const rest = pathname.slice("/intl".length);
    return NextResponse.redirect(new URL(`/${locale}${rest}`, request.url));
  }

  // An old address, moved for good
  if (pathname.startsWith("/guide/")) {
    const moved = new URL(pathname.replace("/guide/", "/guides/"), request.url);
    return NextResponse.redirect(moved, 308);
  }

  // A short address for the versioned api
  if (pathname.startsWith("/v1/")) {
    return NextResponse.rewrite(new URL(`/api${pathname}`, request.url));
  }

  // A friendly address for the api
  if (pathname === "/trails.json") {
    return NextResponse.rewrite(new URL("/api/trails", request.url));
  }
  const token = request.cookies.get("session")?.value;
  const payload = token ? await readToken(token) : null;

  const needsSession = PROTECTED.some((path) => pathname.startsWith(path));
  if (!payload && needsSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  if (payload && pathname === "/login") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  const strict = STRICT.some((path) => pathname.startsWith(path));
  const csp = strict ? buildCsp(makeNonce()) : null;
  const requestHeaders = new Headers(request.headers);
  // The same id for the page, and for the logs
  const requestId = crypto.randomUUID();
  requestHeaders.set("x-request-id", requestId);
  if (csp) requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId);
  if (csp) response.headers.set("Content-Security-Policy", csp);
  // Remember the language that the visitor chose
  const first = pathname.split("/")[1];
  if (hasLocale(first)) {
    response.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 31536000 });
  }
  if (payload && isOld(payload)) {
    const expires = new Date(Date.now() + WEEK);
    const renewed = await signToken(payload.userId, { expires });
    response.cookies.set("session", renewed, cookieOptions(expires));
  }
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      // Skip the prefetches of next/link
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
