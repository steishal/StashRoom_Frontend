import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth.css';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';

const Auth = ({ type }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: type === 'register' ? '' : undefined,
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

        const endpoint = type === 'login'
            ? '/users/auth/login'
            : '/users/register';

        try {
            const response = await apiClient.post(endpoint, formData);

            if (type === 'login') {
                const authHeader = response.headers['authorization'];
                const token = authHeader.split(' ')[1];

                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);

                navigate('/home');
            } else {
                navigate('/login');
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                'Произошла ошибка при входе';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="auth-container">
            <h2>{type === 'login' ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleSubmit}>
                {type === 'register' && (
                    <input
                        placeholder="Имя пользователя"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? (type === 'login' ? 'Входим...' : 'Регистрируем...')
                        : (type === 'login' ? 'Войти' : 'Зарегистрироваться')}
                </button>
            </form>

            {error && <div className="auth-error">{error}</div>}

            {type === 'login' && (
                <div className="reg_button_div">
                    <Link to="/register" className="reg_button">Создать аккаунт</Link>
                </div>
            )}
        </div>
    );
};

export default Auth;
