import React from 'react';

interface LoadingSectionProps {
    show: boolean;
}

const LoadingSection: React.FC<LoadingSectionProps> = ({ show }) => {
    if (!show) return null;
    return (
        <section className="loading-section">
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading lyrics...</p>
            </div>
        </section>
    );
};

export default LoadingSection; 