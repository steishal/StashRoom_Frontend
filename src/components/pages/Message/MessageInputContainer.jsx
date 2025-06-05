import React, { useRef, useState } from 'react';
import '../../../styles/MessageInputView.css';

const MessageInputContainer = ({ onSend, receiverId }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const typingTimeout = useRef();

    const handleTyping = () => {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {}, 3000);
    };

    const handleFileUpload = async (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleSend = () => {
        if (!input.trim() && files.length === 0) return;
        console.log(receiverId);

        onSend(input, files, receiverId);
        setInput('');
        setFiles([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input-container">
            {files.length > 0 && (
                <div className="file-preview">
                    {files.map((file, i) => (
                        <div key={i}>{file.name}</div>
                    ))}
                </div>
            )}
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    placeholder="Напишите сообщение..."
                    onChange={(e) => {
                        setInput(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={handleKeyDown}
                />
                <label>
                    📎
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="file-input"
                    />
                </label>
                <button onClick={handleSend}>➤</button>
            </div>
        </div>
    );
};

export default MessageInputContainer;
