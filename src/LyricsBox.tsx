import React, { useRef, useEffect } from 'react';

interface LyricLine {
    text: string;
}

interface LyricsBoxProps {
    lyrics: LyricLine[];
    activeIndex: number;
}

const LyricsBox: React.FC<LyricsBoxProps> = ({ lyrics, activeIndex }) => {
    const activeLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    return (
        <div className="lyrics-box" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {lyrics.map((line, idx) => (
                <div
                    key={idx}
                    ref={idx === activeIndex ? activeLineRef : undefined}
                    className={`lyrics-box-line${idx === activeIndex ? ' active' : ''}`}
                >
                    {line.text}
                </div>
            ))}
        </div>
    );
};

export default LyricsBox; 