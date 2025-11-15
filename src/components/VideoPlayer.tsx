import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Settings,
  Captions,
  RotateCw,
  Maximize,
} from "lucide-react";
import Loading from "./Loading";

interface SubtitleObj {
  english?: string;
  spanish?: string;
}

interface VideoPlayerProps {
  src: string;
  // either a single subtitle URL/string (legacy) or an object with english/spanish URLs
  subtitles?: string | SubtitleObj;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, subtitles }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [autoSubtitle, setAutoSubtitle] = useState("");
  const [isAutoSubtitleActive, setIsAutoSubtitleActive] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<"off" | "english" | "spanish">("off");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inactive, setInactive] = useState(false);

  /** === Actualiza progreso === */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAutoSubtitle("");
      setProgress(0);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying, src]);

  /** === Accesibilidad teclado === */
  const handleKeyShortcuts = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    if (!videoRef.current) return;
    switch (e.key) {
      case " ": // espacio
      case "Enter":
        e.preventDefault();
        handlePlayPause();
        break;
      case "ArrowLeft":
        handleRewind();
        break;
      case "ArrowRight":
        handleForward();
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        handleFullscreen();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyShortcuts);
    return () => window.removeEventListener("keydown", handleKeyShortcuts);
  });

  /** === Full screen === */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  /** Hidden cursor */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleActivity = () => {
      setInactive(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setInactive(true);
      }, 5000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(timer);
    };
  }, []);

  /** === Controls === */
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      if (video.currentTime === 0) setAutoSubtitle("");
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setAutoSubtitle("");
      setIsLoading(true);
      video.load();
    }
  };

  const handleRewind = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const handleForward = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };

  const handleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video && duration) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      video.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const vol = parseFloat(e.target.value);
    if (video) {
      video.volume = vol;
      setVolume(vol);
      setMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setMuted(video.muted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  /** === Subtítulos automáticos === */
  useEffect(() => {
    if (!isAutoSubtitleActive) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAutoSubtitle("Subtítulos automáticos no soportados en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as SpeechRecognitionResultList);
      const transcript = results.map((r) => (r[0] ? r[0].transcript : "")).join(" ");
      const words = transcript.split(" ").slice(-10).join(" ");
      setAutoSubtitle(words);
    };

    recognition.start();

    return () => recognition.stop();
  }, [isAutoSubtitleActive]);

  /** === Control de pistas de subtítulos (nativo) === */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      // match by language codes or label
      if ((selectedSubtitle === "spanish" && (t.language === "es" || t.language === "es-ES" || t.label.toLowerCase().includes("esp"))) ||
          (selectedSubtitle === "english" && (t.language === "en" || t.language === "en-US" || t.label.toLowerCase().includes("eng")))) {
        t.mode = "showing" as TextTrackMode;
      } else {
        t.mode = "disabled" as TextTrackMode;
      }
    }
  }, [selectedSubtitle, subtitles, src]);

  return (
    <section
      role="region"
      aria-label="Reproductor de video"
      className={`relative w-full max-w-5xl mx-auto group overflow-hidden rounded-lg ${
        inactive ? "cursor-none" : "cursor-pointer"
      }`}
    >
      {/* === Video === */}
      {src && (
        <video
          ref={videoRef}
          src={src}
          crossOrigin="anonymous"
          preload="metadata"
          onLoadStart={() => setIsLoading(true)}
          onLoadedData={() => setIsLoading(false)}
          onClick={handlePlayPause}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          aria-label="Contenido de video"
          className="w-full h-auto aspect-video object-cover transition-all duration-500"
        >
    
          {subtitles && typeof subtitles === "object" && (
            <>
              {subtitles.spanish && (
                <track src={subtitles.spanish} kind="subtitles" srcLang="es" label="Español" />
              )}
              {subtitles.english && (
                <track src={subtitles.english} kind="subtitles" srcLang="en" label="English" />
              )}
            </>
          )}
        </video>
      )}

      {/* Subtítulos automáticos */}
      {isAutoSubtitleActive && autoSubtitle && (
        <div
          aria-live="polite"
          className="absolute bottom-20 left-0 right-0 text-center text-white text-lg bg-black/60 py-2 px-4 rounded-lg"
        >
          {autoSubtitle}
        </div>
      )}

      {/* Controles accesibles */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-6 py-2 bg-gradient-to-t from-black/80 to-transparent ${
          isPlaying && inactive
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
        role="group"
        aria-label="Controles del reproductor"
      >
        {/* Barra de progreso */}
        <label htmlFor="seek-bar" className="sr-only">
          Progreso del video
        </label>
        <input
          id="seek-bar"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Progreso del video"
          className="w-full accent-red-500 cursor-pointer"
        />

        {/* Tiempo */}
        <div className="flex justify-between text-xs text-gray-300 px-1">
          <span aria-label="Tiempo actual">{formatTime(currentTime)}</span>
          <span aria-label="Duración total">{formatTime(duration)}</span>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center">
          {/* Izquierda */}
          <div className="flex items-center sm:gap-3">
            <button
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button
              onClick={handleStop}
              aria-label="Detener video"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Square />
            </button>

            <button
              onClick={handleRewind}
              aria-label="Retroceder 10 segundos"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <RotateCcw />
            </button>

            <button
              onClick={handleForward}
              aria-label="Avanzar 10 segundos"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <RotateCw />
            </button>

            <button
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Control de volumen"
              className="w-20 accent-red-500 cursor-pointer"
            />
          </div>

          {/* Derecha */}
          <div className="flex items-center sm:gap-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  // Shift+click toggles automatic speech-based subtitles
                  if (e.shiftKey) {
                    setIsAutoSubtitleActive(!isAutoSubtitleActive);
                    return;
                  }

                  // cycle through subtitle options: off -> spanish -> english -> off
                  setSelectedSubtitle((prev) => {
                    if (prev === "off") return "spanish";
                    if (prev === "spanish") return "english";
                    return "off";
                  });
                }}
                aria-pressed={selectedSubtitle !== "off"}
                aria-label={
                  selectedSubtitle === "off"
                    ? "Activar subtítulos (clic), activar subtítulos automáticos (Shift+clic)"
                    : `Subtítulos: ${selectedSubtitle}`
                }
                title="Clic: cambiar idioma subtítulos · Shift+clic: subtítulos automáticos"
                className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <Captions className={selectedSubtitle !== "off" || isAutoSubtitleActive ? "text-red-500" : ""} />
              </button>

              {/* small label showing current subtitle selection */}
              {selectedSubtitle !== "off" && (
                <div className="absolute -top-8 right-0 text-xs bg-black/70 text-white px-2 py-1 rounded">
                  {selectedSubtitle === "spanish" ? "Español" : "English"}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="settings-menu"
              aria-label="Abrir configuración de velocidad"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Settings />
            </button>

            {showSettings && (
              <div
                id="settings-menu"
                role="menu"
                className="absolute bottom-10 right-0 bg-black/80 p-3 rounded-md shadow-lg"
              >
                <p className="text-gray-300 text-sm mb-2">Velocidad</p>
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.playbackRate = rate;
                      setPlaybackRate(rate);
                      setShowSettings(false);
                    }}
                    role="menuitemradio"
                    aria-checked={playbackRate === rate}
                    className={`block w-full text-left px-2 py-1 rounded ${
                      playbackRate === rate
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Activar pantalla completa"}
              className="p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <Maximize />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
