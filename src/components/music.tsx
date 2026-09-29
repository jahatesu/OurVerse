"use client";
import Image from "next/image";
import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  Shuffle,
  Repeat2,
  MoreHorizontal,
} from "lucide-react";
import { playlistDedication, songs } from "@/data/songs";
import { Couple } from "./characters";
import "./music-room.css";
type PlayerState = {
  index: number;
  playing: boolean;
  time: number;
  duration: number;
  error: string;
  spotifyReady: boolean;
  choose: (i: number) => void;
  toggle: () => void;
  connectSpotify: (controller: SpotifyEmbedController | null) => void;
  prepareSpotifyTrack: (spotifyUri: string) => void;
  markSpotifyReady: () => void;
  syncSpotifyStarted: (playingUri?: string) => void;
  syncSpotifyPlayback: (state: SpotifyPlaybackState) => void;
  reportSpotifyUnavailable: () => void;
};

type SpotifyPlaybackState = {
  playingURI?: string;
  isPaused: boolean;
  isBuffering: boolean;
  duration: number;
  position: number;
};

type SpotifyEvent<T> = { data: T };

type SpotifyEmbedController = {
  addListener: (
    event: "ready" | "playback_started" | "playback_update",
    listener: (event: SpotifyEvent<unknown>) => void,
  ) => void;
  removeListener: (
    event: "ready" | "playback_started" | "playback_update",
    listener?: (event: SpotifyEvent<unknown>) => void,
  ) => void;
  loadEntity: (spotifyUri: string, preferVideo?: boolean, startAt?: number) => void;
  togglePlay: () => void;
  destroy: () => void;
};

type SpotifyIFrameApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
  }
}

let cachedSpotifyIframeApi: SpotifyIFrameApi | null = null;
let spotifyApiBridgeInstalled = false;
const spotifyApiSubscribers = new Set<(api: SpotifyIFrameApi) => void>();

function installSpotifyApiBridge() {
  if (typeof window === "undefined" || spotifyApiBridgeInstalled) return;

  spotifyApiBridgeInstalled = true;
  const previousReadyHandler = window.onSpotifyIframeApiReady;

  window.onSpotifyIframeApiReady = (api) => {
    cachedSpotifyIframeApi = api;
    previousReadyHandler?.(api);
    spotifyApiSubscribers.forEach((subscriber) => subscriber(api));
  };
}
const Context = createContext<PlayerState | null>(null);
export function MusicProvider({ children }: { children: ReactNode }) {
  const spotifyController = useRef<SpotifyEmbedController | null>(null);
  const loadedSpotifyUri = useRef(songs[0].spotifyUri ?? "");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [spotifyReady, setSpotifyReady] = useState(false);

  const choose = useCallback((i: number) => {
    const nextIndex = (i + songs.length) % songs.length;
    loadedSpotifyUri.current = songs[nextIndex].spotifyUri ?? "";
    setIndex(nextIndex);
    setPlaying(false);
    setTime(0);
    setDuration(0);
    setError("");
  }, []);

  const toggle = useCallback(() => {
    if (!spotifyController.current || !spotifyReady) {
      setError("Open in Spotify to listen.");
      return;
    }

    try {
      spotifyController.current.togglePlay();
    } catch (spotifyError) {
      console.error("Spotify playback request failed", spotifyError);
      setError("Open in Spotify to listen.");
    }
  }, [spotifyReady]);

  const connectSpotify = useCallback((controller: SpotifyEmbedController | null) => {
    spotifyController.current = controller;
    if (!controller) {
      setSpotifyReady(false);
      setPlaying(false);
    }
  }, []);

  const prepareSpotifyTrack = useCallback((spotifyUri: string) => {
    loadedSpotifyUri.current = spotifyUri;
    setPlaying(false);
    setTime(0);
    setDuration(0);
    setError("");
  }, []);

  const markSpotifyReady = useCallback(() => {
    setSpotifyReady(true);
    setError("");
  }, []);

  const syncSpotifyStarted = useCallback((playingUri?: string) => {
    if (playingUri && playingUri !== loadedSpotifyUri.current) return;
    setPlaying(true);
    setError("");
  }, []);

  const syncSpotifyPlayback = useCallback((state: SpotifyPlaybackState) => {
    if (state.playingURI && state.playingURI !== loadedSpotifyUri.current) return;

    setPlaying(!state.isPaused && !state.isBuffering);
    setTime(Math.max(0, state.position / 1000));
    setDuration(Math.max(0, state.duration / 1000));
    setError("");
  }, []);

  const reportSpotifyUnavailable = useCallback(() => {
    setSpotifyReady(false);
    setPlaying(false);
    setError("Open in Spotify to listen.");
  }, []);

  return (
    <Context.Provider
      value={{
        index,
        playing,
        time,
        duration,
        error,
        spotifyReady,
        choose,
        toggle,
        connectSpotify,
        prepareSpotifyTrack,
        markSpotifyReady,
        syncSpotifyStarted,
        syncSpotifyPlayback,
        reportSpotifyUnavailable,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePlayer() {
  const player = useContext(Context);
  if (!player) throw new Error("MusicProvider missing");
  return player;
}
export function Controls({ small = false }: { small?: boolean }) {
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

function SongArtwork({
  song,
  size,
  eager = false,
  decorative = false,
}: {
  song: (typeof songs)[number];
  size: number;
  eager?: boolean;
  decorative?: boolean;
}) {
  const [failedArtworkUrl, setFailedArtworkUrl] = useState<string | null>(null);
  const source =
    song.artworkUrl && song.artworkUrl !== failedArtworkUrl
      ? song.artworkUrl
      : song.cover;

  return (
    <Image
      key={`${song.id}-${source}`}
      className="music-track-artwork"
      src={source}
      alt={decorative ? "" : `Artwork for ${song.title} by ${song.artist}`}
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailedArtworkUrl(song.artworkUrl ?? null)}
    />
  );
}

function spotifyTrackUrl(spotifyUri?: string) {
  const trackId = spotifyUri?.match(/^spotify:track:([A-Za-z0-9]+)$/)?.[1];
  return trackId ? `https://open.spotify.com/track/${trackId}` : null;
}

function SpotifyEmbedSurface() {
  const player = usePlayer();
  const selectedSpotifyUri = songs[player.index].spotifyUri;
  const openUrl = spotifyTrackUrl(selectedSpotifyUri);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const controllerCleanupRef = useRef<(() => void) | null>(null);
  const controllerGenerationRef = useRef(0);
  const loadedUriRef = useRef("");
  const selectedUriRef = useRef(selectedSpotifyUri);
  const playerRef = useRef(player);
  const [iframeApi, setIframeApi] = useState<SpotifyIFrameApi | null>(null);
  const [controllerReady, setControllerReady] = useState(false);
  const [scriptArmed, setScriptArmed] = useState(false);

  selectedUriRef.current = selectedSpotifyUri;
  playerRef.current = player;

  useEffect(() => {
    installSpotifyApiBridge();
    setScriptArmed(true);
    const receiveApi = (api: SpotifyIFrameApi) => setIframeApi(api);
    spotifyApiSubscribers.add(receiveApi);

    if (cachedSpotifyIframeApi) receiveApi(cachedSpotifyIframeApi);

    return () => {
      spotifyApiSubscribers.delete(receiveApi);
    };
  }, []);

  useEffect(() => {
    if (!iframeApi || !embedContainerRef.current) return;

    const initialUri = selectedUriRef.current;
    if (!initialUri) {
      playerRef.current.reportSpotifyUnavailable();
      return;
    }

    const generation = ++controllerGenerationRef.current;
    const container = embedContainerRef.current;
    const timer = window.setTimeout(() => {
      playerRef.current.prepareSpotifyTrack(initialUri);
      try {
        iframeApi.createController(
          container,
          { uri: initialUri, width: "100%", height: 152 },
          (controller) => {
            if (controllerGenerationRef.current !== generation) {
              controller.destroy();
              return;
            }

            const handleReady = () => {
              if (controllerGenerationRef.current !== generation) return;
              setControllerReady(true);
              playerRef.current.markSpotifyReady();
            };
            const handlePlaybackStarted = (event: SpotifyEvent<unknown>) => {
              const data = event.data as { playingURI?: string };
              playerRef.current.syncSpotifyStarted(data.playingURI);
            };
            const handlePlaybackUpdate = (event: SpotifyEvent<unknown>) => {
              playerRef.current.syncSpotifyPlayback(
                event.data as SpotifyPlaybackState,
              );
            };

            controller.addListener("ready", handleReady);
            controller.addListener("playback_started", handlePlaybackStarted);
            controller.addListener("playback_update", handlePlaybackUpdate);
            controllerRef.current = controller;
            loadedUriRef.current = initialUri;
            playerRef.current.connectSpotify(controller);

            const latestUri = selectedUriRef.current;
            if (latestUri && latestUri !== initialUri) {
              playerRef.current.prepareSpotifyTrack(latestUri);
              controller.loadEntity(latestUri);
              loadedUriRef.current = latestUri;
            }

            const cleanupController = () => {
              controller.removeListener("ready", handleReady);
              controller.removeListener(
                "playback_started",
                handlePlaybackStarted,
              );
              controller.removeListener(
                "playback_update",
                handlePlaybackUpdate,
              );
              controller.destroy();
            };
            controllerCleanupRef.current = cleanupController;
          },
        );
      } catch (spotifyError) {
        console.error("Spotify controller could not initialize", spotifyError);
        playerRef.current.reportSpotifyUnavailable();
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      controllerGenerationRef.current += 1;
      controllerCleanupRef.current?.();
      controllerCleanupRef.current = null;
      controllerRef.current = null;
      playerRef.current.connectSpotify(null);
    };
  }, [iframeApi]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controllerReady || !controller || !selectedSpotifyUri) return;
    if (loadedUriRef.current === selectedSpotifyUri) return;

    player.prepareSpotifyTrack(selectedSpotifyUri);
    try {
      controller.loadEntity(selectedSpotifyUri);
      loadedUriRef.current = selectedSpotifyUri;
    } catch (spotifyError) {
      console.error("Spotify could not load the selected track", spotifyError);
      player.reportSpotifyUnavailable();
    }
  }, [controllerReady, player, selectedSpotifyUri]);

  return (
    <>
      {scriptArmed && (
        <Script
          id="spotify-iframe-api"
          src="https://open.spotify.com/embed/iframe-api/v1"
          strategy="afterInteractive"
          onError={() => {
            console.error("Spotify iframe API failed to load");
            player.reportSpotifyUnavailable();
          }}
        />
      )}
      <div className="music-spotify-surface">
        <div className="music-spotify-heading">
          <span>PLAYING THROUGH SPOTIFY</span>
          {openUrl && (
            <a href={openUrl} target="_blank" rel="noopener noreferrer">
              Open in Spotify <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </div>
        <div
          ref={embedContainerRef}
          className="music-spotify-embed"
          aria-label={`Spotify player for ${songs[player.index].title}`}
        />
        {player.error && (
          <p className="music-spotify-fallback" role="status">
            Open in Spotify to listen.
          </p>
        )}
      </div>
    </>
  );
}

export function MusicRoom() {
  const player = usePlayer();
  const song = songs[player.index];
  const playlistRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const playlist = playlistRef.current;
    const row = trackRefs.current[player.index];
    if (!playlist || !row) return;

    const playlistBounds = playlist.getBoundingClientRect();
    const rowBounds = row.getBoundingClientRect();

    if (rowBounds.top < playlistBounds.top) {
      playlist.scrollBy({
        top: rowBounds.top - playlistBounds.top - 7,
        behavior: "smooth",
      });
    } else if (rowBounds.bottom > playlistBounds.bottom) {
      playlist.scrollBy({
        top: rowBounds.bottom - playlistBounds.bottom + 7,
        behavior: "smooth",
      });
    }
  }, [player.index]);

  return (
    <section className="music-room-scene">
      <header className="music-night-heading">
        <span className="music-heading-moon" aria-hidden="true" />
        <p>✦ IF OUR LOVE HAD A SOUND</p>
        <h1>The soundtrack of us.</h1>
        <span>
          For late-night calls, slow mornings, and every moment I<br />
          wish you were here.
        </span>
        <i className="music-heading-stars" aria-hidden="true">✦　·　⋆</i>
      </header>

      <div className="music-environment">
        <div className="music-room-glow" aria-hidden="true" />
        <div className="music-room-speckles" aria-hidden="true" />
        <div className="music-celestial-atmosphere" aria-hidden="true">
          <i className="music-cloud cloud-top-left" />
          <i className="music-cloud cloud-upper-center" />
          <i className="music-cloud cloud-window-wisp" />
          <i className="music-cloud cloud-bottom-left" />
          <i className="music-cloud cloud-bottom-center" />
          <i className="music-player-aura" />
          <i className="music-moonlight-spill" />
          <span className="music-star-cluster stars-memory">·　✦　·<br />　·　　　⋆　·<br />✦　　·</span>
          <span className="music-star-cluster stars-player">·　　⋆<br />　✦　　　·<br />·　　　·</span>
          <span className="music-star-cluster stars-window">✦　·　　·<br />　　⋆　·<br />·　　　　✦</span>
          <span className="music-star-cluster stars-floor">·　　·　✦　　·<br />　⋆　　　　·</span>
          <span className="music-shooting-star shooting-one" />
          <span className="music-shooting-star shooting-two" />
          <span className="music-shooting-star shooting-three" />
          <svg className="music-constellation-doodle constellation-one" viewBox="0 0 90 70">
            <path d="M8 48 27 21 48 34 72 11 82 47 56 59Z" />
            <g><circle cx="8" cy="48" r="2" /><circle cx="27" cy="21" r="1.7" /><circle cx="48" cy="34" r="2.2" /><circle cx="72" cy="11" r="1.5" /><circle cx="82" cy="47" r="1.8" /><circle cx="56" cy="59" r="1.5" /></g>
          </svg>
          <svg className="music-constellation-doodle constellation-two" viewBox="0 0 82 66">
            <path d="M9 19 29 38 42 16 56 39 74 18M29 38 41 56 56 39" />
            <g><circle cx="9" cy="19" r="1.6" /><circle cx="29" cy="38" r="2" /><circle cx="42" cy="16" r="1.6" /><circle cx="56" cy="39" r="2" /><circle cx="74" cy="18" r="1.6" /><circle cx="41" cy="56" r="1.8" /></g>
          </svg>
          <svg className="music-constellation-doodle constellation-heart" viewBox="0 0 88 70">
            <path d="M11 24 25 13 42 27 59 12 76 25 67 44 43 61 20 44Z" />
            <g><circle cx="11" cy="24" r="1.5" /><circle cx="25" cy="13" r="1.8" /><circle cx="42" cy="27" r="1.5" /><circle cx="59" cy="12" r="1.8" /><circle cx="76" cy="25" r="1.5" /><circle cx="67" cy="44" r="1.7" /><circle cx="43" cy="61" r="2" /><circle cx="20" cy="44" r="1.7" /></g>
          </svg>
          <i className="music-celestial-dust dust-one" />
          <i className="music-celestial-dust dust-two" />
          <i className="music-celestial-dust dust-three" />
          <span className="music-hidden-doodle doodle-note-one">♪　✦</span>
          <span className="music-hidden-doodle doodle-note-two">♫</span>
          <span className="music-hidden-doodle doodle-heart-one">♡</span>
          <span className="music-hidden-doodle doodle-heart-two">♡</span>
        </div>
        <div className="music-foreground-atmosphere" aria-hidden="true">
          <i className="music-foreground-cloud" />
          <i className="music-foreground-plant" />
          <span className="music-foreground-dust">·　　✦　·</span>
        </div>

        <aside className="music-memory-wall" aria-label="Our music memories">
          <div className="music-vine" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>

          <div className="music-pinned-note">
            <span className="music-tape" aria-hidden="true" />
            <p>different<br />songs,<br />same you</p><b>♡</b>
          </div>

          <div className="music-city-polaroid" aria-label="A city night beneath the same moon">
            <span className="music-polaroid-sky" aria-hidden="true">
              <i className="music-polaroid-moon" /><i className="music-cityline" />
            </span>
            <small>the nights between us ✦</small>
          </div>

          <div className="music-couple-polaroid">
            <span className="music-polaroid-clip" aria-hidden="true" />
            <div aria-hidden="true"><Couple scene="sit" /></div>
            <small>always my favorite person <b>♡</b></small>
          </div>

          <div className="music-vertical-note">Songs<br />that<br />remind<br />me<br />of you<br /><b>♡</b></div>

          <div className="music-books" aria-label="A stack of our story books">
            <span>Late night talks</span><span>Long distance</span><span>Our story</span><span>And everything in between</span>
          </div>
          <div className="music-candle" aria-hidden="true"><i /><span /></div>

          <div className="music-cozy-corner">
            <div className="music-cozy-stars" aria-hidden="true">✦　♡　·</div>
            <div className="music-cozy-couple" aria-hidden="true"><Couple scene="sit" /></div>
            <div className="music-mug" aria-hidden="true">♡</div>
            <div className="music-cat" aria-label="Their cat sleeping beside them">
              <i className="music-cat-tail" /><i className="music-cat-body" /><i className="music-cat-head" />
            </div>
            <div className="music-notebook"><span>Our soundtrack ♡</span><i aria-hidden="true" /></div>
          </div>
        </aside>

        <section className="music-record-player" aria-label="Our record player">
          <div className="music-player-topline"><span>J + J</span><i aria-hidden="true">✦　·　☾</i></div>
          <div className="music-deck">
            <div className={`music-vinyl ${player.playing ? "playing" : ""}`}>
              <span className="music-vinyl-shine" aria-hidden="true" />
              <SongArtwork song={song} size={200} eager />
              <span className="music-label-magic" aria-hidden="true"><i /></span>
              <i className="music-vinyl-pin" aria-hidden="true" />
            </div>
            <div className="music-tonearm" aria-hidden="true">
              <i className="music-tonearm-pivot" /><i className="music-tonearm-bar" /><i className="music-tonearm-head" />
            </div>
            <span className="music-gold-star" aria-hidden="true">★</span>
            <span className="music-constellation" aria-hidden="true">·—✦—·<br />　╲　·</span>
          </div>

          <div className="music-now-playing">
            <span>NOW PLAYING IN OUR LITTLE CORNER</span><h2 title={song.title}>{song.title}</h2><p title={song.artist}>{song.artist}</p>
          </div>
          <label className="sr-only" htmlFor="music-progress">Track position</label>
          <input
            id="music-progress"
            type="range"
            min={0}
            max={player.duration || 1}
            step={0.1}
            value={player.time}
            disabled={!player.duration}
            readOnly
            aria-readonly="true"
            tabIndex={-1}
            onChange={() => undefined}
          />
          <div className="music-times"><span>{timeLabel(player.time)}</span><span>{timeLabel(player.duration)}</span></div>
          <div className="music-physical-controls">
            <span className="music-control-ornament" aria-hidden="true"><Shuffle size={16} /></span>
            <Controls />
            <span className="music-control-ornament" aria-hidden="true"><Repeat2 size={17} /></span>
          </div>
          <p className="audio-notice" role="status">
            {player.error || (player.spotifyReady ? "Press play when you’re ready. No autoplay, ever." : "Connecting our record player to Spotify...")}
          </p>
          {song.externalUrl && (
            <a href={song.externalUrl} target="_blank" rel="noopener noreferrer" className="music-listen-link">
              Listen to this song <ExternalLink size={14} />
            </a>
          )}
          <span className="music-player-screw screw-one" aria-hidden="true" /><span className="music-player-screw screw-two" aria-hidden="true" />
          <span className="music-player-screw screw-three" aria-hidden="true" /><span className="music-player-screw screw-four" aria-hidden="true" />
        </section>

        <aside className="music-right-corner">
          <div className="music-window" aria-label="City lights through our nighttime window">
            <div className="music-window-sky" aria-hidden="true">
              <i className="music-window-moon" /><i className="music-window-stars">·　✦　·<br />　⋆　　　·</i><i className="music-window-city" />
            </div>
            <span className="music-curtain curtain-left" aria-hidden="true" /><span className="music-curtain curtain-right" aria-hidden="true" />
            <p>Same sky,<br />Same songs,<br />Still us.<br /><b>♡</b></p>
            <div className="music-sill" aria-hidden="true"><i className="music-vase"><b /><b /><b /></i><i className="music-orb">✦</i></div>
            <div className="music-sill-note">Music feels<br />closer to you<br /><b>♡</b></div>
          </div>

          <section className="music-janna-note">
            <span className="music-paperclip" aria-hidden="true" /><i className="music-note-doodles" aria-hidden="true">☾　·　✦</i>
            <span className="music-note-label">A NOTE FROM JANNA</span>
            <h2>Why this song reminds me of you...</h2>
            <div className="music-note-body" key={song.id} aria-live="polite">
              <p>{song.note}</p>
            </div>
            <span className="music-note-signoff">with love, always ♡</span>
          </section>

          <section className="music-playlist" aria-label="Our playlist">
            <h2>OUR PLAYLIST ♥</h2>
            <p className="music-playlist-dedication">{playlistDedication}</p>
            <div className="music-track-list" ref={playlistRef}>
              {songs.map((track, i) => (
                <button
                  className={i === player.index ? "selected" : ""}
                  key={track.id}
                  ref={(element) => { trackRefs.current[i] = element; }}
                  onClick={() => player.choose(i)}
                  aria-current={i === player.index ? "true" : undefined}
                  aria-label={`Select ${track.title} by ${track.artist}`}
                  title={`${track.title} — ${track.artist}`}
                >
                  <span className="music-track-number">{String(track.number).padStart(2, "0")}</span>
                  <SongArtwork song={track} size={52} decorative />
                  <span className="music-track-copy"><strong>{track.title}</strong><small>{track.artist}</small></span>
                  <Music2 className="music-track-note" size={16} /><MoreHorizontal className="music-track-more" size={15} />
                </button>
              ))}
            </div>
            <div className="music-add-song">+ Add another song to our soundtrack... ♡</div>
            <SpotifyEmbedSurface />
          </section>
        </aside>
      </div>
    </section>
  );
}
