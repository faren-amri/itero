// src/components/MotivationDashboard/MotivationDashboard.jsx
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
import { trello as t } from '../../lib/trello.js';
import { api } from '../../services/analyticsService';

const MotivationDashboard = ({ trelloMemberId }) => {
  const [userId, setUserId] = useState(null);      // internal backend user id
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(false);
  useCSSVariable('--section-heading', '#172b4d');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!trelloMemberId) return;
      try {
        const { data } = await api.get(`/api/users/lookup/${trelloMemberId}`);
        if (!cancelled) {
          // ✅ Prefer internal id; fall back if API uses another field name
          const internalId = data?.id ?? data?.user_id ?? null;
          setUserId(internalId);
        }
      } catch { /* noop */ }
    })();

    // Honor refresh flag set by powerup.js after actions
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
      {/* Top bar */}
      <div className={styles.grid} style={{ alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Itero Dashboard</h1>
        <div style={{ marginLeft: 'auto' }}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* Gamification (XP/Streak need internal userId) */}
      <h3 className={sharedStyles.heading}>Gamification</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>XP Progress</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Level progress</p>
          <div className={styles.innerCard}>
            {userId
              ? <XPProgress userId={userId} refreshKey={refreshKey} />
              : <p className={sharedStyles.muted}>Connecting account…</p>}
          </div>
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Daily Streak</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Keep it going</p>
          <div className={styles.innerCard}>
            {userId
              ? <StreakTracker userId={userId} refreshKey={refreshKey} />
              : <p className={sharedStyles.muted}>Connecting account…</p>}
          </div>
        </div>
      </div>

      {/* Mood — works with trelloMemberId */}
      <h3 className={sharedStyles.heading}>Mood</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Mood Input</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Today’s feeling</p>
          <MoodInput userId={trelloMemberId} onMoodLogged={() => setRefreshKey((p) => p + 1)} />
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Mood Trends</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Last 7 days</p>
          <MoodTrends userId={trelloMemberId} refreshKey={refreshKey} />
        </div>
      </div>

      {/* Challenges — these also use trelloMemberId */}
      <h3 className={sharedStyles.heading}>Challenges</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Suggested</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Ideas</p>
          <ChallengeSuggestions userId={trelloMemberId} onChallengeAccepted={() => setRefreshKey((p) => p + 1)} />
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Active</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>Goals</p>
          <ActiveChallenges userId={trelloMemberId} refreshKey={refreshKey} />
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Completed</h2>
          <p className={sharedStyles.muted} style={{ marginTop: -4, marginBottom: 8 }}>History</p>
          <CompletedChallenges userId={trelloMemberId} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default MotivationDashboard;
