import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from '../mood/MoodTrends';
import MoodInput from '../mood/MoodInput';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';

const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const args = t.args;

    console.log("📦 Trello context args:", args);

    const context = args?.[1] || args?.context || {};
    const memberId = context.member || context.memberId || null;

    if (memberId) {
      setUserId(memberId);
    } else {
      console.warn("⚠️ Could not extract Trello member ID from context:", context);
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={sharedStyles.heading}>Motivation Dashboard</h2>
      <div className={styles.grid}>
        <XPProgress userId={userId} />
        <StreakTracker userId={userId} />
        <MoodTrends userId={userId} refreshKey={refreshKey} />
        <MoodInput
          userId={userId}
          onMoodLogged={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </div>
  );
};

export default MotivationDashboard;
