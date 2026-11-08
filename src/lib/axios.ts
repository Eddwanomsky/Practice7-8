import axios from 'axios';

const apiClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = import.meta.env.VITE_API_AUTH_TOKEN;
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default apiClient;