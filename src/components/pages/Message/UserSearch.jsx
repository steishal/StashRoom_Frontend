import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            setError(null);
            return;
        }

        const timerId = setTimeout(async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                setSuggestions(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Ошибка поиска пользователей');
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timerId);
    }, [query]);

    const handleSelect = async (selectedUser) => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`/api/chats/user/${selectedUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const chat = await res.json();
            navigate(`/chats/${chat.id}`);
        } catch (err) {
            console.error(err);
            setError('Ошибка открытия чата');
        }

        setQuery('');
        setSuggestions([]);
    };

    return (
        <div className="user-search-container" ref={inputRef}>
            <input
                className="user-search-input"
                type="text"
                placeholder="Поиск пользователя..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            {loading && <div className="loader">Загрузка...</div>}
            {error && <div className="error">{error}</div>}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map(user => (
                        <li key={user.id}
                            className="suggestion-item"
                            onClick={() => handleSelect(user)}>
                            <div><strong>{user.username}</strong> ({user.email})</div>
                            <div className="user-id">ID: {user.id}</div>
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && query && !loading && !error && (
                <div className="no-results">Пользователи не найдены</div>
            )}
        </div>
    );
};

export default UserSearch;
