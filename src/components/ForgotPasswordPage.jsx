import { useState } from 'react';
import '../styles/ForgotPasswordPage.css';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendToken = async (e) => {
        e.preventDefault();
        setMessage('Отправка токена...');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone }),
            });

            if (response.ok) {
                setMessage('Если данные верны, токен отправлен в Telegram');
            } else {
                setMessage('Ошибка при отправке токена');
            }
        } catch (err) {
            setMessage('Сетевая ошибка при отправке токена');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('Сброс пароля...');

        try {
            const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: newPassword,
            });

            if (response.ok) {
                setMessage('Пароль успешно изменён!');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                const text = await response.text();
                setMessage(`Ошибка: ${text}`);
            }
        } catch (err) {
            setMessage('Сетевая ошибка при сбросе пароля');
        }
    };

    return (
        <div className="forgot-container">
            <div className="form-card">
                <h2 className="title">Сброс пароля</h2>

                <form onSubmit={handleSendToken} className="form-section">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn blue">Отправить токен</button>
                </form>

                <div className="divider" />

                <form onSubmit={handleResetPassword} className="form-section">
                    <div className="form-group">
                        <label>Токен</label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Новый пароль</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn green">Сбросить пароль</button>
                </form>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;



