// Safe Trello args helper — never throws, works outside Trello too.
export async function getTrelloArgsSafe() {
  try {
    const t = window?.TrelloPowerUp?.iframe?.();
    if (!t) return {};
    // Read args you pass from powerup.js → t.modal({ args:{...} })
    const member = t.arg('member');    // e.g., "5caaf74254d0ef1db084970f"
    const cardId = t.arg('cardId');    // optional if you pass it
    return { member, cardId };
  } catch {
    return {};
  }
}
