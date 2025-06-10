import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;

        if (status === 403) {
            window.location.href = '/login';
        } else if (status === 404) {
            window.location.href = '/404';
        } else if (status === 500) {
            window.location.href = '/500';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
