import React from 'react';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from './MoodTrends';

const MotivationDashboard = ({ userId }) => {
    return (
      <div className={styles.dashboard}>
        <h2 className={shared.heading}>Motivation Dashboard</h2>
        <div className={styles.grid}>
          <XPProgress userId={userId} />
          <StreakTracker userId={userId} />
          <MoodTrends />
        </div>
      </div>
    );
  };
  

export default MotivationDashboard;
