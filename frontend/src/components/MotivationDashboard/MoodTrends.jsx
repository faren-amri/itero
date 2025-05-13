import React from 'react';
import Card from '../common/Card';
import styles from '../../styles/components/MotivationDashboard.module.css';

const MoodTrends = () => {
  return (
    <Card title="Mood Trends">
      <p className={styles.placeholder}>[Mood chart coming soon]</p>
    </Card>
  );
};

export default MoodTrends;
