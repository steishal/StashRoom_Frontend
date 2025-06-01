import { Link } from 'react-router-dom';

const SidebarChats = () => {
    // Заглушка чатов
    const mockChats = [
        { id: 1, name: 'Аня' },
        { id: 2, name: 'Пётр' },
        { id: 3, name: 'Катя' },
    ];

    return (
        <div className="sidebar-chats">
            <h3>Диалоги</h3>
            <ul>
                {mockChats.map(chat => (
                    <li key={chat.id}>
                        <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarChats;
