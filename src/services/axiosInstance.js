import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Favorite API-lar
export const getFavorites = async () => {
  const res = await axiosInstance.get('/favorites');
  return res.data;
};

export const addFavorite = async (recipeId) => {
  const res = await axiosInstance.post('/favorites', { recipeId });
  return res.data;
};

export const removeFavorite = async (recipeId) => {
  const res = await axiosInstance.delete(`/favorites/${recipeId}`);
  return res.data;
};

// Comment API-lar
export const getComments = async (recipeId) => {
  const res = await axiosInstance.get(`/comments/${recipeId}`);
  return res.data;
};

export const addComment = async ({ recipeId, content }) => {
  const res = await axiosInstance.post(`/comments`, { recipeId, content });
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await axiosInstance.delete(`/comments/${commentId}`);
  return res.data;
};

export const likeComment = async (commentId) => {
  const res = await axiosInstance.post(`/comments/${commentId}/like`);
  return res.data;
};

export default axiosInstance;