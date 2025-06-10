import { useState, useEffect, useCallback } from 'react';
import {
    connectWebSocket,
    sendMessage as wsSendMessage,
    updateMessage as wsUpdateMessage,
    deleteMessage as wsDeleteMessage,
    disconnectWebSocket
} from '../services/websocketService';
import { fetchConversation } from '../services/messageService';

export const useChatController = (selectedUserId) => {
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Обработчик входящих сообщений
    const handleIncomingMessage = useCallback((payload) => {
        console.log("📩 Incoming payload:", payload);

        setMessages(prev => {
            // Для новых сообщений
            if (payload.type === 'NEW') {
                // Ищем временное сообщение по tempId
                const tempIndex = prev.findIndex(m =>
                    m.tempId && m.tempId === payload.tempId
                );

                if (tempIndex !== -1) {
                    // Заменяем временное сообщение на финальное
                    const updated = [...prev];
                    updated[tempIndex] = {
                        ...payload,
                        status: 'sent'
                    };
                    return updated;
                }

                // Добавляем новое сообщение от собеседника
                return [...prev, { ...payload, status: 'sent' }];
            }

            // Для обновленных сообщений
            if (payload.type === 'UPDATED') {
                return prev.map(m =>
                    m.id === payload.id ? { ...m, ...payload } : m
                );
            }

            // Для удаленных сообщений
            if (payload.type === 'DELETED') {
                return prev.map(m =>
                    m.id === payload.messageId
                        ? { ...m, content: 'Сообщение удалено', isDeleted: true }
                        : m
                );
            }

            return prev;
        });
    }, []);

    // Инициализация чата
    useEffect(() => {
        const initChat = async () => {
            try {
                setIsLoading(true);
                const userString = localStorage.getItem('user');
                if (!userString) throw new Error('User not found');

                const user = JSON.parse(userString);
                setCurrentUser({
                    id: user.id,
                    username: user.username
                });

                // Загрузка истории сообщений
                if (selectedUserId) {
                    const conversation = await fetchConversation(selectedUserId);
                    setMessages(conversation);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [selectedUserId]);

    // Управление WebSocket соединением
    useEffect(() => {
        if (!currentUser?.id || !selectedUserId) return;

        const client = connectWebSocket(currentUser.id, handleIncomingMessage);

        return () => {
            disconnectWebSocket();
        };
    }, [currentUser, selectedUserId, handleIncomingMessage]);

    // Отправка сообщения
    const sendMessage = useCallback((content) => {
        if (!content.trim()) return;

        const tempId = Date.now();
        const newMessage = {
            content,
            receiverId: selectedUserId,
            tempId,
            senderId: currentUser.id,
            senderUsername: currentUser.username,
            sentAt: new Date().toISOString(),
            status: 'sending'
        };

        setMessages(prev => [...prev, newMessage]);

        // Отправка через WebSocket
        const success = wsSendMessage(newMessage);

        if (!success) {
            // Обновляем статус при ошибке
            setMessages(prev => prev.map(m =>
                m.tempId === tempId
                    ? { ...m, status: 'error' }
                    : m
            ));
        }
    }, [currentUser, selectedUserId]);

    // Редактирование сообщения
    const editMessage = useCallback((messageId, newContent) => {
        setMessages(prev => prev.map(m =>
            m.id === messageId
                ? { ...m, content: newContent, isUpdating: true }
                : m
        ));

        wsUpdateMessage({
            id: messageId,
            content: newContent,
            receiverId: selectedUserId
        });
    }, [selectedUserId]);

    // Удаление сообщения
    const deleteMessage = useCallback((messageId) => {
        setMessages(prev => prev.map(m =>
            m.id === messageId
                ? { ...m, isDeleting: true }
                : m
        ));

        wsDeleteMessage({
            id: messageId,
            receiverId: selectedUserId
        });
    }, [selectedUserId]);

    return {
        messages,
        currentUser,
        isLoading,
        error,
        sendMessage,
        editMessage,
        deleteMessage
    };
};