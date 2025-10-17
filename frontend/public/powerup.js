/* global TrelloPowerUp */

// --- Ensure SDK is present ---
const tpu = window.TrelloPowerUp;
if (!tpu) {
  console.error('Trello Power-Up SDK did not load. Check popup.html script order.');
  throw new Error('Power-Up SDK missing');
}

// --- Constants ---
const ICON_URL = '/assets/itero-icon-w-24.png';
const API_BASE = 'https://itero-api-dev-zg94.onrender.com';

// --- Core actions ---

async function openDashboardFromButton(t) {
  return t.popup({
    title: 'Itero',
    url: '/dashboard-wrapper.html', // opens the connector that launches the dashboard modal
    height: 80
  });
}

async function completeTask(t) {
  const [card, member] = await Promise.all([t.card('id'), t.member('id')]);
  const cardId = card?.id;
  const memberId = member?.id;

  if (!cardId || !memberId) {
    return t.alert({ message: '❌ Missing card or member context.' });
  }

  // Prevent duplicate completion
  const alreadyDone = await t.get('card', 'shared', 'taskCompleted');
  if (alreadyDone) {
    return t.alert({ message: '✅ Task already completed.' });
  }

  try {
    const res = await fetch(`${API_BASE}/api/tasks/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trello_user_id: memberId, task_id: cardId })
    });

    if (!res.ok) {
      return t.alert({ message: '❌ Task completion failed.' });
    }

    const data = await res.json();

    // Persist state in Trello
    await t.set('card', 'shared', 'taskCompleted', true);
    await t.set('member', 'shared', 'refresh', true);

    // Extract details from backend response
    const xp     = data?.xp_gained ?? 10;
    const level  = data?.level ?? '?';
    const streak = data?.streak_count ?? 0;
    const done   = Array.isArray(data?.completed_challenges)
      ? data.completed_challenges.length
      : 0;

    // Open our professional toast popup
    const query = new URLSearchParams({ xp, level, streak, done }).toString();

    return t.popup({
      title: 'Task Complete',
      url: `/toast.html?${query}`,
      height: 180
    });

  } catch (err) {
    console.error('Task completion error:', err);
    return t.alert({ message: '❌ Something went wrong.', duration: 4 });
  }
}

function openSettings(t) {
  return t.popup({
    title: 'Itero Settings',
    url: '/settings.html',
    height: 240
  });
}

// --- Capability registration ---
tpu.initialize({
  'board-buttons': () => [
    { icon: ICON_URL, text: 'Itero', callback: openDashboardFromButton }
  ],
  'card-buttons': () => [
    { icon: ICON_URL, text: 'Complete Task 🎯', callback: completeTask },
    { icon: ICON_URL, text: 'Open Itero', callback: openDashboardFromButton }
  ],
  'show-settings': openSettings
});
