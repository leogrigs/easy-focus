import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";
import Button from "./components/button/button";
import Timer from "./components/timer/timer";
import Title from "./components/title/title";

const POMODORO_TIME = 20;
const REST_TIME = 5;

function App() {
  const [isOn, setIsOn] = useState(false);
  const [time, setTime] = useState(POMODORO_TIME);
  const [onFocus, setOnFocus] = useState(true);
  const label = isOn ? "Stop" : "Start";

  useEffect(() => {
    if (isOn) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          console.log("interval");
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
  }, [onFocus]);

  const handleToggle = () => {
    setIsOn((isOn) => !isOn);
  };

  const handleReset = () => {
    setIsOn(false);
    setTime(getInitialTime());
  };

  const getInitialTime = () => {
    return (onFocus ? POMODORO_TIME : REST_TIME) * 60;
  };

  const handleNext = () => {
    setOnFocus((onFocus) => !onFocus);
  };

  const getBackgroundColor = (transparency) => {
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
            label={label}
            icon={isOn ? Pause : Play}
            onClick={handleToggle}
          />
          <Button label={"Reset"} icon={RotateCcw} onClick={handleReset} />
          <Button icon={SkipForward} onClick={handleNext} />
        </div>
      </div>
    </main>
  );
}

export default App;
