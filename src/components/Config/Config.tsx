import { useEffect, useState } from "react";
import { Check, RotateCcw, Volume2, VolumeX, Timer as TimerIcon } from "lucide-react";
import Button from "../Button";
import InputRange from "../InputRange";
import SoundPicker from "../SoundPicker";
import "./Config.css";

export const DEFAULT_POMODORO_TIME = 25;
export const DEFAULT_REST_TIME = 5;
export const DEFAULT_LONG_REST_TIME = 15;

export interface TimerConfig {
  pomodoroTime: number;
  restTime: number;
  longRestTime: number;
}

interface ConfigProps {
  pomodoroTime: number;
  restTime: number;
  longRestTime: number;
  volume: number;
  isMuted: boolean;
  cycleCount: number;
  selectedSoundId: string;
  customSoundUrl: string;
  onSaveTimers: (config: TimerConfig, closeTab: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onResetCycles: () => void;
  onSelectSound: (soundId: string) => void;
  onApplyCustomUrl: (url: string) => void;
}

const Config = ({
  pomodoroTime,
  restTime,
  longRestTime,
  volume,
  isMuted,
  cycleCount,
  selectedSoundId,
  customSoundUrl,
  onSaveTimers,
  onVolumeChange,
  onToggleMute,
  onResetCycles,
  onSelectSound,
  onApplyCustomUrl,
}: ConfigProps) => {
  const [draftPomodoro, setDraftPomodoro] = useState(pomodoroTime);
  const [draftRest, setDraftRest] = useState(restTime);
  const [draftLongRest, setDraftLongRest] = useState(longRestTime);

  useEffect(() => setDraftPomodoro(pomodoroTime), [pomodoroTime]);
  useEffect(() => setDraftRest(restTime), [restTime]);
  useEffect(() => setDraftLongRest(longRestTime), [longRestTime]);

  const resetDefaults = () => {
    setDraftPomodoro(DEFAULT_POMODORO_TIME);
    setDraftRest(DEFAULT_REST_TIME);
    setDraftLongRest(DEFAULT_LONG_REST_TIME);
    onSaveTimers(
      {
        pomodoroTime: DEFAULT_POMODORO_TIME,
        restTime: DEFAULT_REST_TIME,
        longRestTime: DEFAULT_LONG_REST_TIME,
      },
      false
    );
  };

  const applyDraft = () => {
    onSaveTimers(
      {
        pomodoroTime: draftPomodoro,
        restTime: draftRest,
        longRestTime: draftLongRest,
      },
      true
    );
  };

  return (
    <div className="config">
      <SoundPicker
        selectedSoundId={selectedSoundId}
        customUrl={customSoundUrl}
        onSelectSound={onSelectSound}
        onApplyCustomUrl={onApplyCustomUrl}
      />

      <section className="config-section">
        <h3 className="config-section-heading">Tempos</h3>
        <div className="config-input">
          <InputRange
            label="Focus:"
            value={draftPomodoro}
            min={1}
            max={60}
            step={1}
            valueLabelFunction={(value) => `${value}min`}
            handleValueChange={setDraftPomodoro}
          />
          <InputRange
            label="Rest:"
            value={draftRest}
            min={1}
            max={30}
            step={1}
            valueLabelFunction={(value) => `${value}min`}
            handleValueChange={setDraftRest}
          />
          <InputRange
            label="Long break:"
            value={draftLongRest}
            min={5}
            max={45}
            step={1}
            valueLabelFunction={(value) => `${value}min`}
            handleValueChange={setDraftLongRest}
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
            valueLabelFunction={(value) => `${Math.round(value * 100)}%`}
            handleValueChange={onVolumeChange}
          />
        </div>
      </section>

      <section className="config-section">
        <div className="config-cycles">
          <TimerIcon size={16} aria-hidden="true" />
          <span>Ciclos concluídos: {cycleCount}</span>
          <button
            type="button"
            className="config-cycles-reset"
            onClick={onResetCycles}
          >
            zerar
          </button>
        </div>
      </section>

      <div className="config-footer">
        <Button
          variant="default"
          icon={RotateCcw}
          onClick={resetDefaults}
          ariaLabel="Restaurar padrões"
        />
        <Button
          variant="default"
          icon={isMuted ? VolumeX : Volume2}
          onClick={onToggleMute}
          ariaLabel={isMuted ? "Desmutar" : "Mutar"}
        />
        <Button
          variant="primary"
          icon={Check}
          onClick={applyDraft}
          ariaLabel="Salvar tempos"
        />
      </div>
    </div>
  );
};

export default Config;
