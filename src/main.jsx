import { StrictMode } from 'react'
import './styles/global.css'
import App from './App.jsx'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
const loadUserState = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
    }
};

root.render(
    <StrictMode>
        <AuthProvider value={{ user: loadUserState() }}>
        <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
