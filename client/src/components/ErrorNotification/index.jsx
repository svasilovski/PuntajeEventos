import React from 'react';
import './ErrorNotification.css';

const ErrorNotification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="error-notification">
        {message}
        <button onClick={onClose} className="error-notification-close">×</button>
        </div>
    );
};

export default ErrorNotification;
