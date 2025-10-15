// src/components/mood/MoodTrends.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import styles from '../../styles/components/MoodTrends.module.css';
import { API_BASE } from '../../services/analyticsService';

const MoodTrends = ({ userId, refreshKey }) => {
  const [moodData, setMoodData] = useState([]);

  const [textColor, setTextColor] = useState('#1a1f29');
  const [gridColor, setGridColor] = useState('#d9dee6');

  useEffect(() => {
    const applyVars = () => {
      const root = document.documentElement;
      const text = getComputedStyle(root).getPropertyValue('--text-main')?.trim() || '#1a1f29';
      const border = getComputedStyle(root).getPropertyValue('--border')?.trim() || '#d9dee6';
      setTextColor(text);
      setGridColor(border);
    };
    applyVars();

    const observer = new MutationObserver(applyVars);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const loadMoodData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/moods/history?trello_member_id=${userId}`);
      const data = await res.json();
      setMoodData(data);
    } catch (err) {
      console.error("Failed to fetch mood history:", err);
    }
  };

  useEffect(() => {
    if (userId) loadMoodData();
  }, [userId, refreshKey]);

  const moodLabel = (value) => ({
    1: "Burned Out",
    2: "Tired",
    3: "Neutral",
    4: "Energized",
    5: "Great",
  }[value] || value);

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
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={moodData}
          // tighter right edge
          margin={{ top: 20, right: 0, bottom: 20, left: 56 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />

          <XAxis
            dataKey="day"
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            tick={{ fill: textColor, fontSize: 12 }}
            tickMargin={10}
            interval="preserveStartEnd"
            // 👇 key fixes
            scale="point"                     // no band -> no extra half-band at ends
            padding={{ left: 0, right: 0 }}   // zero out additional axis padding
            allowDuplicatedCategory={false}   // if your data repeats labels (e.g., Mon twice)
          />

          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            width={96}
            tick={{ fill: textColor, fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(v) =>
              ({1:'Burned Out',2:'Tired',3:'Neutral',4:'Energized',5:'Great'}[v] || v)
            }
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--progress)"
            strokeWidth={2}
            dot={{ r: 4, stroke: 'var(--surface)', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );  
};

export default MoodTrends;
