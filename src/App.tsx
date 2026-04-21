import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clickSound from "./assets/click.wav";
import Button from "./components/Button";
import CircularProgressBar from "./components/CircularProgressBar";
import Config, {
  DEFAULT_LONG_REST_TIME,
  DEFAULT_POMODORO_TIME,
  DEFAULT_REST_TIME,
  type TimerConfig,
} from "./components/Config";
import { CUSTOM_SOUND_ID } from "./components/SoundPicker";
import Tab from "./components/Tab";
import Timer from "./components/Timer";
import Title from "./components/Title";
import { DEFAULT_SOUND_ID, findSound } from "./data/sounds";
import { useInterval } from "./hooks/useInterval";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AudioPlayer, type AmbientPlayer } from "./utils/AudioPlayer.class";
import {
  YouTubeAudioPlayer,
  extractYouTubeVideoId,
} from "./utils/YouTubeAudioPlayer.class";
import "./App.css";

const CYCLES_BEFORE_LONG_BREAK = 4;

function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function App() {
  const [pomodoroTime, setPomodoroTime] = useLocalStorage(
    "pomodoroTime",
    DEFAULT_POMODORO_TIME
  );
  const [restTime, setRestTime] = useLocalStorage("restTime", DEFAULT_REST_TIME);
  const [longRestTime, setLongRestTime] = useLocalStorage(
    "longRestTime",
    DEFAULT_LONG_REST_TIME
  );
  const [volume, setVolume] = useLocalStorage("volume", 0.5);
  const [isMuted, setIsMuted] = useLocalStorage("muted", false);
  const [selectedSoundId, setSelectedSoundId] = useLocalStorage(
    "selectedSoundId",
    DEFAULT_SOUND_ID
  );
  const [customSoundUrl, setCustomSoundUrl] = useLocalStorage(
    "customSoundUrl",
    ""
  );
  const [cycleCount, setCycleCount] = useLocalStorage("cycleCount", 0);

  const [isOn, setIsOn] = useState(false);
  const [onFocus, setOnFocus] = useState(true);
  const [isLongBreakActive, setIsLongBreakActive] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(() => pomodoroTime * 60);

  const getCurrentDuration = useCallback((): number => {
    if (onFocus) return pomodoroTime * 60;
    return (isLongBreakActive ? longRestTime : restTime) * 60;
  }, [onFocus, isLongBreakActive, pomodoroTime, restTime, longRestTime]);

  // When mode or durations change, reset countdown to the new duration.
  useEffect(() => {
    setTime(getCurrentDuration());
  }, [getCurrentDuration]);

  const totalDuration = getCurrentDuration();
  const percentComplete = useMemo(() => {
    if (totalDuration <= 0) return 0;
    return ((totalDuration - time) / totalDuration) * 100;
  }, [time, totalDuration]);

  // Audio players
  const clickPlayerRef = useRef<AudioPlayer | null>(null);
  const ambientPlayerRef = useRef<AmbientPlayer | null>(null);
  const isOnRef = useRef(isOn);
  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    const player = new AudioPlayer("audio-toggle", clickSound);
    player.setVolume(volume);
    player.setMuted(isMuted);
    clickPlayerRef.current = player;
    return () => {
      player.destroy();
      clickPlayerRef.current = null;
    };
    // Run once; volume/mute sync handled in dedicated effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let next: AmbientPlayer | null = null;

    if (selectedSoundId === CUSTOM_SOUND_ID && customSoundUrl) {
      const ytId = extractYouTubeVideoId(customSoundUrl);
      next = ytId
        ? new YouTubeAudioPlayer(ytId)
        : new AudioPlayer("audio-background", customSoundUrl, true);
    } else {
      const sound = findSound(selectedSoundId);
      if (sound?.src) {
        next = new AudioPlayer("audio-background", sound.src, true);
      }
    }

    if (next) {
      next.setVolume(volume);
      next.setMuted(isMuted);
      if (isOnRef.current) next.play();
    }

    ambientPlayerRef.current = next;

    return () => {
      next?.destroy();
      if (ambientPlayerRef.current === next) ambientPlayerRef.current = null;
    };
    // Volume/mute/isOn propagate via other effects; re-creating on every
    // toggle would make audio glitch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSoundId, customSoundUrl]);

  useEffect(() => {
    clickPlayerRef.current?.setVolume(volume);
    ambientPlayerRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    clickPlayerRef.current?.setMuted(isMuted);
    ambientPlayerRef.current?.setMuted(isMuted);
  }, [isMuted]);

  const advanceMode = useCallback(() => {
    ambientPlayerRef.current?.pause();
    setIsOn(false);
    if (onFocus) {
      const nextCount = cycleCount + 1;
      setCycleCount(nextCount);
      setIsLongBreakActive(nextCount % CYCLES_BEFORE_LONG_BREAK === 0);
    } else {
      setIsLongBreakActive(false);
    }
    setOnFocus((prev) => !prev);
  }, [onFocus, cycleCount, setCycleCount]);

  useInterval(
    () => {
      setTime((prev) => {
        if (prev <= 1) {
          clickPlayerRef.current?.play();
          advanceMode();
          return 0;
        }
        return prev - 1;
      });
    },
    isOn ? 1000 : null
  );

  useEffect(() => {
    if (!isOn) {
      document.title = "Easy Focus";
      return;
    }
    const mode = onFocus
      ? "Focus"
      : isLongBreakActive
      ? "Long break"
      : "Rest";
    document.title = `${formatTime(time)} · ${mode}`;
  }, [isOn, onFocus, isLongBreakActive, time]);

  useEffect(
    () => () => {
      document.title = "Easy Focus";
    },
    []
  );

  const handleToggle = useCallback(() => {
    clickPlayerRef.current?.play();
    setIsOn((prev) => {
      const next = !prev;
      if (next) ambientPlayerRef.current?.play();
      else ambientPlayerRef.current?.pause();
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    clickPlayerRef.current?.play();
    ambientPlayerRef.current?.pause();
    setIsOn(false);
    setTime(getCurrentDuration());
  }, [getCurrentDuration]);

  const handleNext = useCallback(() => {
    clickPlayerRef.current?.play();
    advanceMode();
  }, [advanceMode]);

  const handleSaveTimers = useCallback(
    (cfg: TimerConfig, closeTab: boolean) => {
      ambientPlayerRef.current?.pause();
      setIsOn(false);
      setPomodoroTime(cfg.pomodoroTime);
      setRestTime(cfg.restTime);
      setLongRestTime(cfg.longRestTime);
      if (closeTab) setActiveTab(0);
    },
    [setPomodoroTime, setRestTime, setLongRestTime]
  );

  const handleSelectSound = useCallback(
    (soundId: string) => setSelectedSoundId(soundId),
    [setSelectedSoundId]
  );

  const handleApplyCustomUrl = useCallback(
    (url: string) => {
      setCustomSoundUrl(url);
      setSelectedSoundId(CUSTOM_SOUND_ID);
    },
    [setCustomSoundUrl, setSelectedSoundId]
  );

  const shortcuts = useMemo(
    () => ({
      " ": handleToggle,
      r: handleReset,
      n: handleNext,
    }),
    [handleToggle, handleReset, handleNext]
  );
  useKeyboardShortcuts(shortcuts);

  const modeLabel = onFocus
    ? "Focus"
    : isLongBreakActive
    ? "Long break"
    : "Rest";
  const modeClass = onFocus ? "focus" : isLongBreakActive ? "long-rest" : "rest";
  const filledDots = cycleCount % CYCLES_BEFORE_LONG_BREAK;

  return (
    <main className="app">
      <header className="app-header">
        <Title />
      </header>

      <section className="app-card">
        <Tab
          tabs={["Pomodoro", "Config"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="app-card-content">
          {activeTab === 0 ? (
            <div className="pomodoro">
              <div className={`pomodoro-mode pomodoro-mode--${modeClass}`}>
                <span
                  className={`pomodoro-mode-dot${isOn ? " is-pulsing" : ""}`}
                  aria-hidden="true"
                />
                <span className="pomodoro-mode-label">{modeLabel}</span>
              </div>

              <div
                className={`pomodoro-timer pomodoro-timer--${modeClass}${
                  isOn ? " is-running" : ""
                }`}
              >
                <CircularProgressBar percent={percentComplete} size={300}>
                  <Timer time={time} size={300} />
                </CircularProgressBar>
              </div>

              <div
                className="pomodoro-cycles"
                aria-label={`Ciclos: ${filledDots} de ${CYCLES_BEFORE_LONG_BREAK}`}
              >
                {Array.from({ length: CYCLES_BEFORE_LONG_BREAK }).map((_, i) => (
                  <span
                    key={i}
                    className={`pomodoro-cycles-dot${
                      i < filledDots ? " is-filled" : ""
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="pomodoro-controls">
                <Button
                  variant="default"
                  icon={RotateCcw}
                  onClick={handleReset}
                  ariaLabel="Resetar"
                />
                <Button
                  variant="primary"
                  icon={isOn ? Pause : Play}
                  onClick={handleToggle}
                  ariaLabel={isOn ? "Pausar" : "Iniciar"}
                />
                <Button
                  variant="default"
                  icon={SkipForward}
                  onClick={handleNext}
                  ariaLabel="Pular"
                />
              </div>

              <div className="pomodoro-shortcuts" aria-hidden="true">
                <kbd>Space</kbd>
                <span>iniciar</span>
                <span className="dot-separator">·</span>
                <kbd>R</kbd>
                <span>reset</span>
                <span className="dot-separator">·</span>
                <kbd>N</kbd>
                <span>pular</span>
              </div>
            </div>
          ) : (
            <Config
              pomodoroTime={pomodoroTime}
              restTime={restTime}
              longRestTime={longRestTime}
              volume={volume}
              isMuted={isMuted}
              cycleCount={cycleCount}
              selectedSoundId={selectedSoundId}
              customSoundUrl={customSoundUrl}
              onSaveTimers={handleSaveTimers}
              onVolumeChange={setVolume}
              onToggleMute={() => setIsMuted((m) => !m)}
              onResetCycles={() => setCycleCount(0)}
              onSelectSound={handleSelectSound}
              onApplyCustomUrl={handleApplyCustomUrl}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
