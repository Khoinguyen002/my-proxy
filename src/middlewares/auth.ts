import type { MiddlewareHandler } from "hono";
import { HMAC_PAYLOAD_HEADER, HMAC_SIGNATURE_HEADER } from "../consts/hmac";
import { verifySession } from "../utils/session";

export const authSession: MiddlewareHandler<{
  Bindings: Env;
}> = async (c, next) => {
  const signature = c.req.header(HMAC_SIGNATURE_HEADER);
  const payload = c.req.header(HMAC_PAYLOAD_HEADER);

  if (!signature || !payload || !c.env.HMAC_SECRET) {
    return c.text("Unauthorized", 401);
  }

  const { valid, reason } = await verifySession({
    c,
    dataB64: payload,
    secret: c.env.HMAC_SECRET,
    sigB64: signature,
  });

  if (!valid) return c.text(reason ?? "Unauthorized", 401);

  await next();
};
