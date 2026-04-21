export interface AmbientPlayer {
  play(): void;
  pause(): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  destroy(): void;
}

export class AudioPlayer implements AmbientPlayer {
  private audioElement: HTMLAudioElement;

  constructor(id: string, source: string, loop = false) {
    this.audioElement = this.getAudioElement(id);
    this.audioElement.src = source;
    this.audioElement.loop = loop;
  }

  private getAudioElement(id: string): HTMLAudioElement {
    const existing = document.getElementById(id);
    if (existing instanceof HTMLAudioElement) return existing;
    const element = document.createElement("audio");
    element.id = id;
    document.body.appendChild(element);
    return element;
  }

  setSource(source: string) {
    const wasPlaying = !this.audioElement.paused;
    this.audioElement.src = source;
    if (wasPlaying) this.audioElement.play().catch(() => {});
  }

  play() {
    this.audioElement.play().catch(() => {});
  }

  pause() {
    this.audioElement.pause();
  }

  setVolume(volume: number) {
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean) {
    this.audioElement.muted = muted;
  }

  destroy() {
    this.audioElement.pause();
    this.audioElement.removeAttribute("src");
    this.audioElement.load();
  }
}
