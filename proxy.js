import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only apply rate limiting to API routes
const RATE_LIMITED_PATHS = ["/api/burnout", "/api/team"];

let ratelimit = null;

function getRatelimit() {
  if (ratelimit) return ratelimit;
  // Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars
  // Get free tier at https://upstash.com
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // 10 requests per 60 seconds per IP
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
  });
  return ratelimit;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isRateLimited = RATE_LIMITED_PATHS.some(p => pathname.startsWith(p));
  if (!isRateLimited) return NextResponse.next();

  const rl = getRatelimit();
  if (!rl) return NextResponse.next(); // gracefully skip if Redis not configured

  // Use IP address as identifier (X-Forwarded-For in production)
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
  matcher: ["/api/burnout/:path*", "/api/team/:path*"],
};
