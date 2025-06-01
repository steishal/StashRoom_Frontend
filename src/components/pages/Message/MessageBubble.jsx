import React from 'react';
import '../../../styles/MessageBubble.module.css';

const MessageBubble = ({ message, isOwn }) => (
    <div className={`bubble ${isOwn ? 'own' : 'other'}`}>
        <div className="bubble-meta">
            <img src={message.sender.avatarUrl || '/avatar.png'} className="bubble-avatar" alt="avatar" />
            <span className="bubble-time">{new Date(message.createdAt).toLocaleTimeString()}</span>
        </div>
        <div className="bubble-content">{message.content}</div>

        {message.attachments?.length > 0 && (
            <div className="bubble-attachments">
                {message.attachments.map((file, i) => (
                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer">
                        📎 {file.name}
                    </a>
                ))}
            </div>
        )}

        <div className="bubble-status">{isOwn ? '✔✔' : ''}</div>
    </div>
);

export default MessageBubble;

