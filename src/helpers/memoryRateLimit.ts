const store = new Map<string, { count: number; resetAt: number }>();

export const memoryRateLimit = (
  id: string,
  limit: number,
  windowSec: number
): boolean => {
  const now = Date.now();
  const ttl = windowSec * 1000;
  const item = store.get(id);
  console.log("rate limit", store);

  if (!item || item.resetAt < now) {
    // Reset window
    store.set(id, { count: 1, resetAt: now + ttl });
    return true;
  }

  if (item.count >= limit) {
    return false; // ❌ Quá giới hạn
  }

  item.count++;
  return true;
};
