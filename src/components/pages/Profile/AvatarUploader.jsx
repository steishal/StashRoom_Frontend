import React, { useRef, useState } from 'react';
import styles from '../../../styles/Profile.module.css';
import { useAuth } from '../../../context/AuthContext.jsx';
import {UserService} from "../../../services/userService.js";

const AvatarUploader = ({ userId, avatarUrl, onAvatarChange }) => {
    const fileInputRef = useRef(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState(avatarUrl);

    const { user } = useAuth();
    const isCurrentUser = user?.id === userId;

    const handleAvatarClick = () => {
        if (isCurrentUser && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const newAvatarUrl = await UserService.uploadAvatar(userId, file);
            setLocalAvatarUrl(newAvatarUrl);
            if (onAvatarChange) {
                onAvatarChange(newAvatarUrl);
            }
        } catch (err) {
            console.error("Ошибка при загрузке аватара:", err);
        }
    };

    return (
        <>
            <img
                src={localAvatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className={styles.avatar}
                onClick={handleAvatarClick}
                style={{ cursor: isCurrentUser ? 'pointer' : 'default' }}
            />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
        </>
    );
};

export default AvatarUploader;
