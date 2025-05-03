import apiClient from '../Apiclient';

export const LikeService = {
    async getPostLikes(postId){
        const response = await apiClient.get(`/posts/${postId}/likes`);
        return response.data;
    },

    async likePost(postId){
        await apiClient.post(`/posts/${postId}/likes`);
    },

    async unlikePost(postId){
        await apiClient.delete(`/posts/${postId}/likes`);
    }
};
