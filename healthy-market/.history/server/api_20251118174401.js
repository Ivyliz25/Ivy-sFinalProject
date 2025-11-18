import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});


api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API response received:", response.status);
    return response;
  },
  (error) => {
    console.error("API response error:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - server is not responding';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Cannot connect to server. Please make sure the backend is running.';
    }
    
    return Promise.reject(error);
  }
);

export default api;