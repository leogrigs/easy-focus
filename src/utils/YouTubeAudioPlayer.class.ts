import type { AmbientPlayer } from "./AudioPlayer.class";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement | string,
    opts: {
      videoId: string;
      playerVars?: Record<string, unknown>;
      events?: {
        onReady?: () => void;
        onError?: () => void;
      };
    }
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeAPI(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YTNamespace>((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const existing = document.getElementById("yt-iframe-api");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
  });
  return apiPromise;
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("?")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.replace("/embed/", "").split("?")[0] || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export class YouTubeAudioPlayer implements AmbientPlayer {
  private player: YTPlayer | null = null;
  private container: HTMLDivElement;
  private ready = false;
  private pendingVolume: number | null = null;
  private pendingMuted: boolean | null = null;
  private shouldPlay = false;

  constructor(videoId: string) {
    this.container = document.createElement("div");
    this.container.id = `yt-player-${Math.random().toString(36).slice(2)}`;
    this.container.style.cssText =
      "position:fixed;bottom:-10px;right:-10px;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(this.container);

    loadYouTubeAPI().then((YT) => {
      this.player = new YT.Player(this.container.id, {
        videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            this.ready = true;
            if (this.pendingVolume !== null) {
              this.player?.setVolume(this.pendingVolume * 100);
            }
            if (this.pendingMuted) this.player?.mute();
            if (this.shouldPlay) this.player?.playVideo();
          },
        },
      });
    });
  }

  play() {
    if (this.ready && this.player) this.player.playVideo();
    else this.shouldPlay = true;
  }

  pause() {
    this.shouldPlay = false;
    if (this.ready && this.player) this.player.pauseVideo();
  }

  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.ready && this.player) this.player.setVolume(clamped * 100);
    else this.pendingVolume = clamped;
  }

  setMuted(muted: boolean) {
    if (this.ready && this.player) {
      if (muted) this.player.mute();
      else this.player.unMute();
    } else {
      this.pendingMuted = muted;
    }
  }

  destroy() {
    try {
      this.player?.destroy();
    } catch {
      /* ignore */
    }
    this.player = null;
    this.container.remove();
  }
}
