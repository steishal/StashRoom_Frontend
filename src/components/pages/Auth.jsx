import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth.css';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/AuthService';

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

        try {
            if (type === 'login') {
                const { user, token } = await AuthService.login(formData);
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                navigate('/home');
            } else {
                await AuthService.register(formData);
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Произошла ошибка при входе');
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
                    <p><Link to="/register" className="reg_button">Создать аккаунт</Link></p>
                    <p><Link to="/forgot-password" className="reg_button">Забыли пароль?</Link></p>
                </div>
            )}
        </div>
    );
};

export default Auth;
