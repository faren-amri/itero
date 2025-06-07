// src/services/analyticsService.js
import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'https://itero-api-fme7.onrender.com';

export const getXPData = async (userId) => {
  const res = await axios.get(`${API_BASE}/api/tasks/xp/${userId}`);
  return res.data;
};

export const getStreakData = async (userId) => {
  const res = await axios.get(`${API_BASE}/streaks/${userId}/streak`);
  return res.data;
};


export const getMoodData = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}/mood`);
  return res.data;
};

export const getMoodHistory = async (userId) => {
  const res = await axios.get(`${API_BASE}/api/moods/history?trello_member_id=${userId}`);
  return res.data;
};
