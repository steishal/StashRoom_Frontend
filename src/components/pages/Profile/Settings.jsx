import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Settings = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (type === 'password' && formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

  };

  return (
    <div className="content">
      <h2>Настройки конфиденциальности</h2>
      <form onSubmit={(e) => handleSubmit(e, 'email')}>
        <input
          type="email"
          placeholder="Новый email"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <button type="submit">Изменить email</button>
      </form>

      <form onSubmit={(e) => handleSubmit(e, 'password')}>
        <input
          type="password"
          placeholder="Новый пароль"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />
        <button type="submit">Изменить пароль</button>
      </form>

      <button onClick={() => navigate(`/profile/${userId}`)}>
        Вернуться в профиль
      </button>
    </div>
  );
};

export default Settings;
