import { useParams } from 'react-router-dom';
import ChatMain from "./ChatMain.jsx";

const ChatLayoutWrapper = () => {
    const { receiverId } = useParams();
    return <ChatMain receiverId={parseInt(receiverId)} />;
};

export default ChatLayoutWrapper;
