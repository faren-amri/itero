// src/services/trelloContext.js
import { trello as t } from '../lib/trello.js';

const withTimeout = (p, ms = 800) =>
  Promise.race([p, new Promise((r) => setTimeout(() => r(undefined), ms))]);

export async function getTrelloArgsSafe({ preferArgs = true, timeoutMs = 800 } = {}) {
  // Fallbacks from URL (e.g., #/dashboard?member=...&card=...)
  const params = new URLSearchParams(window.location.search);
  const fallbackMember = params.get('member');
  const fallbackCard = params.get('card');

  if (!t) {
    return { insideTrello: false, member: fallbackMember, cardId: fallbackCard };
  }

  const arg = (n) => { try { return t.arg(n); } catch { return undefined; } };

  let member = preferArgs ? arg('member') : null;
  let cardId = preferArgs ? arg('cardId') : null;

  if (!member) {
    member = await withTimeout(
      t.member('id').then((m) => m?.id).catch(() => undefined),
      timeoutMs
    );
  }
  if (!cardId) {
    cardId = await withTimeout(
      t.card('id').then((c) => c?.id).catch(() => undefined),
      timeoutMs
    );
  }

  return {
    insideTrello: true,
    member: member || fallbackMember,
    cardId: cardId || fallbackCard,
  };
}

export default getTrelloArgsSafe;
