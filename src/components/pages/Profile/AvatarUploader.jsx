import React, { useRef, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/Profile.module.css';
import { useAuth } from '../../../context/AuthContext.jsx';

const AvatarUploader = ({ userId, avatarUrl, onAvatarChange }) => {
    const fileInputRef = useRef(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState(avatarUrl);

    const { user } = useAuth();
    const token = localStorage.getItem("authToken");

    const isCurrentUser = user?.id === userId;

    const handleAvatarClick = () => {
        if (isCurrentUser && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !token) return;

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("avatar", file);

        try {
            const response = await axios.post("/api/users/avatar", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const newAvatarUrl = response.data.avatar;
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
