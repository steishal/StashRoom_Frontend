import React from 'react';
import SidebarModule from './Sidebar/Sidebar.module.jsx';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app">
      <SidebarModule userId={user?.id} role={user?.role} />
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
