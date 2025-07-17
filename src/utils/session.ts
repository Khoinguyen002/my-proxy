import { Context } from "hono";
import { signHMAC, verifyHMAC } from "./token";
import { checkAndStoreSignature } from "../helpers/signatureCache";

export async function signSession(
  secret: string,
  payload: { sessionUUID: string; exp: number }
) {
  const json = JSON.stringify(payload);
  const data = btoa(json);
  const sig = await signHMAC(secret, data);
  return { data, sig };
}

export async function verifySession({
  dataB64,
  secret,
  sigB64,
  c,
}: {
  secret: string;
  dataB64: string;
  sigB64: string;
  c: Context;
}): Promise<{ valid: boolean; sessionUUID?: string; reason?: string }> {
  try {
    const jsonStr = atob(dataB64);
    const payload = JSON.parse(jsonStr) as {
      exp: number;
      sessionUUID?: string;
    };

    if (!payload.sessionUUID || typeof payload.exp !== "number") {
      return { valid: false, reason: "Malform payload!" };
    }

    const now = Date.now();
    if (now > payload.exp) return { valid: false, reason: "Expired token!" };

    const result = checkAndStoreSignature(sigB64, payload.exp);
    if (!result) return { valid: false, reason: "Relay detected!" };

    const valid = await verifyHMAC(secret, dataB64, sigB64);
    if (!valid) return { valid: false, reason: "Verify failed!" };

    return { valid: true, sessionUUID: payload.sessionUUID };
  } catch (e) {
    console.error(e);
    return { valid: false };
  }
}
