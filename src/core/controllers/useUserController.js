// core/controllers/useUserController.js
import { useState, useEffect } from 'react';
import { UserService } from '../../api/services/userService';
import { User } from '../models/User';

export const useUserController = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCurrentUser = async () => {
        try {
            const data = await UserService.getCurrentUser();
            setCurrentUser(User.fromJSON(data));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userData) => {
        try {
            const data = await UserService.updateUser(currentUser.id, userData);
            setCurrentUser(User.fromJSON(data));
        } catch (err) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return {
        currentUser,
        loading,
        error,
        updateUser,
        refreshUser: fetchCurrentUser
    };
};