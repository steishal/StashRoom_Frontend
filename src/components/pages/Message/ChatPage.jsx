import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInputContainer from './MessageInputContainer';
import '../../../styles/ChatPage.css';
import {webSocketService} from "../../../services/webSocketService.js";

const ChatPage = ({ receiverId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const messageListRef = useRef();

    const handleSend = (text, files) => {
        if (!text && files.length === 0) return;

        const newMessage = {
            receiverId,
            content: text,
            attachments: [],
        };

        webSocketService.sendMessage(newMessage);
    };

    useEffect(() => {
        const listenerId = webSocketService.addListener((incomingMessage) => {
            if (parseInt(incomingMessage.sender.id) === receiverId || parseInt(incomingMessage.receiverId) === receiverId) {
                setMessages(prev => [...prev, incomingMessage]);
            }
        });

        return () => {
            webSocketService.removeListener(listenerId);
        };
    }, [receiverId]);


    return (
        <div className="chat-container">
            <MessageList
                messages={messages}
                currentUserId={currentUserId}
                ref={messageListRef}
            />
            <MessageInputContainer onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
