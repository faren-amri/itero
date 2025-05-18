// src/components/dashboard/MoodTrends.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Card from '../common/Card';
import styles from '../../styles/components/MoodTrends.module.css';

const dummyMoodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 5 },
];

const MoodTrends = () => {
  return (
    <Card title="Mood Trends">
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dummyMoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#4A90E2"
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
