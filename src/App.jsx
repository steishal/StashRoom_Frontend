import { Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './components/Layout';
import Profile from './components/pages/Profile/Profile.jsx';
import Auth from './components/pages/Auth';
import PostList from "./components/pages/Post/PostList.jsx";
import SubscriptionsFeed from "./components/pages/Post/SubscriptionsFeed.jsx";
import CreatePostPage from "./components/pages/CreatePost/CreatePostPage.jsx";
import EditPostPage from "./components/pages/CreatePost/EditPostPage.jsx";
import PostCommentsPage from "./components/pages/Comments/PostCommentsPage.jsx";
import SettingsPage from "./components/pages/Profile/Settings.jsx";
import CategoryAdmin from "./components/pages/Admin/Admin.jsx";
import SmsForm from "./components/ForgotPasswordPage.jsx";
import ChatListPage from "./components/pages/Message/ChatListPage.jsx";
import ChatPageWrapper from "./components/pages/Message/ChatPageWrapper.jsx";
import ServerError from "./components/pages/Errors/ServerError.jsx";
import NotFound from "./components/pages/Errors/NotFound.jsx";
import Layouterr from "./components/Layouterr.jsx";

const App = () => {

    return (
        <Routes>
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/register" element={<Auth type="register" />} />
            <Route path="/forgot-password" element={<SmsForm />} />

            <Route path="/" element={<Layout />}>
                <Route path="/posts/:id/edit" element={<EditPostPage />} />
                <Route path="/home" element={<PostList />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="/admin" element={<CategoryAdmin />} />
                <Route path="/subscriptions" element={<SubscriptionsFeed />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/post/:postId/comments" element={<PostCommentsPage />} />
                <Route path="/chats" element={<ChatListPage />} />
                <Route path="/chat/:userId" element={<ChatPageWrapper />} />
            </Route>
            <Route path="/" element={<Layouterr />}>
                <Route path="/404" element={<NotFound />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default App;
