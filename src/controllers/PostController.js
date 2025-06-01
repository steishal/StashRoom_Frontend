import { useState } from 'react';
import { PostService } from '../services/postService.js';
import { Post } from '../models/Post.js';

export const usePostController = () => {
    const [posts, setPosts] = useState([]);

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

    const updatePost = async (postId, postData) => {
        try {
            const updatedPost = await PostService.updatePost(postId, postData);
            setPosts(posts.map(p =>
                p.id === postId ? new Post(updatedPost) : p
            ));
        } catch (error) {
            console.error('Error updating post:', error);
        }
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
        fetchPosts,
        likePost,
        createPost,
        updatePost,
        deletePost
    };
};
