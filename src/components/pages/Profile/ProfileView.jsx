import React, {useEffect, useState} from 'react';
import styles from '../../../styles/Profile.module.css';
import UserPosts from "../Post/UserPosts.jsx";
import AvatarUploader from './AvatarUploader';
import { useAuth } from '../../../context/AuthContext.jsx';
import {useUserController} from "../../../controllers/UserController.js";
import {FiSettings} from "react-icons/fi";
import {Link} from "react-router-dom";
import TelegramModal from "./TelegramModal.jsx";
import UserService from "../../../services/UserService.js";

const ProfileView = ({
                         isLoading,
                         error,
                         profileData,
                         currentUser,
                         userId,
                         followers,
                         following,
                         isFollowing,
                         toggleFollow,
                     }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { user } = useAuth();
    const { fetchUserAvatar, checkHasTelegramChatId} = useUserController();
    const [showTelegramModal, setShowTelegramModal] = useState(false);
    const [telegramToken, setTelegramToken] = useState(null);
    const [telegramLinked, setTelegramLinked] = useState(false);
    const [telegramLoading, setTelegramLoading] = useState(false);

    const handleTelegramLink = async () => {
        try {
            setTelegramLoading(true);
            const token = await UserService.generateTelegramToken();
            setTelegramToken(token);
            setShowTelegramModal(true);

            const checkInterval = setInterval(async () => {
                try {
                    const userResponse = await UserService.getUserById(currentUser.id);
                    if (userResponse.telegramChatId) {
                        setTelegramLinked(true);
                        clearInterval(checkInterval);
                        alert("Telegram успешно привязан!");
                    }
                } catch (error) {
                    console.error("Ошибка проверки статуса:", error);
                }
            }, 5000);

            setTimeout(() => {
                clearInterval(checkInterval);
                if (!telegramLinked) {
                    alert("Время привязки истекло. Попробуйте снова.");
                }
            }, 300000);
        } catch (error) {
            console.error("Ошибка при генерации токена:", error);
            alert("Не удалось создать токен Telegram.");
        } finally {
            setTelegramLoading(false);
        }
    };

    useEffect(() => {
        const checkTelegramStatus = async () => {
            if (currentUser?.id === Number(userId)) {
                const linked = await checkHasTelegramChatId(userId);
                setTelegramLinked(linked);
            }
        };
        checkTelegramStatus();
    }, [userId, currentUser, checkHasTelegramChatId]);

    console.log(showTelegramModal);
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

                <div className={styles.usernameWithSettings}>
                    <span className={styles.username}>{profileData.username} </span>
                    {currentUser?.id === Number(userId) && (
                        <Link to="/settings" className={styles.settingsIcon}>
                            <FiSettings size={20} />
                        </Link>
                    )}
                </div>

                {currentUser?.id !== Number(userId) && (
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

            {currentUser?.id === Number(userId) && (
                <div className={styles.createPostSection}>
                    <Link to="/create-post" className={styles.createPostButton}>
                        + Создать пост
                    </Link>
                </div>
            )}

            {currentUser?.id === Number(userId) && !telegramLinked && (
                <p>
                    <button
                        className={styles.telegramButton}
                        onClick={handleTelegramLink}
                        disabled={telegramLoading}
                    >
                        {telegramLoading ? "Создание токена..." : "Привязать Telegram"}
                    </button>
                </p>
            )}

            {showTelegramModal && (
                <TelegramModal
                    token={telegramToken}
                    onClose={() => setShowTelegramModal(false)}
                />
            )}

            {(profileData.vkLink || profileData.tgLink) && (
                <div className={styles.socialLinksSection}>
                    <div className={styles.socialTitle}>Контакты:</div>
                    <div className={styles.socialLinks}>
                        {profileData.vkLink && (
                            <a
                                href={profileData.vkLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialIcon}
                            >
                                <img src="/icons/vk.svg" alt="VK" />
                            </a>
                        )}
                        {profileData.tgLink && (
                            <a
                                href={profileData.tgLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialIcon}
                            >
                                <img src="/icons/telegram.svg" alt="Telegram" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.postsContainer}>
                <UserPosts userId={userId} currentUserId={currentUser?.id} />
            </div>
        </div>
    );
};

export default ProfileView;
