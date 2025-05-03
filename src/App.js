import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/ProfileModule';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import CreatePost from './pages/CreatePost';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Auth type="login" />} />
                    <Route path="/register" element={<Auth type="register" />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    {/* Другие маршруты */}
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
