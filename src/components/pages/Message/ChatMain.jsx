import React, { useEffect } from 'react';
import '../../../styles/ChatLayout.css';
import { useParams } from 'react-router-dom';
import SidebarChats from './SidebarChats.jsx';
import '../../../styles/ChatLayoutWrapper.css';
import {webSocketService} from "../../../services/webSocketService.js";

const ChatLayoutWrapper = () => {
    const { receiverId } = useParams();

    useEffect(() => {
        webSocketService.connect();

        return () => {
            webSocketService.listeners.clear();
        };
    }, [receiverId]);

    return (
        <div className="chat-layout">
            <SidebarChats />
            {receiverId ? (
                <ChatMain receiverId={parseInt(receiverId)} />
            ) : (
                <div className="no-chat-selected">Выберите чат</div>
            )}
        </div>
    );
};

export default ChatLayoutWrapper;

