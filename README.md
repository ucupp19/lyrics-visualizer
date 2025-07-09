# Lyrics Visualizer

A modern web application that synchronizes lyrics with music playback, allowing users to visualize song lyrics in real-time. Built with React, TypeScript, and Vite.

## 🎵 Features

- **Real-time Lyrics Synchronization**: Lyrics highlight in sync with music playback
- **Multiple Input Sources**: Support for YouTube links, Spotify links, and manual search
- **Interactive Music Player**: Custom player with play/pause, seek, and restart controls
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful error handling for unsupported audio sources
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Live Demo

[Add your live demo link here]

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with custom animations
- **Audio**: HTML5 Audio API
- **APIs**: Custom lyrics and audio APIs

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ucupp19/lyrics-visualizer
   cd lyrics-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Adding Music

1. **YouTube Links**: Paste a YouTube video URL
2. **Spotify Links**: Paste a Spotify track URL
3. **Manual Search**: Enter artist and song title manually

### Controls

- **Play/Pause**: Click the play button to control playback
- **Seek**: Click on the progress bar to jump to a specific time
- **Restart**: Click the restart button to start from the beginning
- **Lyrics Sync**: Lyrics automatically highlight as the song plays

## 📁 Project Structure

```
lyrics-visualizer/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── App.tsx        # Main application component
│   │   ├── MusicPlayer.tsx # Custom music player
│   │   ├── LyricsBox.tsx  # Lyrics display component
│   │   ├── SongInputSection.tsx # Input handling
│   │   ├── LoadingSection.tsx # Loading states
│   │   ├── ErrorSection.tsx # Error handling
│   │   └── ShinyText.tsx  # Animated text component
│   ├── styles.css         # Global styles
│   └── main.tsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_LYRICS_API=-
VITE_AUDIO_API=-
```

### API Endpoints

The application uses two main APIs:

- **Lyrics API**: Fetches synchronized lyrics for songs
- **Audio API**: Retrieves audio streams and metadata

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **GitHub Pages**
   ```bash
   npm run build
   # Deploy dist/ folder to GitHub Pages
   ```

## 🐛 Known Issues

- **Audio Source Limitations**: Some YouTube/Spotify links may not work due to platform restrictions
- **CORS Issues**: Direct audio streaming may be blocked by browsers
- **Mobile Playback**: Background audio playback may be limited on mobile devices

## 🔮 Future Enhancements

- [ ] YouTube/Spotify embed player integration
- [ ] User upload functionality for custom audio files
- [ ] Playlist support
- [ ] Offline mode with cached lyrics
- [ ] Social sharing features
- [ ] Advanced audio visualization
- [ ] Multiple language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lyrics API**: is not available for noew for providing lyrics data
- **Audio API**: is not available for now for audio streaming
- **React Community**: For the amazing ecosystem and tools
- **Vite**: For the fast build tool and development experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ by [Afrizz]**
