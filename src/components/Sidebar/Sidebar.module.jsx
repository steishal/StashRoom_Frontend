import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
const SidebarModule = ({ userId, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="open-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>Навигация</h2>
        <Link to={`/profile/${userId}`} className="sidebar-link">Моя страница</Link>
        <Link to="/main" className="sidebar-link">Главная</Link>
        <Link to="/myposts" className="sidebar-link">Мои посты</Link>
        <Link to="/subscriptions" className="sidebar-link">Подписки</Link>
        {role === 'admin' && <Link to="/admin" className="sidebar-link">Добавить категорию</Link>}
      </div>
    </>
  );
};

export default SidebarModule;
