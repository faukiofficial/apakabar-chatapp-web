import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: true,
    checkAuthLoading: false,
    registerLoading: false,
    loginLoading: false,
    logoutLoading: false,
    isUpdateProfileLoading: false,

    checkAuth: async() => {
        set({ checkAuthLoading: true });
        try {
            const response = await axiosInstance.get('/user');
            set({ user: response.data.user, isAuthenticated: true, checkAuthLoading: false });
        } catch (error) {
            console.log(error.response.data.message);
            set({ user: null, isAuthenticated: false, checkAuthLoading: false });
        } finally {
            set({ checkAuthLoading: false });
        }
    },

    register: async (data) => {
        set({ registerLoading: true });
        try {
            const response = await axiosInstance.post('/auth/register', data);
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ registerLoading: false });
        }
    },

    login: async (data) => {
        set({ loginLoading: true });
        try {
            const response = await axiosInstance.post('/auth/login', data);
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ loginLoading: false });
        }
    },

    socialLogin: async (data) => {
        set({ loginLoading: true });
        try {
            const response = await axiosInstance.post('/auth/social-login', data);
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ loginLoading: false });
        }
    },

    logout: async () => {
        set({ logoutLoading: true });
        try {
            const response = await axiosInstance.post('/auth/logout');
            toast.success(response.data.message);
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdateProfileLoading: true });
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            if (data.profilePic) {
                formData.append('profilePic', data.profilePic);
            }
            const response = await axiosInstance.put('/user', formData);
            toast.success(response.data.message);
            set({ user: response.data.user });
            return true;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdateProfileLoading: false });
        }

        return false;
    }
}));

export default useAuthStore