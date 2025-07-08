import React from 'react';

interface PlayerSectionProps {
    show: boolean;
    thumbnail: string;
    title: string;
    artist: string;
    isPlaying: boolean;
    currentTime: string;
    totalTime: string;
    onPlayPause: () => void;
    onDownloadLRC: () => void;
    onProgressClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const PlayerSection: React.FC<PlayerSectionProps> = ({
    show,
    thumbnail,
    title,
    artist,
    isPlaying,
    currentTime,
    totalTime,
    onPlayPause,
    onDownloadLRC,
    onProgressClick,
}) => {
    if (!show) return null;
    return (
        <section className="player-section">
            <div className="custom-player">
                <div className="custom-player-row">
                    <img className="custom-album-art" src={thumbnail} alt="Album Art" />
                    <div className="custom-song-info">
                        <div className="custom-title">{title}</div>
                        <div className="custom-artist">{artist}</div>
                    </div>
                    <div className="player-controls">
                        <button className="player-btn" onClick={onPlayPause}>
                            <img
                                src={isPlaying ? '/pause.svg' : '/play.svg'}
                                alt={isPlaying ? 'Pause' : 'Play'}
                                width={24}
                                height={24}
                            />
                        </button>
                        <button className="player-btn" onClick={onDownloadLRC}>
                            Download LRC
                        </button>
                    </div>
                </div>
                <div className="custom-progress-bar" onClick={onProgressClick}>
                    <div id="progressFill"></div>
                    <div className="progress-thumb"></div>
                </div>
                <div className="custom-time-row">
                    <span className="custom-time">{currentTime}</span>
                    <span className="custom-time">{totalTime}</span>
                </div>
            </div>
        </section>
    );
};

export default PlayerSection; 