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

const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const args = t.args;
    const context = args?.[1] || args?.context || {};
    const memberId = context.member || context.memberId || null;

    if (memberId) setUserId(memberId);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  };

  return (
    <div className={`${styles.dashboard} ${isDark ? styles.dark : styles.light}`}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {userId && (
        <div className={styles.grid}>
          <h3 className={styles.sectionHeading}>🎮 Gamification</h3>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>💡 XP Progress</h2>
            <XPProgress userId={userId} />
          </div>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>🔥 Daily Streak</h2>
            <StreakTracker userId={userId} />
          </div>

          <h3 className={styles.sectionHeading}>💚 Wellbeing</h3>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>🙂 Mood Tracker</h2>
            <div className={styles.subGrid}>
              <MoodInput userId={userId} onMoodLogged={() => setRefreshKey(prev => prev + 1)} />
              <MoodTrends userId={userId} refreshKey={refreshKey} />
            </div>
          </div>

          <h3 className={styles.sectionHeading}>🏆 Progress & Challenges</h3>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>🎯 Suggested Challenges</h2>
            <ChallengeSuggestions userId={userId} onChallengeAccepted={() => setRefreshKey(prev => prev + 1)} />
          </div>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>🚧 Active Challenges</h2>
            <ActiveChallenges userId={userId} />
          </div>

          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardTitle}>✅ Completed Challenges</h2>
            <CompletedChallenges userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MotivationDashboard;
