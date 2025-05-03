import React, { useState } from 'react';
import { usePostController } from '../controllers/PostController';
import { useLikeController } from '../controllers/LikeController';
import PostView from './PostView';

const PostComponent = ({ postData, currentUserId }) => {
    const [post, setPost] = useState(new PostComponent(postData));
    const { deletePost } = usePostController();
    const { handleLike } = useLikeController(post.id);

    const handleLikeClick = async () => {
        try {
            const updatedPost = await handleLike();
            setPost(updatedPost);
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить пост?')) {
            try {
                await deletePost(post.id);
            } catch (error) {
                console.error('Error deleting post:', error);
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
