import React from 'react';

interface LyricLine {
    text: string;
    startTime?: number;
    endTime?: number;
}

interface LyricsSectionProps {
    show: boolean;
    lyrics: LyricLine[];
    activeIndex: number;
}

const LyricsSection: React.FC<LyricsSectionProps> = ({ show, lyrics, activeIndex }) => {
    if (!show) return null;
    return (
        <section className="lyrics-section">
            <div className="lyrics-container">
                <div className="lyrics-content">
                    {lyrics.map((line, idx) => (
                        <div
                            key={idx}
                            className={`lyric-line${idx === activeIndex ? ' active' : ''}`}
                            data-start-time={line.startTime}
                            data-end-time={line.endTime}
                        >
                            {line.text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LyricsSection; 