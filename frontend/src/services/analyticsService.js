// src/services/analyticsService.js
import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL || "https://itero-api-dev-zg94.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Reads
export const getXPData       = (userId) => api.get(`/api/tasks/xp/${userId}`).then(r => r.data);
export const getStreakData   = (userId) => api.get(`/api/streaks/${userId}/streak`).then(r => r.data);
export const getMoodData     = (userId) => api.get(`/user/${userId}/mood`).then(r => r.data);
export const getMoodHistory  = (userId) =>
  api.get(`/api/moods/history`, { params: { trello_member_id: userId } }).then(r => r.data);
