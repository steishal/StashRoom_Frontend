import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext.jsx";
import { webSocketService } from "../../../services/webSocketService.js";
import SidebarChats from './SidebarChats.jsx';
import ChatPage from './ChatPage.jsx';
import '../../../styles/ChatLayoutWrapper.css';

const ChatLayoutWrapper = () => {
    const { receiverId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        webSocketService.connect();
        return () => {
            webSocketService.disconnect();
        };
    }, []);

    if (!user) return null;
    return (
        <div className="chat-layout">
            <SidebarChats />
            <div className="chat-main">
                {receiverId ? (
                    <ChatPage receiverId={parseInt(receiverId)} currentUserId={user.id} />
                ) : (
                    <div className="no-chat-selected">Выберите чат</div>
                )}
            </div>
        </div>
    );
};

export default ChatLayoutWrapper;
