import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import MoodModal from '../common/MoodModal';
import styles from '../../styles/components/MotivationDashboard.module.css';
import { getMoodData } from '../../services/analyticsService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';

const MoodTrends = ({ userId }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const moodData = await getMoodData(userId);
        setData(moodData);
      } catch (err) {
        console.error('Failed to fetch mood data:', err);
      }
    };

    fetchMood();
  }, [userId]);

  const handleLogMood = async (mood) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/${userId}/mood`, { mood });
      const updatedData = await getMoodData(userId);
      setData(updatedData);
    } catch (err) {
      console.error('Failed to log mood:', err);
    }
  };

  return (
    <Card title="Mood Trends">
      <button className={styles.logMoodBtn} onClick={() => setShowModal(true)}>
        Log Mood
      </button>

      {data.length === 0 ? (
        <p className={styles.placeholder}>No mood data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--progress-blue)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--progress-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#aaa"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
            />
            <YAxis domain={[1, 5]} tickCount={5} stroke="#aaa" />
            <Tooltip
              contentStyle={{ backgroundColor: '#222', borderRadius: '0.5rem', border: 'none' }}
              labelStyle={{ color: '#ccc' }}
              formatter={(value) => [`Mood: ${value}`, '']}
              labelFormatter={(label) => `Date: ${format(new Date(label), 'MMM d, yyyy')}`}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="var(--progress-blue)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={600}
              fill="url(#moodGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {showModal && (
        <MoodModal
          onClose={() => setShowModal(false)}
          onSubmit={handleLogMood}
        />
      )}
    </Card>
  );
};

export default MoodTrends;
