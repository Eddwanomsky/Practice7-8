import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Замініть на ваш базовий URL бекенду
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-інтерцептор для додавання Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);