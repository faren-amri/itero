import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from './MoodTrends';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';

const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
  const t = window.TrelloPowerUp.iframe();
  t.get("member", "id").then((memberId) => {
    console.log("Trello Member ID:", memberId);
    setUserId(memberId);
  });
}, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={sharedStyles.heading}>Motivation Dashboard</h2>
      <div className={styles.grid}>
        <XPProgress userId={userId} />
        <StreakTracker userId={userId} />
        <MoodTrends userId={userId} />
      </div>
    </div>
  );
};

export default MotivationDashboard;
