import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

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
            toast.error(error.response?.data.message);
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
        } catch (error) {
            toast.error(error.response.data.message);
            set({ sendMessageLoading: false });
        } finally {
            set({ sendMessageLoading: false });
        }
    },

    updateMessage: async (data) => {
        set({ sendMessageLoading: true });
        const { selectedUser } = get();
        try {
            const formData = new FormData();
            formData.append('text', data.text);
            formData.append('messageId', data.messageId);
            if (data.image) {
                formData.append('image', data.image);
            }
            const response = await axiosInstance.put(`/message/${selectedUser._id}`, formData);
            set({ sendMessageLoading: false, messages: get().messages.map(message => message._id === response.data.updatedMessage._id ? response.data.updatedMessage : message) });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ sendMessageLoading: false });
        } finally {
            set({ sendMessageLoading: false });
        }
    },

    deleteMessage: async (messageId) => {
        set({ sendMessageLoading: true });
        const { selectedUser } = get();
        try {
            await axiosInstance.delete(`/message/${selectedUser._id}/${messageId}`);
            set({ sendMessageLoading: false, messages: get().messages.filter(message => message._id !== messageId) });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ sendMessageLoading: false });
        } finally {
            set({ sendMessageLoading: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (message) => {
            const isMessageSentFromSelectedUser = message.sender._id === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: [...get().messages, message] });
        });
        socket.on('updatedMessage', (updatedMessage) => {
            const isMessageSentFromSelectedUser = updatedMessage.sender._id === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: get().messages.map(message => message._id === updatedMessage._id ? updatedMessage : message) });
        });
        socket.on('deletedMessage', (deletedMessage) => {
            const isMessageSentFromSelectedUser = deletedMessage.sender === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: get().messages.filter(message => message._id !== deletedMessage._id) });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
        socket.off('updatedMessage');
        socket.off('deletedMessage');
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    }
}));

export default useChatStore;