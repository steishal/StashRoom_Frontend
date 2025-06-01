import { useState, useEffect, useCallback} from 'react';
import { FollowerService } from '../services/followerService.js';
import { Follower } from '../models/Follower.js';
import { useAuth } from '../context/AuthContext.jsx';

export const useFollowerController = (userId) => {
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.id;

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [followersData,
                followingData] = await Promise.all([
                FollowerService.getFollowers(userId),
                FollowerService.getFollowing(userId)
            ]);
            setFollowers(followersData.map(f => new Follower(f)));
            setFollowing(followingData.map(f => new Follower(f)));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const checkFollowingStatus = useCallback(async () => {
        if (!currentUserId || !userId) return;

        try {
            const followingList = await FollowerService.getFollowing(currentUserId);
            setIsFollowing(followingList.some(f => f.following.id === userId));
        } catch (err) {
            setError(err.message);
        }
    }, [currentUserId, userId]);

    const toggleFollow = async () => {
        if (!currentUserId) {
            setError('Authorization required');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (isFollowing) {
                await FollowerService.unfollow(userId);
            } else {
                await FollowerService.follow(userId);
            }

            await Promise.all([checkFollowingStatus(), loadData()]);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setIsFollowing(prev => !prev);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const initializeData = async () => {
            await loadData();
            await checkFollowingStatus();
        };

        initializeData();
    }, [userId, loadData, checkFollowingStatus]);

    return {
        followers,
        following,
        isFollowing,
        isLoading,
        error,
        toggleFollow
    };
};
