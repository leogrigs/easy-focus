/* eslint-disable react-hooks/exhaustive-deps */
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/button/button";
import Input from "./components/input-number/input-number";
import Timer from "./components/timer/timer";
import Title from "./components/title/title";
import sound from "./assets/click.wav";

// TODO: unit test
// TODO: input validations

const POMODORO_TIME = 20;
const REST_TIME = 5;

function App() {
  const [isOn, setIsOn] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_TIME);
  const [restTime, setRestTime] = useState(REST_TIME);
  const [time, setTime] = useState(pomodoroTime);
  const [onFocus, setOnFocus] = useState(true);

  useEffect(() => {
    if (isOn) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            setIsOn(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOn]);

  useEffect(() => {
    handleReset();
  }, [onFocus, pomodoroTime, restTime]);

  const handleToggle = () => {
    const audio = new Audio(sound)
    audio.play();
    setIsOn((isOn) => !isOn);
  };

  const handleReset = () => {
    setIsOn(false);
    setTime(getInitialTime());
  };

  const getInitialTime = () => {
    return (onFocus ? pomodoroTime : restTime) * 60;
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
