import React from 'react';
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineReload, AiOutlineDownload } from "react-icons/ai";

interface MusicPlayerProps {
    thumbnail: string;
    title: string;
    artist: string;
    isPlaying: boolean;
    currentTime: string;
    totalTime: string;
    progress: number; // 0 to 1
    onPlayPause: () => void;
    onRestart: () => void;
    onSeek: (percent: number) => void;
    lyrics: { text: string; startTime?: number }[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
    thumbnail,
    title,
    artist,
    isPlaying,
    currentTime,
    totalTime,
    progress,
    onPlayPause,
    onRestart,
    onSeek,
    lyrics,
}) => {
    // Handle progress bar click/drag
    const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        onSeek(percent);
    };

    // Download .lrc file
    const handleDownload = () => {
        if (!lyrics || lyrics.length === 0) return;
        const lrc = lyrics.map(line => {
            if (line.startTime !== undefined) {
                const min = String(Math.floor(line.startTime / 60)).padStart(2, '0');
                const sec = String(Math.floor(line.startTime % 60)).padStart(2, '0');
                const cs = String(Math.round((line.startTime % 1) * 100)).padStart(2, '0');
                return `[${min}:${sec}.${cs}]${line.text}`;
            } else {
                return line.text;
            }
        }).join('\n');
        const blob = new Blob([lrc], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'lyrics'}.lrc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="music-player">
            <div className="music-player-row">
                <img className="music-thumbnail" src={thumbnail} alt="Album Art" />
                <div>
                    <div className="music-title">{title}</div>
                    <div className="music-artist">{artist}</div>
                </div>
            </div>
            <div className="music-progress-times">
                <span className="music-time music-time-current">{currentTime}</span>
                <span className="music-time music-time-total">{totalTime}</span>
            </div>
            <div className="music-progress-bar" onClick={handleBarClick}>
                <div className="music-progress-fill" style={{ width: `${progress * 100}%` }}></div>
                <div
                    className="music-progress-thumb"
                    style={{ left: `calc(${progress * 100}% - 8px)` }}
                ></div>
            </div>
            <div className="music-player-controls">
                <button className="music-btn" onClick={onRestart} title="Restart">
                    <AiOutlineReload size={28} />
                </button>
                <button className="music-btn" onClick={onPlayPause} title={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <AiOutlinePauseCircle size={28} /> : <AiOutlinePlayCircle size={28} />}
                </button>
                <button className="music-btn" onClick={handleDownload} title="Download LRC">
                    <AiOutlineDownload size={28} />
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer; 