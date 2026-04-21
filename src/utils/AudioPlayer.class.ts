export class AudioPlayer {
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

  play() {
    this.audioElement.play().catch(() => {});
  }

  pause() {
    this.audioElement.pause();
  }
}
