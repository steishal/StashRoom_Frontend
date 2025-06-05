import React, {useEffect, useState} from 'react';
import styles from '../../../styles/Profile.module.css';
import UserPosts from "../Post/UserPosts.jsx";
import AvatarUploader from './AvatarUploader';
import { useAuth } from '../../../context/AuthContext.jsx';
import {useUserController} from "../../../controllers/UserController.js";


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
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { user } = useAuth();
    const {fetchUserAvatar} = useUserController();

    useEffect(() => {
        const loadAvatar = async () => {
            try {
                const avatar = await fetchUserAvatar(userId);
                setAvatarUrl(avatar);
            } catch (err) {
                console.error("Ошибка при загрузке аватара:", err);
            }
        };

        if (userId) {
            loadAvatar();
        }
    }, [userId]);

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
                <AvatarUploader
                    userId={currentUser?.id}
                    avatarUrl={avatarUrl}
                    isCurrentUser={currentUser?.id === userId}
                    onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
                />

                <div className={styles.username}>{profileData.username}</div>

                {currentUser?.id !== userId && (
                    <button
                        className={`${styles.followButton} ${isFollowing ? styles.unfollow : ""}`}
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
