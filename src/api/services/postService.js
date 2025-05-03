// postService.js
import apiClient from './apiClient';

export const PostService = {
    async getAllPosts() {
        const response = await apiClient.get('/posts');
        return response.data;
    },

    async createPost(postData) {
        const response = await apiClient.post('/posts', postData);
        return response.data;
    },

    async updatePost(id, postData) {
        const response = await apiClient.put(`/posts/${id}`, postData);
        return response.data;
    },

    async deletePost(id) {
        await apiClient.delete(`/posts/${id}`);
    }
};