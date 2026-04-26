import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMITED_PATHS = ["/api/burnout", "/api/team"];
const PROTECTED_PATHS = ["/dashboard", "/report", "/scripts", "/onboarding"];

let ratelimit = null;

function getRatelimit() {
  if (ratelimit) return ratelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
  });
  return ratelimit;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Auth guard for protected pages
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  if (isProtected) {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate limiting for API routes
  const isRateLimited = RATE_LIMITED_PATHS.some(p => pathname.startsWith(p));
  if (!isRateLimited) return NextResponse.next();

  const rl = getRatelimit();
  if (!rl) return NextResponse.next();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const { success, limit, remaining, reset } = await rl.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
          "Retry-After": "60",
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/:path*",
    "/scripts/:path*",
    "/onboarding/:path*",
    "/api/burnout/:path*",
    "/api/team/:path*",
  ],
};
