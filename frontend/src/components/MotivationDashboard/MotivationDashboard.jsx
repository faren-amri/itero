import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from '../mood/MoodTrends';
import MoodInput from '../mood/MoodInput';
import styles from '../../styles/components/MotivationDashboard.module.css';
import sharedStyles from '../../styles/shared/Shared.module.css';


const MotivationDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    const context = t.args[1]; // Trello injects member ID here

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
        <MoodTrends userId={userId} />
        <MoodInput userId={userId} onMoodLogged={() => console.log('Mood updated!')} />
      </div>
    </div>
  );
};

export default MotivationDashboard;
