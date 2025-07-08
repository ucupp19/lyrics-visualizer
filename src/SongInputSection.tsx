import React, { useState } from 'react';

interface SongInputSectionProps {
    onUrlSubmit: (url: string) => void;
    onManualSearch: (artist: string, title: string) => void;
}

const SongInputSection: React.FC<SongInputSectionProps> = ({ onUrlSubmit, onManualSearch }) => {
    const [url, setUrl] = useState('');
    const [artist, setArtist] = useState('');
    const [title, setTitle] = useState('');

    return (
        <section className="input-section">
            <div className="url-input-container">
                <input
                    type="text"
                    placeholder="Paste YouTube or Spotify URL here..."
                    className="url-input"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') onUrlSubmit(url);
                    }}
                />
                <button className="load-btn" onClick={() => onUrlSubmit(url)}>
                    <i className="fas fa-play"></i> Load Song
                </button>
            </div>
            <div className="manual-input">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Artist name"
                        className="text-input"
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Song title"
                        className="text-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button className="search-btn" onClick={() => onManualSearch(artist, title)}>
                        <i className="fas fa-search"></i> Search Lyrics
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SongInputSection; 