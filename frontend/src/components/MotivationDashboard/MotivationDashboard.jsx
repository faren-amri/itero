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
import { trello as t } from '../../lib/trello.js';
import { api } from '../../services/analyticsService';

const MotivationDashboard = ({ trelloMemberId }) => {
  const [userId, setUserId] = useState(null);      // ← internal id
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!trelloMemberId) return;
      try {
        const { data } = await api.get(`/api/users/lookup/${trelloMemberId}`);
        if (!cancelled) {
          // ✅ prefer internal id; fall back if backend uses a different key
          const internalId = data?.id ?? data?.user_id ?? null;
          setUserId(internalId);
        }
      } catch {
        if (!cancelled) setUserId(null);
      }
    })();

    // trigger data refresh after actions (toast flow you already had)
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
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.grid} style={{ alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Itero Dashboard</h1>
        <div style={{ marginLeft: 'auto' }}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* Gamification (guard per-card) */}
      <h3 className={sharedStyles.heading}>Gamification</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>XP Progress</h2>
          <div className={styles.innerCard}>
            {userId
              ? <XPProgress userId={userId} refreshKey={refreshKey} />
              : <p className={sharedStyles.muted}>Connecting account…</p>}
          </div>
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Daily Streak</h2>
          <div className={styles.innerCard}>
            {userId
              ? <StreakTracker userId={userId} refreshKey={refreshKey} />
              : <p className={sharedStyles.muted}>Connecting account…</p>}
          </div>
        </div>
      </div>

      {/* Mood — uses trelloMemberId (stable) */}
      <h3 className={sharedStyles.heading}>Mood</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Mood Input</h2>
          <div className={styles.innerCard}>
            <MoodInput userId={trelloMemberId} onMoodLogged={() => setRefreshKey(p => p + 1)} />
          </div>
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Mood Trends</h2>
          <div className={styles.innerCard}>
            <MoodTrends userId={trelloMemberId} refreshKey={refreshKey} />
          </div>
        </div>
      </div>

      {/* Challenges — use trelloMemberId */}
      <h3 className={sharedStyles.heading}>Challenges</h3>
      <div className={styles.subGrid}>
        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Suggested</h2>
          <div className={styles.innerCard}>
            <ChallengeSuggestions userId={trelloMemberId} onChallengeAccepted={() => setRefreshKey(p => p + 1)} />
          </div>
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Active</h2>
          <div className={styles.innerCard}>
            <ActiveChallenges userId={trelloMemberId} refreshKey={refreshKey} />
          </div>
        </div>

        <div className={sharedStyles.card}>
          <h2 className={sharedStyles.cardTitle}>Completed</h2>
          <div className={styles.innerCard}>
            <CompletedChallenges userId={trelloMemberId} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationDashboard;
