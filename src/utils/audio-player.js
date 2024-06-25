export function playAudio(id, source, volume = 1, loop = false) {
  if (!source) return;
  let audioElement = document.getElementById(id);
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = id;
    document.body.appendChild(audioElement);
    audioElement.src = source;
    audioElement.loop = loop;
    audioElement.volume = volume;
  } else {
    if (!audioElement.paused) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }
}
