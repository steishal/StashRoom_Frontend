import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const socketUrl = "http://localhost:8080/ws";

let stompClient = null;
let subscription = null;
const listeners = new Map();
let listenerId = 0;

const waitUntilConnected = () => {
    return new Promise((resolve, reject) => {
        const maxAttempts = 50;
        let attempts = 0;
        const check = () => {
            if (stompClient && stompClient.connected) {
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error("WebSocket не подключен после ожидания"));
            } else {
                attempts++;
                setTimeout(check, 100);
            }
        };
        check();
    });
};

const connect = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.warn("No auth token found — WebSocket not connected");
        return;
    }

    if (stompClient && stompClient.connected) {
        console.log("WebSocket уже подключён");
        return;
    }

    if (stompClient) {
        try {
            stompClient.deactivate();
        } catch (e) {
            console.error("Ошибка при деактивации клиента:", e);
        }
        stompClient = null;
        subscription = null;
    }

    stompClient = new Client({
        webSocketFactory: () =>
            new SockJS(`${socketUrl}?token=${encodeURIComponent(token)}`),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("WebSocket (SockJS) connected");

            if (!subscription) {
                subscription = stompClient.subscribe("/user/queue/messages",
                    (message) => {
                    const data = JSON.parse(message.body);
                    listeners.forEach((callback) => {
                        try {
                            callback(data);
                        } catch (err) {
                            console.error("Ошибка в обработчике WebSocket сообщения:", err);
                        }
                    });
                });
            }
        },
        onStompError: (frame) => {
            console.error("STOMP error:", frame.headers["message"]);
        },
        onWebSocketClose: () => {
            subscription = null;
            console.warn("⚠ WebSocket closed");
        },
    });
    stompClient.activate();
};

const disconnect = () => {
    if (stompClient) {
        if (subscription) {
            try {
                subscription.unsubscribe();
            } catch (e) {
                console.error("Error unsubscribing:", e);
            }
            subscription = null;
        }
        try {
            stompClient.deactivate();
            console.log("WebSocket disconnected");
        } catch (e) {
            console.error("Ошибка при деактивации клиента:", e);
        }
        stompClient = null;
    }
};

const sendMessage = async (message) => {
    const token = localStorage.getItem("authToken");
    try {
        await waitUntilConnected();
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(message),
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json" },
        });

    } catch (err) {
        console.warn("WebSocket is not connected. Сообщение не отправлено:", err);
    }
};

const send = async (data) => {
    try {
        await waitUntilConnected();
        stompClient.publish({
            destination: "/app/extra",
            body: JSON.stringify(data),
        });
    } catch (err) {
        console.warn("WebSocket is not connected. Данные не отправлены:", err);
    }
};

const addListener = (callback) => {
    const id = ++listenerId;
    listeners.set(id, callback);
    return id;
};

const removeListener = (id) => {
    listeners.delete(id);
};

export const webSocketService = {
    connect,
    disconnect,
    sendMessage,
    send,
    addListener,
    removeListener,
};
