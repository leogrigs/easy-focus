import { Check, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../Button";
import InputRange from "../InputRange";
import "./Config.css";

interface ConfigProps {
  initialPomodoroTime?: number;
  initialRestTime?: number;
  setConfig: (pomodoroTime: number, restTime: number, isResetting: boolean) => void;
}

const DEFAULT_POMODORO_TIME = 25;
const DEFAULT_REST_TIME = 5;

const Config = ({
  initialPomodoroTime = DEFAULT_POMODORO_TIME,
  initialRestTime = DEFAULT_REST_TIME,
  setConfig,
}: ConfigProps) => {
  const [pomodoroTime, setPomodoroTime] = useState(initialPomodoroTime);
  const [restTime, setRestTime] = useState(initialRestTime);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const audioElement = document.getElementsByTagName("audio")[0];
    if (audioElement) {
      setIsMuted(audioElement.muted);
      setVolume(audioElement.volume);
    }
  }, []);

  const handleToggle = () => {
    setIsMuted((prevIsMuted) => {
      const audioElements = document.getElementsByTagName("audio");
      for (const audio of audioElements) {
        audio.muted = !prevIsMuted;
      }
      return !prevIsMuted;
    });
  };

  const handleVolumeChange = (nextVolume: number) => {
    const audioElements = document.getElementsByTagName("audio");
    for (const audio of audioElements) {
      audio.volume = nextVolume;
    }
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const resetConfig = () => {
    setPomodoroTime(DEFAULT_POMODORO_TIME);
    setRestTime(DEFAULT_REST_TIME);
    setConfig(DEFAULT_POMODORO_TIME, DEFAULT_REST_TIME, true);
  };

  return (
    <div className="config">
      <div className="config-input">
        <InputRange
          label="Focus:"
          value={pomodoroTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={setPomodoroTime}
        />

        <InputRange
          label="Rest:"
          value={restTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={setRestTime}
        />

        <InputRange
          label="Volume:"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          valueLabelFunction={(value) => `${Math.round(value * 100)}%`}
          handleValueChange={handleVolumeChange}
        />
      </div>

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
          onClick={() => setConfig(pomodoroTime, restTime, false)}
        />
      </div>
    </div>
  );
};

export default Config;
