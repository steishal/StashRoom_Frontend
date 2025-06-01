import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { LikeService } from '../services/likeService.js';
import { Like } from '../models/Like.js';

export const useLikeController = (postId) => {
    const { currentUser } = useContext(AuthContext);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLikes = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await LikeService.getPostLikes(postId);
            const likesData = data.map(l => new Like(l));
            setLikes(likesData);

            if (currentUser) {
                const userLike = likesData.some(l => l.user.id === currentUser.id);
                setIsLiked(userLike);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [postId, currentUser]);

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    const handleLike = async () => {
        if (!currentUser) {
            setError('You must be logged in to like posts');
            return;
        }

        let previousLikes;

        try {
            setError(null);
            previousLikes = [...likes];
            setIsLiked(prev => !prev);

            if (!isLiked) {
                await LikeService.likePost(postId);
                setLikes(prev => [...prev, new Like({
                    id: Date.now(),
                    user: currentUser,
                    postId
                })]);
            } else {
                await LikeService.unlikePost(postId);
                setLikes(prev => prev.filter(l => l.user.id !== currentUser.id));
            }
        } catch (err) {
            setIsLiked(prev => !prev);
            setLikes(previousLikes);
            setError(err.message);
        }
    };

    return {
        likes,
        isLiked,
        isLoading,
        error,
        handleLike,
        fetchLikes
    };
};
