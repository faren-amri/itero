import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from '../mood/MoodTrends';
import MoodInput from '../mood/MoodInput';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';

const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ New state to trigger refresh

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const context = t.args[1];

    if (context?.member) {
      setUserId(context.member);
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={sharedStyles.heading}>Motivation Dashboard</h2>
      <div className={styles.grid}>
        <XPProgress userId={userId} />
        <StreakTracker userId={userId} />
        <MoodTrends userId={userId} refreshKey={refreshKey} /> {/* ✅ Pass refreshKey */}
        <MoodInput
          userId={userId}
          onMoodLogged={() => setRefreshKey(prev => prev + 1)} // ✅ Trigger refresh
        />
      </div>
    </div>
  );
};

export default MotivationDashboard;
