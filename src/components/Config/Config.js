import { PropTypes } from "prop-types";
import InputRange from "../InputRange";
import React from "react";
import { useState } from "react";

const Config = ({ initialPomodoroTime, initialRestTime, setConfig }) => {
  const [pomodoroTime, setPomodoroTime] = useState(initialPomodoroTime);
  const [restTime, setRestTime] = useState(initialRestTime);

  const resetConfig = () => {
    const _pomodoroTime = Config.defaultProps.initialPomodoroTime;
    const _restTime = Config.defaultProps.initialRestTime;
    setPomodoroTime(_pomodoroTime);
    setRestTime(_restTime);
    setConfig(_pomodoroTime, _restTime);
  };

  return (
    <div>
      {/* Inputs */}
      <div>
        <InputRange
          label="Focus"
          value={pomodoroTime}
          defaultValue={pomodoroTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={(value) => setPomodoroTime(value)}
        />

        <InputRange
          label="Rest"
          value={restTime}
          defaultValue={restTime}
          min={1}
          max={60}
          step={1}
          valueLabelFunction={(value) => `${value}min`}
          handleValueChange={(value) => setRestTime(value)}
        />
      </div>

      {/* Buttons */}
      <div>
        <button onClick={() => setConfig(pomodoroTime, restTime)}>Save</button>
        <button onClick={resetConfig}>Reset</button>
      </div>
    </div>
  );
};

Config.propTypes = {
  setConfig: PropTypes.func.isRequired,
  resetConfig: PropTypes.func.isRequired,
};

Config.defaultProps = {
  initialPomodoroTime: 25,
  initialRestTime: 5,
};

export default Config;
