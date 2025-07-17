import { Context, MiddlewareHandler } from "hono";
import { memoryRateLimit } from "../helpers/memoryRateLimit";

function getIP(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") || // Cloudflare IP
    c.req.header("x-forwarded-for") || // Fallback
    "unknown"
  );
}

export const rateLimit: MiddlewareHandler = async (c, next) => {
  const ip = getIP(c);
  const ok = memoryRateLimit(ip, 10, 10);

  if (!ok) return c.text("Too Many Requests", 429);

  await next();
};
