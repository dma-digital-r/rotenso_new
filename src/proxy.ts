import { NextResponse, type NextRequest } from "next/server";

// The Keystatic panel writes straight to this computer's files (local storage mode),
// so it must only be reachable from the machine itself — not from other people on the
// network when the site is shared by IP. Remove once the panel moves to GitHub storage.
const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const LOOPBACK_IP = /^(127\.0\.0\.1|::1|::ffff:127\.0\.0\.1)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/keystatic") || pathname.startsWith("/api/keystatic")) {
    const host = request.headers.get("host") ?? "";
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const local = LOOPBACK.test(host) && (!forwarded || LOOPBACK_IP.test(forwarded));
    if (!local) return new NextResponse("Not found", { status: 404 });
    return NextResponse.next();
  }

  // Addresses without a trailing slash. Next's own slash redirect is switched off
  // (skipTrailingSlashRedirect) so the old site's "/…/" URLs are first matched by the 301 map in
  // next.config.ts and reach their new page in one hop; every other "/…/" URL is normalised here.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = new URL(request.url);
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/(?!keystatic)|images/|icons/|files/|favicon).*)"],
};
