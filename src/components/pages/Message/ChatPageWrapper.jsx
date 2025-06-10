import { useParams } from 'react-router-dom';
import ChatPage from './ChatPage';

const ChatPageWrapper = () => {
    const { userId } = useParams();
    return <ChatPage userId={parseInt(userId, 10)} />;
};

export default ChatPageWrapper;
