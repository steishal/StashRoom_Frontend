import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/userService.js';
import { User } from '../models/User.js';

export const useUserController = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            const data = await UserService.getCurrentUser();
            setCurrentUser(User.fromJSON(data));
        } catch (err) {
            setError(err.message || 'Failed to fetch user');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserById = useCallback(async (userId) => {
        try {
            setProfileLoading(true);
            const data = await UserService.getUserById(userId);
            setProfileUser(User.fromJSON(data));
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch profile');
            throw err;
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (userData) => {
        if (!currentUser?.id) {
            throw new Error('User not loaded');
        }

        try {
            setLoading(true);
            setError(null);
            const data = await UserService.updateUser(currentUser.id, userData);
            setCurrentUser(User.fromJSON(data));
            return data;
        } catch (err) {
            setError(err.message || 'Failed to update user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentUser?.id]);

    useEffect(() => {
        const abortController = new AbortController();

        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await UserService.getCurrentUser({ signal: abortController.signal });
                setCurrentUser(User.fromJSON(data));
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setError(err.message || 'Failed to load user');
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadUser();
        return () => abortController.abort();
    }, []);

    return {
        currentUser,
        profileUser,
        loading,
        profileLoading,
        error,
        updateUser,
        refreshUser: fetchCurrentUser,
        getUserById
    };
};