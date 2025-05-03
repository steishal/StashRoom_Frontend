import React from 'react';
import { Link } from 'react-router-dom';
import Post from '../components/PostModule';
import styles from './Profile.module.css';

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
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <h1>{profileData.username}</h1>
                    {currentUser?.id === userId && (
                        <div className={styles.profileActions}>
                            <i className={`fas fa-cog ${styles.settingsIcon}`} />
                            <div className={styles.actionsMenu}>
                                <Link to="/edit-profile" className={styles.menuItem}>
                                    Редактировать профиль
                                </Link>
                                <Link to="/settings" className={styles.menuItem}>
                                    Настройки
                                </Link>
                                <button className={styles.deleteButton}>
                                    Выйти
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <h2>Подписки</h2>
                        <p>{following.length}</p>
                    </div>
                    <div className={styles.statItem}>
                        <h2>Подписчики</h2>
                        <p>{followers.length}</p>
                    </div>
                </div>

                {currentUser?.id !== userId && (
                    <button
                        className={`${styles.followButton} ${
                            isFollowing ? styles.unfollow : styles.follow
                        }`}
                        onClick={toggleFollow}
                    >
                        {isFollowing ? 'Отписаться' : 'Подписаться'}
                    </button>
                )}
            </div>

            <div className={styles.postsContainer}>
                {profileData.posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        currentUserId={currentUser?.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileView;