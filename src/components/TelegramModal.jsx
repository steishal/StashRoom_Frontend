import React from "react";
import "./TelegramModal.css"; // <--- Вот здесь подключение

const TelegramModal = ({ token, onClose }) => {
    const command = `/start ${token}`;
    const botLink = "https://t.me/staishal_bot";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(command);
            alert("Команда скопирована в буфер обмена!");
        } catch (error) {
            console.error("Ошибка копирования:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Привязка Telegram</h2>
                <p>1. Перейдите к боту: <a href={botLink} target="_blank" rel="noopener noreferrer">{botLink}</a></p>
                <p>2. Отправьте боту следующую команду:</p>
                <div className="command-box" onClick={handleCopy}>
                    {command}
                    <span className="copy-hint">(нажмите, чтобы скопировать)</span>
                </div>
                <button className="close-button" onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default TelegramModal;

