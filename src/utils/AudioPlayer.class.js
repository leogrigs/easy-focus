export class AudioPlayer {
  audioElement;

  constructor(id, source, volume = 1, loop = false) {
    this.audioElement = this.getAudioElement(id);
    this.audioElement.src = source;
    this.audioElement.loop = loop;
    this.audioElement.volume = volume;
  }

  getAudioElement(id) {
    if (document.getElementById(id)) {
      return document.getElementById(id);
    }
    const element = document.createElement("audio");
    element.id = id;
    document.body.appendChild(element);
    return element;
  }

  play() {
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }
}
