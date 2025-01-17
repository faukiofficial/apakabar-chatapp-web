import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useChatStore = create((set, get) => ({
    messages: [],
    users : [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    sendMessageLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/message/users-for-sidebar');
            set({ users: response.data.users, isUsersLoading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ isUsersLoading: false });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({ messages: response.data.messages, isMessagesLoading: false });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ isMessagesLoading: false });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        set({ sendMessageLoading: true });
        const { messages, selectedUser } = get();
        try {
            const formData = new FormData();
            formData.append('text', data.text);
            if (data.image) {
                formData.append('image', data.image);
            }
            const response = await axiosInstance.post(`/message/${selectedUser._id}`, formData);
            set({ sendMessageLoading: false, messages: [...messages, response.data.newMessage] });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            set({ sendMessageLoading: false });
        } finally {
            set({ sendMessageLoading: false });
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    }
}));

export default useChatStore;