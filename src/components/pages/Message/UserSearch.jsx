import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { UserService } from '../../../services/UserService';

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
            try {
                const data = await UserService.searchUsers(query);
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

    const handleSelect = (user) => {
        navigate(`/chat/${user.id}`);
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
