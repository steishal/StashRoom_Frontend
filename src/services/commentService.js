import apiClient from '../apiClient.js';

export const CommentService = {
    async  getCommentsByPost(postId){
        const response = await apiClient.get(`/comments/post/${postId}`);
        return response.data;
    },

    async createComment(commentData){
        const response = await apiClient.post('/comments', commentData);
        return response.data;
    },

    async updateComment(commentData){
        const response = await apiClient.put(`/comments/${commentData.id}`, commentData);
        return response.data;
    },

    async deleteComment(commentId){
        await apiClient.delete(`/comments/${commentId}`);
    }
};
