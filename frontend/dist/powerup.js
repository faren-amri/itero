function openDashboard(t) {
  return t.getContext().then(context =>
    t.signUrl('https://itero-powerup.netlify.app/#/dashboard')
      .then(signedUrl => {
        return t.modal({
          url: signedUrl,
          fullscreen: true,
          title: 'Motivation Dashboard',
          accentColor: '#4A90E2',
          args: {
            secret: 'itero-beta-2025',
            member: context.member,
            card: context.card
          }
        });
      })
  );
}

function completeTask(t) {
  return t.getContext().then(context =>
    t.signUrl('https://itero-powerup.netlify.app/#/dashboard')
      .then(signedUrl => {
        return t.modal({
          url: signedUrl,
          fullscreen: true,
          title: 'Complete Task',
          accentColor: '#4A90E2',
          args: {
            secret: 'itero-beta-2025',
            member: context.member,
            card: context.card
          }
        });
      })
  );
}

window.TrelloPowerUp.initialize({
  'board-buttons': function () {
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
