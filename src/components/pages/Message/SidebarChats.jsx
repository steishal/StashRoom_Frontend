import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { webSocketService } from '../../../services/webSocketService.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import '../../../styles/ChatListPage.css';

const SidebarChats = () => {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
    const { receiverId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const loadChats = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch('/api/chats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`Ошибка при загрузке чатов: ${res.status}`);
                }

                const data = await res.json();
                setChats(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        loadChats();

        webSocketService.connect();
        const listenerId = webSocketService.addListener((message) => {
            if (!message.senderId) return;

            setChats(prevChats =>
                prevChats.map(chat =>
                    String(chat.id) === String(message.senderId) &&
                    String(chat.id) !== receiverId
                        ? { ...chat, hasNew: true }
                        : chat
                )
            );
        });

        return () => {
            webSocketService.removeListener(listenerId);
        };
    }, [receiverId, user]);

    const handleChatClick = (chatId) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, hasNew: false } : chat
            )
        );
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="sidebar-chats">
            <div className="chat-sidebar-header">Чаты</div>

            {error && <div className="error">Ошибка: {error}</div>}

            {chats.map(chat => (
                <NavLink
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className={({ isActive }) => `chat-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleChatClick(chat.id)}
                >
                    <div className="chat-item">
                        <img
                            src={chat.avatarUrl || '/avatar.png'}
                            alt="Avatar"
                            className="chat-avatar"
                        />
                        <div className="chat-details">
                            <div className="chat-name">{chat.name}</div>
                            <div className="chat-last-message">{chat.lastMessage}</div>
                        </div>
                        <div className="chat-meta">
                            <span className="chat-time">{formatTime(chat.lastMessageTime)}</span>
                            {chat.hasNew && (
                                <span className="unread-badge">
                                    {chat.unreadCount || 1}
                                </span>
                            )}
                        </div>
                    </div>
                </NavLink>
            ))}
        </div>
    );
};

export default SidebarChats;

