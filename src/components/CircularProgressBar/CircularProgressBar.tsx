import type { ReactNode } from "react";
import "./CircularProgressBar.css";

interface CircularProgressBarProps {
  percent: number;
  size: number;
  children?: ReactNode;
}

const CircularProgressBar = ({
  percent,
  size,
  children,
}: CircularProgressBarProps) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg
      data-testid="circular-progress"
      className="circular-progress"
      width={size}
      height={size}
    >
      {children}
      <circle
        className="circular-progress-circle"
        data-testid="circular-progress-circle"
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

export default CircularProgressBar;
