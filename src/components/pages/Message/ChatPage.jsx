import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import  '../../../styles/ChatPage.css';
import {useChatController} from "../../../controllers/useChatController.js";

const ChatPage = () => {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const messagesEndRef = useRef(null);

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
                {currentUser && (
                    <Link to={`/profile/${userId}`} className="partner-info">
                        <img
                            src={currentUser.avatarUrl || '/default-avatar.png'}
                            alt="Аватар"
                            className="chat-avatar"
                        />
                        <span className="chat-username">{currentUser.username}</span>
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
