import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import Button from "./components/Button";
import Input from "./components/InputNumber";
import Timer from "./components/Timer";
import Title from "./components/Title";
import toggle from "./assets/click.wav";
import background from "./assets/focus-background.mp3";
import useInterval from "./hooks/useInterval";
import { AudioPlayer } from "./utils/AudioPlayer.class";

const POMODORO_TIME = 5;
const REST_TIME = 3;

function App() {
  const [isOn, setIsOn] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_TIME);
  const [restTime, setRestTime] = useState(REST_TIME);
  const [time, setTime] = useState(pomodoroTime);
  const [onFocus, setOnFocus] = useState(true);

  const toggleAudioRef = useRef(null);
  const backgroundAudioRef = useRef(null);

  useEffect(() => {
    toggleAudioRef.current = new AudioPlayer("audio-toggle", toggle);
    backgroundAudioRef.current = new AudioPlayer(
      "audio-background",
      background,
      0.1,
      true
    );
  }, []);

  const getInitialTime = useCallback(() => {
    return (onFocus ? pomodoroTime : restTime) * 60;
  }, [onFocus, pomodoroTime, restTime]);

  const handleReset = useCallback(() => {
    setIsOn(false);
    setTime(getInitialTime());
  }, [getInitialTime]);

  useInterval(
    () => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          const nextFocus = !onFocus;
          setIsOn(false);
          playAudios(false);
          setOnFocus(nextFocus);
          return getInitialTime();
        } else {
          return prevTime - 1;
        }
      });
    },
    isOn ? 1000 : null
  );

  useEffect(() => {
    handleReset();
  }, [onFocus, pomodoroTime, restTime, handleReset]);

  const handleToggle = () => {
    setIsOn((isOn) => {
      playAudios(!isOn);
      return !isOn;
    });
  };

  const playAudios = (_isOn) => {
    toggleAudioRef.current.play();
    isOn
      ? backgroundAudioRef.current.pause()
      : backgroundAudioRef.current.play();
  };

  const handleNext = () => {
    setOnFocus((onFocus) => !onFocus);
  };

  const getBackgroundColor = () => {
    return isOn ? (onFocus ? "#b82e24" : "#2b6e94") : "#2b945a";
  };

  return (
    <main style={{ backgroundColor: getBackgroundColor() }}>
      <Title />
      <div
        className="container"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <Timer time={time} />

        <div className="container-button">
          <Button
            className="button--icon"
            icon={isOn ? Pause : Play}
            onClick={handleToggle}
          />
          <Button
            className="button--icon"
            icon={RotateCcw}
            onClick={handleReset}
          />
          <Button
            className="button--icon"
            icon={SkipForward}
            onClick={handleNext}
          />
        </div>

        <div className="container-input">
          <Input
            label="Focus"
            id="focus"
            className="test"
            defaultValue={pomodoroTime}
            onSetValue={(value) => setPomodoroTime(value)}
          />
          <Input
            label="Rest"
            id="rest"
            defaultValue={restTime}
            onSetValue={(value) => {
              setRestTime(value);
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
