import axios from "axios";

const nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;

const axiosInstance = axios.create({
  baseURL: "https://api.nasa.gov",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: nasaApiKey,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Request made to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
