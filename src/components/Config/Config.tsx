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
    const audio = document.getElementsByTagName("audio")[0];
    if (audio) {
      setIsMuted(audio.muted);
      setVolume(audio.volume);
    }
  }, []);

  const handleToggle = () => {
    setIsMuted((prev) => {
      const audios = document.getElementsByTagName("audio");
      for (const a of audios) a.muted = !prev;
      return !prev;
    });
  };

  const handleVolumeChange = (v: number) => {
    const audios = document.getElementsByTagName("audio");
    for (const a of audios) a.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const resetConfig = () => {
    setPomodoroTime(DEFAULT_POMODORO_TIME);
    setRestTime(DEFAULT_REST_TIME);
    setConfig(DEFAULT_POMODORO_TIME, DEFAULT_REST_TIME, true);
  };

  return (
    <div className="config">
      <section className="config-section">
        <h3 className="config-section-heading">Tempos</h3>
        <div className="config-input">
          <InputRange
            label="Focus:"
            value={pomodoroTime}
            min={1}
            max={60}
            step={1}
            valueLabelFunction={(v) => `${v}min`}
            handleValueChange={setPomodoroTime}
          />
          <InputRange
            label="Rest:"
            value={restTime}
            min={1}
            max={30}
            step={1}
            valueLabelFunction={(v) => `${v}min`}
            handleValueChange={setRestTime}
          />
        </div>
      </section>

      <section className="config-section">
        <h3 className="config-section-heading">Volume</h3>
        <div className="config-input">
          <InputRange
            label="Volume:"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            valueLabelFunction={(v) => `${Math.round(v * 100)}%`}
            handleValueChange={handleVolumeChange}
          />
        </div>
      </section>

      <div className="config-footer">
        <Button
          variant="default"
          icon={RotateCcw}
          onClick={resetConfig}
          ariaLabel="Restaurar padrões"
        />
        <Button
          variant="default"
          icon={isMuted ? VolumeX : Volume2}
          onClick={handleToggle}
          ariaLabel={isMuted ? "Desmutar" : "Mutar"}
        />
        <Button
          variant="primary"
          icon={Check}
          onClick={() => setConfig(pomodoroTime, restTime, false)}
          ariaLabel="Salvar"
        />
      </div>
    </div>
  );
};

export default Config;
