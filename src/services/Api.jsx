import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Token əlavə et
instance.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Token vaxtı bitibsə yönləndir
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default instance;
