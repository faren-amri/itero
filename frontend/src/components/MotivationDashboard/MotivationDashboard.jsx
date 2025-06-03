import React, { useEffect, useState } from 'react';
import XPProgress from './XPProgress';
import StreakTracker from './StreakTracker';
import MoodTrends from '../mood/MoodTrends';
import MoodInput from '../mood/MoodInput';
import styles from '../../styles/components/MotivationDashboard.module.css';
import ActiveChallenges from '../challenges/ActiveChallenges';
import CompletedChallenges from '../challenges/CompletedChallenges';
import ChallengeSuggestions from '../challenges/ChallengeSuggestions';

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
    <div className={styles.grid}>
      {userId && (
        <>
          <XPProgress userId={userId} />
          <StreakTracker userId={userId} />
          <MoodTrends userId={userId} refreshKey={refreshKey} />
          <MoodInput userId={userId} onMoodLogged={() => setRefreshKey(prev => prev + 1)} />

          <ChallengeSuggestions userId={userId} onChallengeAccepted={() => setRefreshKey(prev => prev + 1)} />
          <ActiveChallenges userId={userId} />
          <CompletedChallenges userId={userId} />
        </>
      )}
    </div>
  );
};

export default MotivationDashboard;
