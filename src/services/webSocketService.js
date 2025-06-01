import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const socketUrl = "http://localhost:8080/ws";
let stompClient = null;

const listeners = new Map();
let listenerId = 0;

const connect = () => {
    const token = localStorage.getItem("authToken")?.replace("Bearer ", "");

    const socket = new SockJS(socketUrl);

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        onConnect: () => {
            console.log("✅ WebSocket connected");

            stompClient.subscribe("/user/queue/messages", (message) => {
                const data = JSON.parse(message.body);
                listeners.forEach((callback) => callback(data));
            });
        },
        onStompError: (frame) => {
            console.error("❌ STOMP error:", frame.headers["message"]);
        },
    });

    stompClient.activate();
};

const sendMessage = (message) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(message),
        });
    } else {
        console.warn("WebSocket is not connected.");
    }
};

const send = (data) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/extra",
            body: JSON.stringify(data),
        });
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
    sendMessage,
    send,
    addListener,
    removeListener,
    listeners,
};

