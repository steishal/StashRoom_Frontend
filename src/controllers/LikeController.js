import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { LikeService } from '../services/likeService.js';
import { Like } from '../models/Like.js';

export const useLikeController = (postId) => {
    const { user } = useContext(AuthContext);
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

            if (user) {
                const userLike = likesData.some(l => l.userId === user.id);
                setIsLiked(userLike);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [postId, user]);

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    const handleLike = async () => {
        console.log('Лайк нажали');

        if (!user) {
            console.log('Пользователь не авторизован');
            setError('You must be logged in to like posts');
            return;
        }

        let previousLikes;

        try {
            setError(null);
            previousLikes = [...likes];

            if (!isLiked) {
                console.log('Ставим лайк...');
                await LikeService.likePost(postId);
                setLikes(prev => [...prev, { postId, user: { id: user.id } }]);
                setIsLiked(true);
            } else {
                console.log('Убираем лайк...');
                await LikeService.unlikePost(postId);
                setLikes(prev =>
                    prev.filter(l =>
                        (l.user && l.user.id !== user.id) ||
                        (l.userId && l.userId !== user.id)
                    )
                );
                setIsLiked(false);
            }

            console.log('Лайки после:', likes);

        } catch (err) {
            console.log('Ошибка:', err);
            setLikes(previousLikes);
            setIsLiked(isLiked);
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
