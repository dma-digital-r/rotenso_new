import { NextResponse, type NextRequest } from "next/server";

// The Keystatic panel writes straight to this computer's files (local storage mode),
// so it must only be reachable from the machine itself — not from other people on the
// network when the site is shared by IP. Remove once the panel moves to GitHub storage.
const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const LOOPBACK_IP = /^(127\.0\.0\.1|::1|::ffff:127\.0\.0\.1)$/;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const local = LOOPBACK.test(host) && (!forwarded || LOOPBACK_IP.test(forwarded));
  if (!local) return new NextResponse("Not found", { status: 404 });
  return NextResponse.next();
}

export const config = {
  matcher: ["/keystatic/:path*", "/keystatic", "/api/keystatic/:path*"],
};
