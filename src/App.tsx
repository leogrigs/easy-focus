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
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AudioPlayer, type AmbientPlayer } from "./utils/AudioPlayer.class";
import {
  YouTubeAudioPlayer,
  extractYouTubeVideoId,
} from "./utils/YouTubeAudioPlayer.class";
import "./App.css";

const CYCLES_BEFORE_LONG_BREAK = 4;
const TICK_INTERVAL_MS = 250;

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

  // Deadline-based timer: we anchor `endsAtRef` to a wall-clock timestamp and
  // derive remaining seconds on each tick. A Web Worker drives the ticks so
  // background-tab throttling can't slow the countdown or delay the end-of-
  // cycle event. `timeRef` mirrors `time` for use inside stable callbacks.
  const endsAtRef = useRef<number | null>(null);
  const timeRef = useRef(time);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  const workerRef = useRef<Worker | null>(null);
  const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

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

  const advanceModeRef = useRef(advanceMode);
  useEffect(() => {
    advanceModeRef.current = advanceMode;
  }, [advanceMode]);

  const evaluateDeadline = useCallback(() => {
    const endsAt = endsAtRef.current;
    if (endsAt === null) return;
    const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    setTime((prev) => (prev === remaining ? prev : remaining));
    if (remaining <= 0) {
      endsAtRef.current = null;
      clickPlayerRef.current?.play();
      advanceModeRef.current();
    }
  }, []);

  // Create the Worker once. In environments where Workers are unavailable
  // (e.g., jsdom in tests), fall back to a main-thread interval — those
  // contexts don't experience background throttling anyway.
  useEffect(() => {
    let worker: Worker | null = null;
    try {
      worker = new Worker(
        new URL("./workers/timerTicker.worker.ts", import.meta.url),
        { type: "module" }
      );
      worker.onmessage = () => evaluateDeadline();
    } catch {
      worker = null;
    }
    workerRef.current = worker;
    return () => {
      worker?.terminate();
      workerRef.current = null;
    };
  }, [evaluateDeadline]);

  // Anchor / clear the deadline alongside the running state, and start/stop
  // whichever ticker is available.
  useEffect(() => {
    if (isOn) {
      endsAtRef.current = Date.now() + timeRef.current * 1000;
      const worker = workerRef.current;
      if (worker) {
        worker.postMessage({ type: "start", interval: TICK_INTERVAL_MS });
      } else {
        fallbackIntervalRef.current = setInterval(
          evaluateDeadline,
          TICK_INTERVAL_MS
        );
      }
    } else {
      endsAtRef.current = null;
      workerRef.current?.postMessage({ type: "stop" });
      if (fallbackIntervalRef.current !== null) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
    }
  }, [isOn, evaluateDeadline]);

  // Snap to the correct value the instant the tab becomes visible, instead of
  // waiting for the next worker tick to land on the main thread.
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") evaluateDeadline();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [evaluateDeadline]);

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
