import { PropTypes } from "prop-types";
import InputRange from "../InputRange";
import { Volume2, VolumeX, Check, RotateCcw } from "lucide-react";
import "./Config.css";
import Button from "../Button";
import React, { useEffect, useState } from "react";

const Config = ({ initialPomodoroTime, initialRestTime, setConfig }) => {
  const [pomodoroTime, setPomodoroTime] = useState(initialPomodoroTime);
  const [restTime, setRestTime] = useState(initialRestTime);
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

  const handleVolumeChange = (_volume) => {
    const audioElements = document.getElementsByTagName("audio");
    for (let audio of audioElements) {
      audio.volume = _volume;
      setVolume(_volume);
    }
    if (_volume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const resetConfig = () => {
    const _pomodoroTime = Config.defaultProps.initialPomodoroTime;
    const _restTime = Config.defaultProps.initialRestTime;
    setPomodoroTime(_pomodoroTime);
    setRestTime(_restTime);
    setConfig(_pomodoroTime, _restTime);
  };

  return (
    <div className="config">
      {/* Inputs */}
      <div className="config-input">
        <InputRange
          label="Focus"
          value={pomodoroTime}
          defaultValue={pomodoroTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={(value) => setPomodoroTime(value)}
        />

        <InputRange
          label="Rest"
          value={restTime}
          defaultValue={restTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={(value) => setRestTime(value)}
        />

        <InputRange
          label="Volume"
          value={volume}
          defaultValue={volume}
          min={0}
          max={1}
          step={0.01}
          valueLabelFunction={(value) => `${Math.round(value * 100)}%`}
          handleValueChange={(value) => handleVolumeChange(value)}
        />
      </div>

      {/* Buttons */}
      <div>
        <div className="container-button">
          <Button
            className="button--icon"
            icon={RotateCcw}
            onClick={resetConfig}
          />
          <Button
            className="button--icon"
            icon={isMuted ? VolumeX : Volume2}
            onClick={handleToggle}
          />
          <Button
            className="button--icon"
            icon={Check}
            onClick={() => setConfig(pomodoroTime, restTime)}
          />
        </div>
      </div>
    </div>
  );
};

Config.propTypes = {
  setConfig: PropTypes.func.isRequired,
  resetConfig: PropTypes.func.isRequired,
};

Config.defaultProps = {
  initialPomodoroTime: 25,
  initialRestTime: 5,
};

export default Config;
