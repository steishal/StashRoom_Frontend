import React, { useEffect } from 'react';
import { usePostController } from '../../../controllers/PostController';
import PostComponent from './PostComponent';
import { useAuth } from '../../../context/AuthContext';

const PostList = () => {
    const { posts, fetchPosts } = usePostController();
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!user) return <div>Загрузка пользователя...</div>;
    if (!posts.length) return <div>Нет постов</div>;

    return (
        <div className="post-list">
            {posts
                .filter(post => post && post.id)
                .map(post => (
                    <PostComponent
                        key={post.id}
                        postData={post}
                        currentUserId={user.id}
                    />
                ))}
        </div>
    );
};

export default PostList;
