import { useCallback, useEffect, useRef, useState } from "react";
import { MessageService } from "../services/messageService.js";
import { Message } from "../models/Message.js";
import { webSocketService } from "../services/webSocketService.js";
import { useUserController } from "./UserController.js";

export const useMessageController = () => {
    const { currentUser } = useUserController();

    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const cache = useRef(new Map());

    const loadConversation = useCallback(async (userId) => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            setLoading(true);
            setError(null);

            const data = await MessageService.getConversation(userId, {
                signal: abortController.signal,
            });

            setMessages(data.map((m) => new Message(m)));
            setSelectedUser(userId);
        } catch (err) {
            if (
                err.name !== "CanceledError" &&
                !abortControllerRef.current?.signal.aborted
            ) {
                setError("Failed to load conversation");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        webSocketService.connect();

        const handleIncomingMessage = (data) => {
            if (data.type === "message") {
                setMessages((prev) => [new Message(data.message), ...prev]);
                updateCache(data.conversationId, data.message);
            }
            if (data.type === "typing") {
                setTypingUsers((prev) => [...new Set([...prev, data.userId])]);
                setTimeout(() => {
                    setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
                }, 3000);
            }
            if (data.type === "reaction") {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === data.messageId
                            ? { ...msg, reactions: data.reactions }
                            : msg
                    )
                );
            }
        };

        const listenerId = webSocketService.addListener(handleIncomingMessage);
        return () => webSocketService.removeListener(listenerId);
    }, []);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const updateMessage = async (messageId, newContent) => {
        try {
            const updatedMessage = await MessageService.updateMessage(messageId, {
                content: newContent,
            });
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? new Message(updatedMessage) : msg
                )
            );
        } catch (err) {
            setError("Failed to update message");
            console.error(err);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await MessageService.deleteMessage(messageId);
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        } catch (err) {
            setError("Failed to delete message");
            console.error(err);
        }
    };

    const loadMore = async () => {
        if (page >= totalPages) return;
        const nextPage = page + 1;
        const data = await MessageService.getConversation(selectedUser, nextPage);
        setMessages((prev) => [...prev, ...data.messages]);
        setPage(nextPage);
        setTotalPages(data.totalPages);
    };

    const updateCache = (conversationId, messages) => {
        const cached = cache.current.get(conversationId) || [];
        cache.current.set(conversationId, [...messages, ...cached]);
    };

    const handleSearch = async (query) => {
        const results = await MessageService.searchMessages(query, selectedUser);
        setSearchResults(results);
    };

    const sendMessage = async (content, files) => {
        if (!currentUser) {
            setError("User not authenticated");
            return;
        }

        const attachments = await Promise.all(
            files.map((file) => MessageService.uploadFile(file))
        );

        const tempId = Date.now();
        const newMessage = new Message({
            id: tempId,
            content,
            attachments,
            sender: currentUser,
            receiver: selectedUser,
            createdAt: new Date(),
        });

        setMessages((prev) => [newMessage, ...prev]);

        try {
            webSocketService.sendMessage({
                ...newMessage,
                tempId,
                senderId: currentUser.id,
            });
        } catch (err) {
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
            setError(err.message);
        }
    };

    const addReaction = async (messageId, reaction) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === messageId
                    ? { ...msg, reactions: [...msg.reactions, reaction] }
                    : msg
            )
        );

        await MessageService.addReaction(messageId, reaction);
        webSocketService.send({
            type: "reaction",
            messageId,
            reaction,
        });
    };

    return {
        searchResults,
        isTyping,
        typingUsers,
        loadMore,
        handleSearch,
        addReaction,
        messages,
        selectedUser,
        loading,
        error,
        loadConversation,
        sendMessage,
        updateMessage,
        deleteMessage,
        setError,
    };
};
