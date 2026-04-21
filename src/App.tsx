import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import toggle from "./assets/click.wav";
import Button from "./components/Button";
import CircularProgressBar from "./components/CircularProgressBar";
import Config from "./components/Config";
import { CUSTOM_SOUND_ID } from "./components/SoundPicker";
import Tab from "./components/Tab";
import Timer from "./components/Timer";
import Title from "./components/Title";
import { DEFAULT_SOUND_ID, findSound } from "./data/sounds";
import useInterval from "./hooks/useInterval";
import { AudioPlayer, type AmbientPlayer } from "./utils/AudioPlayer.class";
import {
  YouTubeAudioPlayer,
  extractYouTubeVideoId,
} from "./utils/YouTubeAudioPlayer.class";

const POMODORO_TIME = 25;
const REST_TIME = 5;

function App() {
  const [isOn, setIsOn] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_TIME);
  const [restTime, setRestTime] = useState(REST_TIME);
  const [percentComplete, setPercentComplete] = useState(0);
  const [time, setTime] = useState(pomodoroTime * 60);
  const [onFocus, setOnFocus] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSoundId, setSelectedSoundId] = useState(DEFAULT_SOUND_ID);
  const [customSoundUrl, setCustomSoundUrl] = useState("");

  const toggleAudioRef = useRef<AudioPlayer | null>(null);
  const ambientPlayerRef = useRef<AmbientPlayer | null>(null);
  const isOnRef = useRef(isOn);
  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    toggleAudioRef.current = new AudioPlayer("audio-toggle", toggle);
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

    if (next && isOnRef.current) next.play();
    ambientPlayerRef.current = next;

    return () => {
      next?.destroy();
      if (ambientPlayerRef.current === next) ambientPlayerRef.current = null;
    };
  }, [selectedSoundId, customSoundUrl]);

  const getInitialTime = useCallback(
    () => (onFocus ? pomodoroTime : restTime) * 60,
    [onFocus, pomodoroTime, restTime]
  );

  const playAudios = useCallback((playing: boolean) => {
    toggleAudioRef.current?.play();
    if (playing) ambientPlayerRef.current?.play();
    else ambientPlayerRef.current?.pause();
  }, []);

  const handleReset = useCallback(() => {
    setIsOn(false);
    setTime(getInitialTime());
    setPercentComplete(0);
  }, [getInitialTime]);

  useInterval(
    () => {
      setTime((prevTime) => {
        const remainingTime = prevTime - 1;
        setPercentComplete(
          ((getInitialTime() - remainingTime) / getInitialTime()) * 100
        );
        if (prevTime === 0) {
          setIsOn(false);
          setOnFocus((prev) => !prev);
          playAudios(false);
          return getInitialTime();
        }
        return remainingTime;
      });
    },
    isOn ? 1000 : null
  );

  useEffect(() => {
    handleReset();
  }, [onFocus, pomodoroTime, restTime, handleReset]);

  const handleToggle = () => {
    setIsOn((prev) => {
      playAudios(!prev);
      return !prev;
    });
  };

  const handleNext = () => {
    setOnFocus((prev) => {
      playAudios(false);
      return !prev;
    });
  };

  const handleApplyCustomUrl = useCallback((url: string) => {
    setCustomSoundUrl(url);
    setSelectedSoundId(CUSTOM_SOUND_ID);
  }, []);

  const modeLabel = onFocus ? "Focus" : "Rest";
  const modeClass = onFocus ? "focus" : "rest";

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

              <div className="pomodoro-controls">
                <Button
                  variant="default"
                  icon={RotateCcw}
                  onClick={() => {
                    handleReset();
                    playAudios(false);
                  }}
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
            </div>
          ) : (
            <Config
              initialPomodoroTime={pomodoroTime}
              initialRestTime={restTime}
              selectedSoundId={selectedSoundId}
              customSoundUrl={customSoundUrl}
              setConfig={(newPomodoro, newRest, isResetting) => {
                playAudios(false);
                setIsOn(false);
                setPomodoroTime(newPomodoro);
                setRestTime(newRest);
                if (!isResetting) setActiveTab(0);
              }}
              onSelectSound={setSelectedSoundId}
              onApplyCustomUrl={handleApplyCustomUrl}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
