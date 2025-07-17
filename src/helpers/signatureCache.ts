const signatureCache = new Map<string, number>(); // signature => expiresAt (ms)

export const checkAndStoreSignature = (
  signature: string,
  exp: number
): boolean => {
  const now = Date.now();

  if (exp <= now) return false; // ❌ Hết hạn

  const used = signatureCache.get(signature);
  if (used && used > now) return false; // ❌ Signature đã dùng

  // ✅ Lưu signature tới thời điểm exp
  signatureCache.set(signature, exp);

  // 🧹 Cleanup đơn giản
  for (const [sig, expiry] of signatureCache) {
    if (expiry < now) signatureCache.delete(sig);
  }

  return true;
};
