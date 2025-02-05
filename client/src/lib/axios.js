import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api/v1`,
    withCredentials: true
});