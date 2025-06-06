import React, { useEffect } from 'react';
import { usePostController } from '../../../controllers/PostController';
import PostComponent from './PostComponent';

const UserPosts = ({ userId, currentUserId }) => {
    const { posts, fetchPosts } = usePostController();

    useEffect(() => {
        fetchPosts();
    }, []);

    const userPosts = posts.filter(post => post.author?.id === parseInt(userId));

    return (
        <div>
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
