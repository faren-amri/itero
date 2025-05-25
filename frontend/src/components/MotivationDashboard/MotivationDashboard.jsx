import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from './MoodTrends';
import ActiveChallenges from './ActiveChallenges';
import ChallengeSuggestions from './ChallengeSuggestions';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';

const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    t.getContext().then(ctx => {
      console.log("Loaded Trello context:", ctx);
      setUserId(ctx.member); // 👈 Trello member ID becomes our userId
    });
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={sharedStyles.heading}>Motivation Dashboard</h2>
      <div className={styles.grid}>
        <XPProgress userId={userId} />
        <StreakTracker userId={userId} />
        <MoodTrends userId={userId} />
        <ActiveChallenges userId={userId} />
        <ChallengeSuggestions userId={userId} />
      </div>
    </div>
  );
};

export default MotivationDashboard;
