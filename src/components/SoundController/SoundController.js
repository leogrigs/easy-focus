import { Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "../Button";

const SoundController = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const audioElement = document.getElementsByTagName("audio")[0];
    if (audioElement) {
      const _isMuted = audioElement.muted;
      const _volume = audioElement.volume;
      setIsMuted(_isMuted);
      setVolume(_volume);
    }
  }, []);

  const handleToggle = () => {
    setIsMuted((prevIsMuted) => {
      const audioElements = document.getElementsByTagName("audio");
      for (let audio of audioElements) {
        audio.muted = !prevIsMuted;
      }
      return !prevIsMuted;
    });
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    const audioElements = document.getElementsByTagName("audio");
    for (let audio of audioElements) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <>
      <div>
        <Button
          className="button--icon"
          icon={isMuted ? VolumeX : Volume2}
          onClick={handleToggle}
        />
      </div>

      <div>
        <input
          type="range"
          min="0"
          max="1"
          value={volume}
          step="0.01"
          onChange={handleVolumeChange}
        />
      </div>
    </>
  );
};

export default SoundController;
