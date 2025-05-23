import React from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from './MoodTrends';
import ActiveChallenges from './ActiveChallenges';


const MotivationDashboard = ({ userId }) => {
  return (
    <div className={styles.dashboard}>
      <h2 className={sharedStyles.heading}>Motivation Dashboard</h2>
      <div className={styles.grid}>
        <XPProgress userId={userId} />
        <StreakTracker userId={userId} />
        <ActiveChallenges userId={userId} />
        <MoodTrends />
      </div>
    </div>
  );
};

export default MotivationDashboard;
