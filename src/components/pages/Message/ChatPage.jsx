import React, { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInputContainer from './MessageInputContainer';
import '../../../styles/ChatPage.css';
import {webSocketService} from "../../../services/webSocketService.js";
import {MessageService} from "../../../services/messageService.js";
import {UserService} from "../../../services/userService.js";

const ChatPage = ({ receiverId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const messageListRef = useRef();
    console.log(receiverId);
    const [receiverInfo, setReceiverInfo] = useState(null);

    const handleSend = async (text, files, receiverId) => {
        if (!text.trim() && files.length === 0) return;
        let attachmentsData = [];
        if (files.length > 0) {
            try {
                attachmentsData = await Promise.all(
                    files.map(file => MessageService.uploadFile(file))
                );
            } catch (err) {
                alert("Ошибка загрузки файлов");
                return;
            }
        }
        const attachments = attachmentsData.map(res => res.data);
        const newMessage = {
            receiverId,
            content: text.trim(),
        };
        try {
            await webSocketService.sendMessage(newMessage);
            setMessages(prev => [...prev, newMessage]);
            messageListRef.current?.scrollToItem(messages.length);
            alert("Сообщение отправлено");
        } catch (error) {
            alert("Ошибка при отправке: " + error.message);
        }
    };

    useEffect(() => {

        const loadReceiverInfo = async () => {
            try {
                const user = await UserService.getUserById(receiverId);
                setReceiverInfo(user);
            } catch (error) {
                console.error("Ошибка при загрузке пользователя", error);
            }
        };

        loadReceiverInfo();

        const loadHistory = async () => {
            const { messages: history } = await MessageService.getConversation(receiverId, 1, 20);
            setMessages(history);
            messageListRef.current?.scrollToItem(history.length - 1);
        };
        loadHistory();

        const listenerId = webSocketService.addListener((data) => {
            if (data.type === "message") {
                const incomingMessage = data.message;
                if (
                    incomingMessage.sender.id === receiverId ||
                    incomingMessage.receiverId === receiverId
                ) {
                    setMessages(prev => {
                        const updated = [...prev, incomingMessage];
                        setTimeout(() => {
                            messageListRef.current?.scrollToItem(updated.length - 1);
                        }, 0);
                        return updated;
                    });
                }
            }
        });

        return () => {
            webSocketService.removeListener(listenerId);
        };
    }, [receiverId]);

    return (
        <div className="chat-container">
            {receiverInfo && (
                <div className="chat-header">
                    <img
                        src={receiverInfo.avatar || "/default-avatar.png"}
                        alt="avatar"
                        className="chat-avatar"
                    />
                    <span className="chat-username">{receiverInfo.username}</span>
                </div>
            )}
            <MessageList
                messages={messages}
                currentUserId={currentUserId}
                ref={messageListRef}
            />
            <MessageInputContainer onSend={handleSend} receiverId={receiverId} />
        </div>
    );
};

export default ChatPage;
