// src/trelloContext.js

import { trello as t } from '../lib/trello.js';

const withTimeout = (p, ms = 800) =>
  Promise.race([
    p,
    new Promise((resolve) => setTimeout(() => resolve(undefined), ms))
  ]);

export async function getTrelloArgsSafe({ preferArgs = true, timeoutMs = 800 } = {}) {
  if (!t) {
    return { insideTrello: false, member: null, cardId: null };
  }

  const arg = (n) => {
    try {
      return t.arg(n);
    } catch {
      return undefined;
    }
  };

  let member = null, cardId = null;

  if (preferArgs) {
    member = arg('member') ?? null;
    cardId = arg('cardId') ?? null;
  }

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
