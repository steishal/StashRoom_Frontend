import {useState, useEffect, useCallback, useContext} from 'react';
import { FollowerService } from '../services/followerService.js';
import { Follower } from '../models/Follower.js';
import {AuthContext} from '../context/AuthContext.jsx';

export const useFollowerController = (userId) => {

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

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
        if (!user.id || !userId) return;

        try {
            const followingList = await FollowerService.getFollowing(user.id);
            setIsFollowing(followingList.some(f => f.followingId === Number(userId)));
        } catch (err) {
            setError(err.message);
        }
    }, [user.id, userId]);

    const toggleFollow = async () => {
        if (!user.id) {
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

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            await Promise.all([checkFollowingStatus(), loadData()]);
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
