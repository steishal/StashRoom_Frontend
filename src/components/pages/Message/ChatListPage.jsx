import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/ChatListPage.css';

const mockChats = [
    { id: 1, name: 'Аня', lastMessage: 'Привет! Как дела?', unread: 2 },
    { id: 2, name: 'Пётр', lastMessage: 'До встречи!', unread: 0 },
    { id: 3, name: 'Катя', lastMessage: 'Жду от тебя файл...', unread: 1 },
];

const ChatListPage = () => {
    return (
        <div className="chat-list-page">
            <h2>Ваши чаты</h2>
            <ul className="chat-list">
                {mockChats.map(chat => (
                    <li key={chat.id} className="chat-item">
                        <Link to={`/chat/${chat.id}`}>
                            <div className="chat-name">{chat.name}</div>
                            <div className="chat-preview">
                                <span>{chat.lastMessage}</span>
                                {chat.unread > 0 && (
                                    <span className="unread-badge">{chat.unread}</span>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatListPage;
