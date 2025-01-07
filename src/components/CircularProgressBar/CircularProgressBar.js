import React from "react";
import PropTypes from "prop-types";
import "./CircularProgressBar.css";

const CircularProgressBar = ({ percent, size, children }) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg className="circular-progress" width={size} height={size}>
      {children}

      <circle
        className="circular-progress-circle"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};

CircularProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

export default CircularProgressBar;
