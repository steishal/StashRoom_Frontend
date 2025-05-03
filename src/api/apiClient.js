// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://your-api-url.com/api',
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;