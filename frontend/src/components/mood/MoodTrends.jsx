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
import styles from '../../styles/components/MoodTrends.module.css';
import { API_BASE } from '../../services/analyticsService';

const MoodTrends = ({ userId, refreshKey }) => {
  const [moodData, setMoodData] = useState([]);
  const [textColor, setTextColor] = useState('#172b4d');

  useEffect(() => {
    const updateColor = () => {
      const computed = getComputedStyle(document.body).getPropertyValue('--text-main');
      setTextColor(computed?.trim() || '#f4f5f7');
    };
    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

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
    if (userId) loadMoodData();
  }, [userId, refreshKey]);

  const moodLabel = (value) => {
    const map = {
      1: "Burned Out",
      2: "Tired",
      3: "Neutral",
      4: "Energized",
      5: "Great",
    };
    return map[value] || value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const mood = moodLabel(payload[0].value);
      return (
        <div className={styles.tooltip}>
          <strong>{label}</strong><br />
          Mood: {mood}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={moodData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="day"
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={moodLabel}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--progress-blue)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrends;
