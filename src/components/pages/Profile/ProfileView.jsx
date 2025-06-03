import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/Profile.module.css';
import UserPosts from "../Post/UserPosts.jsx";

const ProfileView = ({
                         isLoading,
                         error,
                         profileData,
                         currentUser,
                         userId,
                         followers,
                         following,
                         isFollowing,
                         toggleFollow
                     }) => {
    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!profileData) {
        return null;
    }

    return (
        <div className={styles.content}>
            <div className={styles.avatarSection}>
                <img
                    src={profileData.avatarUrl || "/default-avatar.png"}
                    alt="Avatar"
                    className={styles.avatar}
                />
                <div className={styles.username}>{profileData.username}</div>

                {currentUser?.id !== userId && (
                    <button
                        className={`${styles.followButton} ${
                            isFollowing ? styles.unfollow : ""
                        }`}
                        onClick={toggleFollow}
                    >
                        {isFollowing ? "Отписаться" : "Подписаться"}
                    </button>
                )}
            </div>

            <div className={styles.statsSection}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Подписки</div>
                    <div className={styles.statCount}>{following.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Подписчики</div>
                    <div className={styles.statCount}>{followers.length}</div>
                </div>
            </div>

            <div className={styles.postsContainer}>
                <UserPosts userId={userId} currentUserId={currentUser?.id} />
            </div>
        </div>
    );
};

export default ProfileView;