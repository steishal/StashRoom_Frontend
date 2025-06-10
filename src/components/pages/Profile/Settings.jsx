import React, { useState, useEffect } from 'react';
import { useUserController } from '../../../controllers/UserController.js';
import styles from '../../../styles/Settings.module.css';
import {useNavigate} from "react-router-dom";

const SettingsPage = () => {
    const { currentUser, updateUser } = useUserController();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        vkLink: '',
        tgLink: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                username: currentUser.username || '',
                email: currentUser.email || '',
                phoneNumber: currentUser.phoneNumber || '',
                vkLink: currentUser.vkLink || '',
                tgLink: currentUser.tgLink || '',
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { ...formData };
            if (!updatedData.password) delete updatedData.password;
            await updateUser(updatedData);
            setMessage('Настройки успешно обновлены');
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (err) {
            setMessage('Ошибка при обновлении настроек');
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <h2>Настройки профиля</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    Имя пользователя:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label>
                    Телефон:
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </label>
                <label>
                    VK ссылка:
                    <input type="text" name="vkLink" value={formData.vkLink} onChange={handleChange} />
                </label>
                <label>
                    Telegram ссылка:
                    <input type="text" name="tgLink" value={formData.tgLink} onChange={handleChange} />
                </label>
                <label>
                    Новый пароль:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </label>
                <button type="submit">Сохранить изменения</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default SettingsPage;
