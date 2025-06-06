// src/components/mood/MoodTrends.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Card from '../common/Card';
import styles from '../../styles/components/MoodTrends.module.css';
import { API_BASE } from '../../services/analyticsService';

const MoodTrends = ({ userId, refreshKey }) => {
  const [moodData, setMoodData] = useState([]);

  const loadMoodData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/moods/history?trello_member_id=${userId}`);
      const data = await res.json();
      setMoodData(data);
    } catch (err) {
      console.error('Failed to fetch mood history:', err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadMoodData();
  }, [userId, refreshKey]);

  const moodLabel = (value) => {
    const map = {
      1: "😩 Burned Out",
      2: "😴 Tired",
      3: "😐 Neutral",
      4: "😊 Energized",
      5: "😁 Great",
    };
    return map[value] || value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const mood = moodLabel(payload[0].value);
      return (
        <div style={{
          background: '#fff',
          border: '1px solid #ccc',
          padding: '0.5rem',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <strong>{label}</strong><br />
          Mood: {mood}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="225px" height={220}>
          <LineChart data={moodData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="day"
              stroke="#aaa"
              fontSize={12}
              tick={{ fill: '#aaa' }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#aaa"
              fontSize={12}
              tickFormatter={moodLabel}
            />
            <Tooltip content={CustomTooltip} />
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--progress-blue)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--progress-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--progress-blue)"
              strokeWidth={2}
              fill="url(#moodGradient)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MoodTrends;
