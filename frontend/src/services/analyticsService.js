import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getXPData = async (userId) => {
  const response = await fetch(`http://localhost:5000/api/tasks/xp/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch XP');
  return await response.json();
};


export const getStreakData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/streak`);
  return res.data;
};

export const getMoodData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/mood`);
  return res.data;
};
