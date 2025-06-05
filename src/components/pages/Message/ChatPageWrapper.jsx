import { useParams } from "react-router-dom";
import ChatPage from "./ChatPage.jsx";

export default function ChatPageWrapper() {
  const { receiverId } = useParams();
  return <ChatPage receiverId={parseInt(receiverId)} />;
}
