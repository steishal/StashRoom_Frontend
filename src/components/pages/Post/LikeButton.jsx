import React from 'react';
import styles from '../../../styles/Post.module.css';

export const LikeButton = ({ isLiked, onClick, count }) => {
    return (
        <button onClick={onClick} className={styles.likeBtn}>
            <i className={`fa-heart ${isLiked ? 'fas' : 'far'} ${isLiked ? styles.liked : ''}`} />
            <span>{count}</span>
        </button>
    );
};
