import React, { useEffect, useState } from 'react';
import { usePostController } from '../../../controllers/PostController';
import { FollowerService } from '../../../services/followerService';
import { useAuth } from '../../../context/AuthContext';
import PostComponent from './PostComponent';

const SubscriptionsFeed = () => {
    const { posts, fetchPosts } = usePostController();
    const { user } = useAuth();
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;

            try {
                const following = await FollowerService.getFollowing(user.id);
                const ids = following.map(f => f.id);
                setFollowingIds(ids);
            } catch (error) {
                console.error('Ошибка при загрузке подписок', error);
            }
        };

        loadData();
        fetchPosts();
    }, [user?.id]);

    if (!user || !followingIds.length) return <div>Загрузка...</div>;

    const filtered = posts.filter(post =>
        followingIds.includes(post.author?.id)
    );

    return (
        <div className="subscriptions-feed">
            <h2>Лента подписок</h2>
            {filtered.length === 0 ? (
                <p>Нет постов от подписок.</p>
            ) : (
                filtered.map(post => (
                    <PostComponent
                        key={post.id}
                        postData={post}
                        currentUserId={user.id}
                    />
                ))
            )}
        </div>
    );
};

export default SubscriptionsFeed;
