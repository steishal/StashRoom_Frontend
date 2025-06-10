import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext.jsx";
import '../../../styles/ChatListPage.css';
import messageService from "../../../services/messageService.js";

const ChatListPage = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const data = await messageService.fetchAllConversations();
                setConversations(data);
            } catch (error) {
                console.error('Ошибка загрузки чатов:', error);
            } finally {
                setLoading(false);
            }
        };

        loadConversations();
    }, []);

    const handleChatClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) return <div>Загрузка чатов...</div>;

    return (
        <div className="chat-list">
            <h2>Мои чаты</h2>
            {conversations.length === 0 ? (
                <p>Нет активных чатов.</p>
            ) : (
                <ul>
                    {conversations.map((conv) => (
                        <li
                            key={conv.chatWithUserId}
                            onClick={() => handleChatClick(conv.chatWithUserId)}
                            className="chat-item"
                        >
                            <div className="chat-name">{conv.chatWithUsername}</div>

                            <div className="chat-preview">
                                <strong>{conv.lastMessageSender}:</strong> {conv.lastMessageContent?.slice(0, 30)}...
                            </div>

                            <div className="chat-time">
                                {new Date(conv.sentAt).toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatListPage;


