import React, { useEffect } from 'react';
import { usePostController } from '../../../controllers/PostController';
import PostComponent from './PostComponent';

const UserPosts = ({ userId, currentUserId }) => {
    const { posts, fetchPosts } = usePostController();

    useEffect(() => {
        fetchPosts();
    }, []);

    const userPosts = posts.filter(post => post.author?.id === parseInt(userId));

    if (!userPosts.length) return <p>Нет постов у пользователя.</p>;

    return (
        <div>
            <h3>Посты</h3>
            {userPosts.map(post => (
                <PostComponent
                    key={post.id}
                    postData={post}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};

export default UserPosts;
