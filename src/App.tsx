import './styles.css';
import SongInputSection from './SongInputSection';
import MusicPlayer from './MusicPlayer';
import LyricsBox from './LyricsBox';
import LoadingSection from './LoadingSection';
import ErrorSection from './ErrorSection';
import React, { useState, useRef, useEffect } from 'react';
import ShinyText from './Shinytext';


interface LyricLine {
  text: string;
  startTime?: number;
  endTime?: number;
}

const LYRICS_API = 'http://afrizz.my.id:5000/lyrics';
const AUDIO_API = 'http://localhost:5001/play';

function App() {
  // State
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songThumbnail, setSongThumbnail] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Utility: format seconds as mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Fix parseLyrics to ensure raw is a string
  function parseLyrics(raw: any): LyricLine[] {
    if (Array.isArray(raw)) {
      // API returns an array of objects with text and timing
      const parsed = raw.map((line: any) => ({
        text: line.text || "",
        startTime: (line.minutes || 0) * 60 + (line.seconds || 0) + (line.hundredths ? line.hundredths / 100 : 0),
        endTime: undefined
      }));
      // Set endTime for each line
      for (let i = 0; i < parsed.length - 1; i++) {
        if (parsed[i + 1].startTime !== undefined) {
          parsed[i].endTime = parsed[i + 1].startTime;
        }
      }
      return parsed;
    }
    // fallback for string LRC or plain text
    if (typeof raw !== 'string') raw = '';
    const lrcRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
    const lines = raw.split(/\r?\n/);
    const parsed: LyricLine[] = [];
    for (const line of lines) {
      const match = lrcRegex.exec(line);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const cs = parseInt(match[3].slice(0, 2), 10); // hundredths
        const text = match[4].trim();
        const startTime = min * 60 + sec + cs / 100;
        parsed.push({ text, startTime });
      } else if (line.trim()) {
        parsed.push({ text: line.trim() });
      }
    }
    // Add endTime for each line
    for (let i = 0; i < parsed.length - 1; i++) {
      if (parsed[i].startTime !== undefined && parsed[i + 1].startTime !== undefined) {
        parsed[i].endTime = parsed[i + 1].startTime;
      }
    }
    return parsed;
  }

  // Fetch lyrics from API
  async function fetchLyrics(artist: string, title: string): Promise<LyricLine[]> {
    artist = artist.replace(/^"|"$/g, '');
    title = title.replace(/^"|"$/g, '');
    const url = `${LYRICS_API}?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Lyrics not found');
    const data = await resp.json();
    // Pass the array directly if data.lyrics is an array
    const raw = Array.isArray(data.lyrics)
      ? data.lyrics
      : typeof data.lyrics === 'string'
        ? data.lyrics
        : typeof data.text === 'string'
          ? data.text
          : '';
    return parseLyrics(raw);
  }

  // Fetch audio from API
  async function fetchAudio(query: string): Promise<{ audio_url: string; title: string; artist: string; thumbnail: string; metadata?: { title: string; artist: string; thumbnail: string } }> {
    const url = `${AUDIO_API}?q=${encodeURIComponent(query)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Audio not found');
    const data = await resp.json();
    return {
      audio_url: data.audio_url,
      title: data.title || '',
      artist: data.artist || '',
      thumbnail: data.thumbnail || '',
      metadata: data.metadata,
    };
  }

  // Handle URL input (YouTube/Spotify/manual)
  const handleUrlSubmit = async (url: string) => {
    setShowError(false);
    setShowLoading(true);
    try {
      let artist = '';
      let title = '';
      let thumbnail = '';
      let audio_url = '';
      // Detect Spotify
      if (/spotify\.com\/track\//.test(url)) {
        // Use audio API for unified info
        const audioData = await fetchAudio(url);
        artist = audioData.artist;
        title = audioData.title;
        thumbnail = audioData.thumbnail;
        audio_url = audioData.audio_url;
      } else if (/youtube\.com|youtu\.be/.test(url)) {
        // Use audio API for unified info
        const audioData = await fetchAudio(url);
        artist = audioData.artist;
        title = audioData.title;
        thumbnail = audioData.thumbnail;
        audio_url = audioData.audio_url;
      } else {
        // Treat as search query
        const audioData = await fetchAudio(url);
        artist = audioData.artist;
        title = audioData.title;
        thumbnail = audioData.thumbnail;
        audio_url = audioData.audio_url;
      }
      if (!artist || !title || !audio_url) throw new Error('Could not extract song info');
      setSongArtist(artist);
      setSongTitle(title);
      setSongThumbnail(thumbnail);
      setAudioUrl(audio_url);
      setIsPlaying(true); // Start playback automatically
      // Fetch lyrics
      const lyricsData = await fetchLyrics(artist, title);
      setLyrics(lyricsData);
      console.log('Parsed lyrics:', lyricsData);
      setActiveIndex(0);
      setShowLoading(false);
      setIsPlaying(false);
      setErrorMessage('');
    } catch (err: any) {
      setShowLoading(false);
      setShowError(true);
      setErrorMessage(err.message || 'Error loading song');
    }
  };

  // Handle manual search
  const handleManualSearch = async (artist: string, title: string) => {
    setShowError(false);
    setShowLoading(true);
    try {
      // Use audio API for unified info
      const audioData = await fetchAudio(`${artist} ${title}`);
      console.log('audioData:', audioData);
      setSongArtist(artist || audioData.artist || audioData.metadata?.artist || '');
      setSongTitle(title || audioData.title || audioData.metadata?.title || '');
      setSongThumbnail(audioData.thumbnail || audioData.metadata?.thumbnail || '/default-album.png');
      setAudioUrl(audioData.audio_url);
      setIsPlaying(true); // Start playback automatically
      // Fetch lyrics
      const lyricsData = await fetchLyrics(artist, title);
      setLyrics(lyricsData);
      console.log('Parsed lyrics:', lyricsData);
      setActiveIndex(0);
      setShowLoading(false);
      setIsPlaying(false);
      setErrorMessage('');
    } catch (err: any) {
      setShowLoading(false);
      setShowError(true);
      setErrorMessage(err.message || 'Error searching for lyrics');
    }
  };

  // Calculate progress (0 to 1)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      // Sync lyrics
      if (lyrics.length > 0) {
        let idx = 0;
        for (let i = 0; i < lyrics.length; i++) {
          if (lyrics[i].startTime !== undefined && audio.currentTime >= lyrics[i].startTime) {
            idx = i;
          }
        }
        setActiveIndex(idx);
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [lyrics]);

  // Add useEffect for audioUrl
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioUrl) {
      audio.load();
      audio.onloadedmetadata = () => {
        setTotalTime(formatTime(audio.duration));
        if (isPlaying) {
          audio.play();
        }
      };
    }
    // eslint-disable-next-line
  }, [audioUrl]);

  // Keep useEffect for isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Seek handler
  const handleSeek = (percent: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = percent * audio.duration;
  };

  // Restart handler
  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#222',
      }}
    >
      <div className="container" style={{ width: '100%', maxWidth: 900, minHeight: '100vh', margin: '0 auto', padding: '48px 32px', display: 'block' }}>
        <header className="header" style={{ textAlign: 'center' }}>
          <h1>
            <ShinyText text="Lyrics Visualizer" disabled={false} speed={3} className='custom-class' />
          </h1>
          <p>Paste YouTube or Spotify links to visualize lyrics with music and download the lrc file</p>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <SongInputSection
            onUrlSubmit={handleUrlSubmit}
            onManualSearch={handleManualSearch}
          />
        </div>
        <MusicPlayer
          thumbnail={songThumbnail}
          title={songTitle}
          artist={songArtist}
          isPlaying={isPlaying}
          currentTime={currentTime}
          totalTime={totalTime}
          progress={progress}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onRestart={handleRestart}
          onSeek={handleSeek}
          lyrics={lyrics}
        />
        <LyricsBox
          lyrics={lyrics}
          activeIndex={activeIndex}
        />
        <LoadingSection show={showLoading} />
        <ErrorSection show={showError} message={errorMessage} />
        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioUrl} preload="auto" />
      </div>
    </div>
  );
}

export default App;
