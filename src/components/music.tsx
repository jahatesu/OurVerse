"use client";
import Image from "next/image";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Music2,
  ExternalLink,
} from "lucide-react";
import { songs } from "@/data/songs";
import { SectionHeading } from "./ui";
type PlayerState = {
  index: number;
  playing: boolean;
  time: number;
  duration: number;
  error: string;
  choose: (i: number) => void;
  toggle: () => void;
  seek: (n: number) => void;
};
const Context = createContext<PlayerState | null>(null);
export function MusicProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  function choose(i: number) {
    audio.current?.pause();
    setIndex((i + songs.length) % songs.length);
    setPlaying(false);
    setTime(0);
    setDuration(0);
    setError("");
  }
  function toggle() {
    if (!songs[index].audioUrl) {
      setError(
        "A little silence for now. Add an audio file in songs.ts to bring our soundtrack to life.",
      );
      return;
    }
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else
      void audio.current.play().catch(() => {
        setPlaying(false);
        setError(
          "This track could not play. Check its audio URL and try again.",
        );
      });
  }
  return (
    <Context.Provider
      value={{
        index,
        playing,
        time,
        duration,
        error,
        choose,
        toggle,
        seek: (n) => {
          if (audio.current && Number.isFinite(n)) {
            audio.current.currentTime = n;
            setTime(n);
          }
        },
      }}
    >
      <audio
        ref={audio}
        src={songs[index].audioUrl}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setTime(audio.current?.currentTime ?? 0)}
        onLoadedMetadata={() =>
          setDuration(
            Number.isFinite(audio.current?.duration)
              ? audio.current!.duration
              : 0,
          )
        }
        onEnded={() => choose(index + 1)}
        onError={() => {
          setPlaying(false);
          setError("Audio unavailable. Check the configured track file.");
        }}
      />
      {children}
    </Context.Provider>
  );
}
function usePlayer() {
  const player = useContext(Context);
  if (!player) throw new Error("MusicProvider missing");
  return player;
}
function Controls({ small = false }: { small?: boolean }) {
  const player = usePlayer();
  return (
    <div className={`player-controls ${small ? "small" : ""}`}>
      <button
        className="icon-button"
        aria-label="Previous track"
        onClick={() => player.choose(player.index - 1)}
      >
        <SkipBack size={small ? 15 : 21} />
      </button>
      <button
        className="play-button"
        aria-label={player.playing ? "Pause music" : "Play music"}
        onClick={player.toggle}
      >
        {player.playing ? (
          <Pause size={small ? 15 : 22} />
        ) : (
          <Play size={small ? 15 : 22} />
        )}
      </button>
      <button
        className="icon-button"
        aria-label="Next track"
        onClick={() => player.choose(player.index + 1)}
      >
        <SkipForward size={small ? 15 : 21} />
      </button>
    </div>
  );
}
export function FloatingPlayer({ navigate }: { navigate: () => void }) {
  const player = usePlayer();
  return (
    <div className="floating-player">
      <button className="floating-song" onClick={navigate}>
        <span className={`mini-vinyl ${player.playing ? "playing" : ""}`}>
          <Music2 size={15} />
        </span>
        <span>
          <strong>{songs[player.index].title}</strong>
          <small>
            {player.playing
              ? "Our little soundtrack"
              : "Our soundtrack · press play"}
          </small>
        </span>
      </button>
      <Controls small />
      {player.error && (
        <span className="floating-player-notice" role="status">
          {player.error}
        </span>
      )}
    </div>
  );
}
const timeLabel = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
export function MusicRoom() {
  const player = usePlayer();
  const song = songs[player.index];
  return (
    <>
      <SectionHeading
        eyebrow="IF OUR LOVE HAD A SOUND"
        title="The soundtrack of us."
        description="For late-night calls, slow mornings, and every moment I wish you were here."
      />
      <div className="music-layout">
        <section className="music-player">
          <span className="eyebrow">ON OUR RECORD PLAYER</span>
          <div className={`vinyl-record ${player.playing ? "playing" : ""}`}>
            <Image
              src={song.cover}
              alt={`Illustrated cover for ${song.title}`}
              width={200}
              height={200}
            />
          </div>
          <h2>{song.title}</h2>
          <p>{song.artist}</p>
          <label className="sr-only" htmlFor="music-progress">
            Track position
          </label>
          <input
            id="music-progress"
            type="range"
            min={0}
            max={player.duration || 1}
            step={0.1}
            value={player.time}
            disabled={!player.duration}
            onChange={(e) => player.seek(Number(e.target.value))}
          />
          <div className="music-times">
            <span>{timeLabel(player.time)}</span>
            <span>{timeLabel(player.duration)}</span>
          </div>
          <Controls />
          <p className="audio-notice" role="status">
            {player.error ||
              (!song.audioUrl
                ? "Your future soundtrack. Add your own audio to listen here."
                : "Press play when you’re ready. No autoplay, ever.")}
          </p>
          {song.externalUrl && (
            <a
              href={song.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-button"
            >
              Listen to this song <ExternalLink size={14} />
            </a>
          )}
        </section>
        <div>
          <section className="song-note">
            <span className="eyebrow">A NOTE FROM JANNA</span>
            <h2>Why this song reminds me of you…</h2>
            <p>{song.message}</p>
            <span className="handwritten">with love, always ♡</span>
          </section>
          <div className="track-list">
            {songs.map((track, i) => (
              <button
                className={i === player.index ? "selected" : ""}
                key={track.title}
                onClick={() => player.choose(i)}
              >
                <span>0{i + 1}</span>
                <Image src={track.cover} alt="" width={48} height={48} />
                <span>
                  <strong>{track.title}</strong>
                  <small>{track.artist}</small>
                </span>
                <Music2 size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
