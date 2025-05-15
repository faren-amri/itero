import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getXPData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/xp`);
  return res.data;
};

export const getStreakData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/streak`);
  return res.data;
};

export const getMoodData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/mood`);
  return res.data;
};
