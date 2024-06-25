import "./Timer.css";
import PropTypes from "prop-types";

const Timer = ({ time }) => {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <span className="counter">
      {minutes}:{seconds}
    </span>
  );
};

Timer.propTypes = {
  time: PropTypes.number.isRequired,
};

export default Timer;
