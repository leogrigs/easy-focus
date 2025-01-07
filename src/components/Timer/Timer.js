import "./Timer.css";
import PropTypes from "prop-types";

const Timer = ({ time, size }) => {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <text
      className="counter"
      x={size / 2}
      y={-size / 2}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {minutes}:{seconds}
    </text>
  );
};

Timer.propTypes = {
  time: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

export default Timer;
