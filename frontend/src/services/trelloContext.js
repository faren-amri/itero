// src/services/trelloContext.js

// Promise timeout helper
const withTimeout = (promise, ms = 800) =>
  Promise.race([promise, new Promise((r) => setTimeout(() => r(undefined), ms))]);

export async function getTrelloArgsSafe({ preferArgs = true, timeoutMs = 800 } = {}) {
  const hasSDK = !!(window && window.TrelloPowerUp && typeof window.TrelloPowerUp.iframe === 'function');
  if (!hasSDK) return { insideTrello: false, member: null, cardId: null };

  const t = window.TrelloPowerUp.iframe();
  const arg = (name) => {
    try { return t.arg(name); } catch { return undefined; }
  };

  let member = null;
  let cardId = null;

  // 1) Prefer args passed from t.modal({ args: { … } })
  if (preferArgs) {
    member = arg('member') ?? null;
    cardId = arg('cardId') ?? null;
  }

  // 2) Fallback to SDK lookups with timeout (no console noise if it’s slow/unavailable)
  if (!member) {
    const m = await withTimeout(
      t.member('id').then((m) => m?.id).catch(() => undefined),
      timeoutMs
    );
    if (m) member = m;
  }

  if (!cardId) {
    const c = await withTimeout(
      t.card('id').then((c) => c?.id).catch(() => undefined),
      timeoutMs
    );
    if (c) cardId = c;
  }

  return { insideTrello: true, member, cardId };
}

export default getTrelloArgsSafe;
