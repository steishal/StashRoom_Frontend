import { useState } from 'react';
import { PostService } from '../services/postService.js';
import { Post } from '../models/Post.js';
import apiClient from "../apiClient.js";

export const usePostController = () => {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);

    const fetchPosts = async () => {
        const data = await PostService.getAllPosts();
        setPosts(data.map(p => new Post(p)));
    };

    const likePost = async (postId) => {
        try {
            const updatedPost = await PostService.like(postId);
            setPosts(posts.map(p =>
                p.id === postId ? new Post(updatedPost) : p
            ));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const createPost = async (postData) => {
        try {
            const newPost = await PostService.createPost(postData);
            setPosts([new Post(newPost), ...posts]);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const fetchPostById = async (id) => {
        try {
            const response = await apiClient.get(`/posts/${id}`);
            setPost(response.data);
        } catch (err) {
            console.error('Ошибка загрузки поста:', err);
        }
    };

    const updatePost = async (id, postData) => {
        return apiClient.put(`/posts/${id}`, postData);
    };

    const deletePost = async (postId) => {
        try {
            await PostService.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return {
        posts,
        post,
        fetchPosts,
        likePost,
        createPost,
        updatePost,
        deletePost,
        fetchPostById
    };
};
