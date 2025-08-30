import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from '../mood/MoodTrends';
import MoodInput from '../mood/MoodInput';
import ActiveChallenges from '../challenges/ActiveChallenges';
import CompletedChallenges from '../challenges/CompletedChallenges';
import ChallengeSuggestions from '../challenges/ChallengeSuggestions';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';
import useCSSVariable from '../../hooks/useCSSvariable';
import { trello as t } from '../../main.jsx';

const API = 'https://itero-api-fme7.onrender.com';

const MotivationDashboard = ({ trelloMemberId }) => {
  const [userId, setUserId] = useState(null); // backend user id
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(false);
  useCSSVariable('--section-heading', '#172b4d');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!trelloMemberId) return;
      try {
        const res = await fetch(`${API}/api/users/lookup/${trelloMemberId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.trello_id) setUserId(data.trello_id);
      } catch {}
    })();

    // 🔒 Respect Trello context if present; safe when opened outside Trello
    if (t) {
      t.get('member', 'shared', 'refresh')
        .then((should) => {
          if (should) {
            setRefreshKey((p) => p + 1);
            t.set('member', 'shared', 'refresh', false);
          }
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, [trelloMemberId]);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.body.setAttribute('data-theme', next);
  };

  return (
    <div className={`${styles.dashboard} ${isDark ? styles.dark : styles.light}`}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {userId && trelloMemberId && (
        <>
          <h3 className={sharedStyles.heading} style={{ color: '#ffffff' }}>🎮 Gamification</h3>
          <div className={styles.subGrid}>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>💡 XP Progress</h2>
              <div className={styles.innerCard}>
                <XPProgress userId={userId} refreshKey={refreshKey} />
              </div>
            </div>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>🔥 Daily Streak</h2>
              <div className={styles.innerCard}>
                <StreakTracker userId={userId} refreshKey={refreshKey} />
              </div>
            </div>
          </div>

          <h3 className={sharedStyles.heading} style={{ color: '#ffffff' }}>💚 Mood Tracker</h3>
          <div className={styles.subGrid}>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>🙂 Mood Input</h2>
              <MoodInput userId={trelloMemberId} onMoodLogged={() => setRefreshKey((p) => p + 1)} />
            </div>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>📈 Mood Trends</h2>
              <MoodTrends userId={trelloMemberId} refreshKey={refreshKey} />
            </div>
          </div>

          <h3 className={sharedStyles.heading} style={{ color: '#ffffff' }}>🏆 Progress & Challenges</h3>
          <div className={styles.subGrid}>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>🎯 Suggested Challenges</h2>
              <ChallengeSuggestions userId={trelloMemberId} onChallengeAccepted={() => setRefreshKey((p) => p + 1)} />
            </div>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>🚧 Active Challenges</h2>
              <ActiveChallenges userId={trelloMemberId} refreshKey={refreshKey} />
            </div>
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardTitle}>✅ Completed Challenges</h2>
              <CompletedChallenges userId={trelloMemberId} refreshKey={refreshKey} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MotivationDashboard;
