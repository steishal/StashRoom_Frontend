import apiClient from '../apiClient.js';

export const FollowerService = {
    async getFollowers(userId){
        const response = await apiClient.get(`/users/${userId}/followers`);
        return response.data;
    },

    async getFollowing(userId){
        const response = await apiClient.get(`/users/${userId}/following`);
        return response.data;
    },

    async follow(followingId){
        await apiClient.post(`/users/${followingId}/follow`);
    },

    async unfollow(followingId){
        await apiClient.delete(`/users/${followingId}/follow`);
    }
};
