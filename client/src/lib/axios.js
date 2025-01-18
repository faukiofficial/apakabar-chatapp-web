import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;
const MODE = import.meta.env.VITE_MODE;

export const axiosInstance = axios.create({
    baseURL: MODE === "development" ? `${API_URL}/api/v1` : `/api/v1`,
    withCredentials: true
});