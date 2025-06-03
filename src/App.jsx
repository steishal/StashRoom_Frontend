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

const App = () => {

    return (
        <Routes>
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/register" element={<Auth type="register" />} />

            <Route path="/" element={<Layout />}>
                <Route path="/posts/:id/edit" element={<EditPostPage />} />
                <Route path="/home" element={<PostList />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="chat/:receiverId" element={<ChatLayoutWrapper />} />
                <Route path="chat" element={<SidebarChats />} />
                <Route path="/subscriptions" element={<SubscriptionsFeed />} />
                <Route path="/create-post" element={<CreatePostPage />} />
            </Route>
        </Routes>
    );
};

export default App;
