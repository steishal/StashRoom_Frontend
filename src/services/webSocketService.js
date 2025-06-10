import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscriptions = new Map();
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectWebSocket = (userId, messageHandler) => {
    if (stompClient && stompClient.connected) {
        return stompClient;
    }

    const token = localStorage.getItem('authToken');
    console.log('[WS] Connecting with token:', token);

    const client = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${token}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            console.log("✅ [WS] Connected!");
            reconnectAttempts = 0;

            const subscription = client.subscribe(
                `/user/queue/messages`,
                (message) => {
                    console.log("Raw message:", message);
                    try {
                        const payload = JSON.parse(message.body);
                        console.log("📨 [WS] Received:", payload);
                        messageHandler(payload);
                    } catch (error) {
                        console.error('[WS] Message parsing error:', error);
                    }
                }
            );

            subscriptions.set(userId, subscription);
            console.log(`🔗 [WS] Subscribed for user ${userId}`);
        },

        onStompError: (frame) => {
            console.error('[WS] STOMP error:', frame.headers.message);
        },

        onDisconnect: () => {
            console.log('[WS] Disconnected');
        },

        onWebSocketClose: (closeEvent) => {
            console.log('[WS] Connection closed:', closeEvent);
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`[WS] Reconnecting (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                setTimeout(() => client.activate(), 5000);
            } else {
                console.error('[WS] Max reconnect attempts reached');
            }
        }
    });

    client.activate();
    stompClient = client;
    return client;
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        subscriptions.forEach(sub => sub.unsubscribe());
        subscriptions.clear();
        stompClient.deactivate();
        stompClient = null;
        console.log('[WS] Disconnected and cleaned up');
    }
};

export const sendMessage = (message) => {
    if (!stompClient?.connected) {
        console.error('[WS] Cannot send - not connected');
        return false;
    }

    try {
        stompClient.publish({
            destination: "/app/chat/send",
            body: JSON.stringify({
                content: message.content,
                receiverId: message.receiverId,
                tempId: message.tempId
            })
        });
        console.log('[WS] Message sent:', message);
        return true;
    } catch (error) {
        console.error('[WS] Send error:', error);
        return false;
    }
};

export const updateMessage = (message) => {
    if (!stompClient?.connected) return false;

    stompClient.publish({
        destination: '/app/chat/update',
        body: JSON.stringify({
            id: message.id,
            content: message.content,
            receiverId: message.receiverId
        })
    });
    return true;
};

export const deleteMessage = (message) => {
    if (!stompClient?.connected) return false;

    stompClient.publish({
        destination: '/app/chat/delete',
        body: JSON.stringify({
            messageId: message.id,
            receiverId: message.receiverId
        })
    });
    return true;
};



