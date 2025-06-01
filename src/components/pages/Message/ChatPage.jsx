import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInputContainer from './MessageInputContainer';
import '../../../styles/ChatPage.css';

const ChatPage = ({ receiverId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const messageListRef = useRef();

    const handleSend = (text, files) => {
        const newMessage = {
            id: Date.now(),
            sender: { id: currentUserId },
            content: text,
            timestamp: new Date(),
            files: files,
        };
        setMessages(prev => [...prev, newMessage]);

        // TODO: отправить на сервер (через WebSocket или fetch)
    };

    const handleReact = (messageId, reaction) => {
        // TODO: реализовать реакцию на сообщение
    };

    useEffect(() => {
        // TODO: загрузка сообщений с сервера по receiverId
    }, [receiverId]);

    return (
        <div className="chat-container">
            <MessageList
                messages={messages}
                currentUserId={currentUserId}
                onReact={handleReact}
                ref={messageListRef}
            />
            <MessageInputContainer onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
