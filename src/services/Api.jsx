import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// 🔐 Token əlavə et
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ❌ Token vaxtı bitibsə yönləndir
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default instance;

//
// ✅ MEAL API-ları
//
export const getMeals = async () => {
  const res = await instance.get('/meals');
  return res.data;
};

export const addMeal = async (mealData) => {
  const res = await instance.post('/meals', mealData);
  return res.data;
};

export const updateMeal = async (id, updatedData) => {
  const res = await instance.put(`/meals/${id}`, updatedData);
  return res.data;
};

export const deleteMeal = async (id) => {
  const res = await instance.delete(`/meals/${id}`);
  return res.data;
};

//
// ✅ SHOPPING LIST API-ları
//
export const getNotes = async () => {
  const res = await instance.get('/shopping-list');
  return res.data;
};

export const addNote = async (text) => {
  const res = await instance.post('/shopping-list', { text });
  return res.data;
};

export const editNote = async (id, newText) => {
  const res = await instance.put(`/shopping-list/${id}`, { text: newText });
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await instance.delete(`/shopping-list/${id}`);
  return res.data;
};
