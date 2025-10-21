// src/components/mood/MoodTrends.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import styles from '../../styles/components/MoodTrends.module.css';
import { API_BASE } from '../../services/analyticsService';

const MoodTrends = ({ userId, refreshKey }) => {
  const [rows, setRows] = useState([]);

  // theme-aware colors read from :root
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
    const obs = new MutationObserver(applyVars);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/moods/history?trello_member_id=${userId}`);
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch {
        setRows([]);
      }
    };
    if (userId) load();
  }, [userId, refreshKey]);

  // Map to numeric X (idx) to eliminate category end padding
  const data = useMemo(
    () => rows.map((d, i) => ({ ...d, idx: i })),
    [rows]
  );

  const xTicks = useMemo(() => data.map(d => d.idx), [data]);
  const xDomain = useMemo(
    () => (data.length ? [0, data.length - 1] : [0, 0]),
    [data.length]
  );

  const moodLabel = (value) => ({
    1: 'Burned Out',
    2: 'Tired',
    3: 'Neutral',
    4: 'Energized',
    5: 'Great',
  }[value] ?? value);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p0 = payload[0];
      const i = p0?.payload?.idx ?? 0;
      const day = data[i]?.day ?? '';
      const mood = moodLabel(p0?.value);
      return (
        <div className={styles.tooltip}>
          <strong>{day}</strong><br />
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
          data={data}
          margin={{ top: 20, right: 24, bottom: 20, left: 56 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="4 4" />

          {/* X as numeric index -> no half-band padding */}
          <XAxis
            type="number"
            dataKey="idx"
            domain={xDomain}
            ticks={xTicks}
            allowDecimals={false}
            allowDataOverflow
            padding={{ left: 0, right: 0 }}
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            tick={{ fill: textColor, fontSize: 12 }}
            tickMargin={10}
            interval={0}
            tickFormatter={(i) => data[i]?.day ?? ''}
          />

          <YAxis
            type="number"
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke={textColor}
            tickLine={{ stroke: textColor }}
            width={96}
            tick={{ fill: textColor, fontSize: 12 }}
            tickMargin={10}
            tickFormatter={moodLabel}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--progress)"
            strokeWidth={2}
            dot={{ r: 4, stroke: 'var(--surface)', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrends;
