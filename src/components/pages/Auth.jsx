
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: type === 'register' ? '' : undefined,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === 'login' ? '/login' : '/register';

    const response = await fetch(`/api/auth${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>{type === 'login' ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <input
            placeholder="Имя пользователя"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Пароль"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit">
          {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      {type === 'login' && (
        <div className="reg_button_div">
          <Link to="/register" className="reg_button">Создать аккаунт</Link>
        </div>
      )}
    </div>
  );
};

export default Auth;
