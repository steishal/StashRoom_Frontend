import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../../styles/ChatPage.css';
import { useChatController } from '../../../controllers/useChatController.js';
import UserService from '../../../services/userService.js';
import { useUserController } from '../../../controllers/UserController.js';

const ChatPage = () => {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const messagesEndRef = useRef(null);
    const [partnerData, setPartnerData] = useState(null);
    const [partnerAvatar, setPartnerAvatar] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    const { fetchUserAvatar } = useUserController();

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        editMessage,
        deleteMessage
    } = useChatController(userId);

    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const data = await UserService.getUserById(userId);
                setPartnerData(data);
            } catch (error) {
                console.error(error);
                setProfileError(error.message || 'Ошибка загрузки профиля');
            } finally {
                setIsProfileLoading(false);
            }
        };

        const loadAvatar = async () => {
            if (userId) {
                const avatar = await fetchUserAvatar(userId);
                setPartnerAvatar(avatar);
            }
        };

        fetchPartner();
        loadAvatar();
    }, [userId, fetchUserAvatar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        if (editingId) {
            editMessage(editingId, inputValue);
            setEditingId(null);
        } else {
            sendMessage(inputValue);
        }

        setInputValue('');
    };

    const startEditing = (message) => {
        setEditingId(message.id);
        setInputValue(message.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setInputValue('');
    };

    if (isLoading) return <div>Загрузка беседы...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="chat-container">
            <div className="chat-header">
                {isProfileLoading && <span>Загрузка профиля...</span>}
                {profileError && <span className="error">{profileError}</span>}
                <img
                    src={partnerAvatar || '/default-avatar.png'}
                    alt="Аватар"
                    className="chat-avatar"
                />
                {partnerData && (
                    <Link to={`/profile/${partnerData.id}`} className="partner-info">

                        <span className="chat-username">{partnerData.username}</span>
                    </Link>
                )}
            </div>

            <div className="messages-list">
                {messages.map(message => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const isEditing = editingId === message.id;
                    const isSending = message.status === 'sending';
                    const isError = message.status === 'error';

                    return (
                        <div
                            key={message.id || `temp_${message.tempId}`}
                            className={`message ${isEditing ? 'editing' : ''} ${
                                isCurrentUser ? 'own' : 'incoming'
                            } ${isSending ? 'sending' : ''} ${isError ? 'error' : ''}`}
                        >
                            <div className="message-header">
                                <div className="sender">{message.senderUsername}</div>
                                {!isEditing && isCurrentUser && !message.isDeleted && (
                                    <div className="message-actions">
                                        <button onClick={() => startEditing(message)}>✏️</button>
                                        <button
                                            onClick={() => deleteMessage(message.id)}
                                            disabled={message.isDeleting}
                                        >
                                            {message.isDeleting ? '...' : '🗑️'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="message-content">
                                {message.isDeleted ? (
                                    <i>Сообщение удалено</i>
                                ) : (
                                    message.content
                                )}

                                {isSending && (
                                    <span className="message-status">Отправка...</span>
                                )}
                                {isError && (
                                    <span className="message-status error">Ошибка!</span>
                                )}
                            </div>

                            <div className="message-footer">
                                <div className="time">
                                    {message.sentAt && new Date(message.sentAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="message-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={editingId ? "Редактирование..." : "Введите сообщение..."}
                    disabled={isLoading}
                />

                <div className="form-buttons">
                    {editingId && (
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="cancel-btn"
                        >
                            Отмена
                        </button>
                    )}

                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!inputValue.trim() || isLoading}
                    >
                        {editingId ? 'Сохранить' : 'Отправить'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPage;

