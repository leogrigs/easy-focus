import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import toggle from "./assets/click.wav";
import background from "./assets/focus-background.mp3";
import Button from "./components/Button";
import CircularProgressBar from "./components/CircularProgressBar";
import Config from "./components/Config/Config";
import Tab from "./components/Tab";
import Timer from "./components/Timer";
import Title from "./components/Title";
import useInterval from "./hooks/useInterval";
import { AudioPlayer } from "./utils/AudioPlayer.class";

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

  const toggleAudioRef = useRef<AudioPlayer | null>(null);
  const backgroundAudioRef = useRef<AudioPlayer | null>(null);

  const tabs = ["Pomodoro", "Config"];

  useEffect(() => {
    toggleAudioRef.current = new AudioPlayer("audio-toggle", toggle);
    backgroundAudioRef.current = new AudioPlayer(
      "audio-background",
      background,
      true
    );
  }, []);

  const getInitialTime = useCallback(() => {
    return (onFocus ? pomodoroTime : restTime) * 60;
  }, [onFocus, pomodoroTime, restTime]);

  const playAudios = useCallback((playing: boolean) => {
    if (toggleAudioRef.current && backgroundAudioRef.current) {
      toggleAudioRef.current.play();
      if (playing) {
        backgroundAudioRef.current.play();
      } else {
        backgroundAudioRef.current.pause();
      }
    }
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
          const nextFocus = !onFocus;
          setIsOn(false);
          setOnFocus(nextFocus);
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

  return (
    <main>
      <div className="title">
        <Title />
      </div>
      <div className="container">
        <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="container-content">
          {activeTab === 0 && (
            <>
              <div className="container-feedback">
                <span
                  style={{
                    color: isOn ? (onFocus ? "#ea3737" : "#4abdfc") : "#52ec2f",
                    backgroundColor: isOn
                      ? onFocus
                        ? "#ea37372e"
                        : "#4abdfc2e"
                      : "#52ec2f2e",
                  }}
                >
                  {onFocus ? "Focus" : "Rest"}
                </span>
              </div>

              <div className="container-timer">
                <CircularProgressBar percent={percentComplete} size={300}>
                  <Timer time={time} size={300} />
                </CircularProgressBar>
              </div>

              <div className="container-button">
                <Button
                  className="button--icon"
                  icon={isOn ? Pause : Play}
                  onClick={handleToggle}
                />
                <Button
                  className="button--icon"
                  icon={RotateCcw}
                  onClick={() => {
                    handleReset();
                    playAudios(false);
                  }}
                />
                <Button
                  className="button--icon"
                  icon={SkipForward}
                  onClick={handleNext}
                />
              </div>
            </>
          )}

          {activeTab === 1 && (
            <div className="container-config">
              <Config
                initialPomodoroTime={pomodoroTime}
                initialRestTime={restTime}
                setConfig={(newPomodoroTime, newRestTime, isReseting) => {
                  playAudios(false);
                  setIsOn(false);
                  setPomodoroTime(newPomodoroTime);
                  setRestTime(newRestTime);
                  if (!isReseting) setActiveTab(0);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
