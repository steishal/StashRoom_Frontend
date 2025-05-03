import apiClient from '../apiClient.js';

export const CategoryService = {

    async getAllCategories() {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    async createCategory(categoryData) {
        const response = await apiClient.post('/categories', categoryData);
        return response.data;
    },

    async updateCategory(id, categoryData) {
        const response = await apiClient.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    async getCategoryById(id) {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    async deleteCategory(id) {
        await apiClient.delete(`/categories/${id}`);
    }
};
