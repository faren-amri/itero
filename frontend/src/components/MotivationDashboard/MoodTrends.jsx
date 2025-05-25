// src/components/mood/MoodTrends.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Card from '../common/Card';
import styles from '../../styles/components/MoodTrends.module.css';

const MoodTrends = ({ userId }) => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMoodHistory = async () => {
      try {
        const res = await fetch(`/api/moods/history?trello_member_id=${userId}`);
        const data = await res.json();
        setMoodData(data);
      } catch (err) {
        console.error('Failed to fetch mood history:', err);
      }
    };

    fetchMoodHistory();
  }, [userId]);

  return (
    <Card title="Mood Trends">
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--progress-blue)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MoodTrends;
