window.TrelloPowerUp.initialize({
  'board-buttons': function (t) {
    return [{
      icon: 'https://itero-powerup.netlify.app/icon.png',
      text: 'Open Itero',
      callback: async function (t) {
        const signedUrl = await t.signUrl('https://itero-powerup.netlify.app/#/dashboard');
        const context = await t.getContext(); // ✅ properly await this

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
      }
    }];
  },

  'card-buttons': function (t) {
    return [{
      text: 'Complete Task 🎯',
      callback: async function (t) {
        const signedUrl = await t.signUrl('https://itero-powerup.netlify.app/#/dashboard');
        const context = await t.getContext(); // ✅ properly await this

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
      }
    }];
  }
});
