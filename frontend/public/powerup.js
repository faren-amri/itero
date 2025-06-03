console.log('[powerup.js] Loaded and running');

function completeTask(t) {
  console.log('[powerup.js] completeTask called');

  const context = t.getContext(); // ✅ This is synchronous
  const cardId = context.card;
  const memberId = context.member;

  return fetch('https://itero-api-fme7.onrender.com/api/tasks/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trello_user_id: memberId,
      task_id: cardId
    })
  }).then(response => {
    if (response.ok) {
      console.log('✅ Task completed successfully');
      return t.closePopup();
    } else {
      return response.json().then(err => {
        console.error('❌ Task completion failed:', err);
        alert('Task completion failed.');
      });
    }
  }).catch(err => {
    console.error('❌ Network error:', err);
    alert('Network error while completing the task.');
  });
}

function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');
  return t.modal({
    url: 'https://itero-powerup.netlify.app/#/dashboard',
    fullscreen: true,
    title: 'Motivation Dashboard',
    accentColor: '#4A90E2',
    args: {
      member: t.getContext().member,
      secret: 'itero-beta-2025'
    }
  });
}

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
    console.log('[powerup.js] board-buttons callback triggered');
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: openDashboard
    }];
  },
  'card-buttons': function () {
    return [{
      text: 'Complete Task 🎯',
      callback: completeTask
    }];
  }
});
