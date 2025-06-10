import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService.js';
import '../styles/ForgotPasswordPage.css';

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
            await AuthService.sendResetToken({ email, phone });
            setMessage('Если данные верны, токен отправлен в Telegram');
        } catch (err) {
            console.error(err);
            setMessage('Ошибка при отправке токена');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('Сброс пароля...');

        try {
            await AuthService.resetPassword(token, newPassword);
            setMessage('Пароль успешно изменён!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setMessage(`Ошибка: ${err.message}`);
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
