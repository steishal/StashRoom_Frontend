import { Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import Profile from './components/pages/Profile/Profile.jsx';
import Auth from './components/pages/Auth';
import ChatLayoutWrapper from './components/pages/Message/ChatLayoutWrapper.jsx';
import PostList from "./components/pages/Post/PostList.jsx";
import SubscriptionsFeed from "./components/pages/Post/SubscriptionsFeed.jsx";
import CreatePostPage from "./components/pages/CreatePost/CreatePostPage.jsx";
import SidebarChats from "./components/pages/Message/SidebarChats.jsx";
import EditPostPage from "./components/pages/CreatePost/EditPostPage.jsx";
import PostCommentsPage from "./components/pages/Comments/PostCommentsPage.jsx";
import {webSocketService} from "./services/webSocketService.js";
import {useEffect} from "react";
import ChatPageWrapper from "./components/pages/Message/ChatPageWrapper.jsx";
import SettingsPage from "./components/pages/Profile/Settings.jsx";
import CategoryAdmin from "./components/pages/Admin/Admin.jsx";
import SmsForm from "./components/ForgotPasswordPage.jsx";

const App = () => {
    useEffect(() => {
        webSocketService.connect();
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/register" element={<Auth type="register" />} />
            <Route path="/forgot-password" element={<SmsForm />} />
            <Route path="/" element={<Layout />}>
                <Route path="/posts/:id/edit" element={<EditPostPage />} />
                <Route path="/home" element={<PostList />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="chat" element={<SidebarChats />} />
                <Route path="/admin" element={<CategoryAdmin />} />
                <Route path="/subscriptions" element={<SubscriptionsFeed />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/post/:postId/comments" element={<PostCommentsPage />} />
                <Route path="/chat" element={<ChatLayoutWrapper />}>
                    <Route index element={<div>Выберите чат</div>} />
                    <Route path=":receiverId" element={<ChatPageWrapper />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
