import apiClient from '../apiClient.js';

export const CategoryService = {

    async getAllCategories() {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    async getAllCategoriesForAdmin() {
        const response = await apiClient.get('/admin/categories');
        return response.data;
    },

    async createCategory(categoryData) {
        const response = await apiClient.post('/admin/category/create', categoryData);
        return response.data;
    },

    async updateCategory(id, categoryData) {
        const response = await apiClient.put(`/admin/category/${id}`, categoryData);
        return response.data;
    },

    async getCategoryById(id) {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    async deleteCategory(id) {
        await apiClient.delete(`/admin/category/${id}`);
    }
};
