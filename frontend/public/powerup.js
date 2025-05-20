function openDashboard(t) {
  console.log('[powerup.js] openDashboard called');

  return t.getContext().then((context) => {
    return t.modal({
      url: 'https://itero-powerup.netlify.app/#/dashboard',
      fullscreen: true,
      title: 'Motivation Dashboard',
      accentColor: '#4A90E2',
      args: {
        card: context.card,
        member: context.member,
        secret: 'itero-beta-2025'
      }
    });
  });
}

function completeTask(t) {
  console.log('[powerup.js] completeTask called');

  return t.getContext().then((context) => {
    return t.modal({
      url: 'https://itero-powerup.netlify.app/#/dashboard',
      fullscreen: true,
      title: 'Complete Task',
      accentColor: '#4A90E2',
      args: {
        card: context.card,
        member: context.member,
        secret: 'itero-beta-2025'
      }
    });
  });
}
