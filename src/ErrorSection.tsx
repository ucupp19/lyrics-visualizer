import React from 'react';

interface ErrorSectionProps {
    show: boolean;
    message: string;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ show, message }) => {
    if (!show) return null;
    return (
        <section className="error-section">
            <div className="error-container">
                <p className="error-text">{message}</p>
            </div>
        </section>
    );
};

export default ErrorSection; 