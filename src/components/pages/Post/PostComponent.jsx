import React, { useState } from 'react';
import PostView from './PostView.jsx';
import { useLikeController } from "../../../controllers/LikeController.js";
import { usePostController } from "../../../controllers/PostController.js";
import { Post } from '../../../models/Post.js';

const PostComponent = ({ postData, currentUserId }) => {
    const [post, setPost] = useState(() => new Post(postData));
    const { deletePost } = usePostController();
    const { handleLike } = useLikeController(post.id);
    if (!postData) {
        console.warn('postData не передан в PostComponent');
        return null;
    }

    const handleLikeClick = async () => {
        try {
            const updatedPost = await handleLike();
            setPost(new Post(updatedPost));
        } catch (error) {
            console.error('Ошибка при лайке поста:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить пост?')) {
            try {
                await deletePost(post.id);
                window.location.reload();
            } catch (error) {
                console.error('Ошибка при удалении поста:', error);
            }
        }
    };

    return (
        <PostView
            post={post}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onLike={handleLikeClick}
        />
    );
};

export default PostComponent;
