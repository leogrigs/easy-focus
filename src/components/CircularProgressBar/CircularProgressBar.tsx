import type { ReactNode } from "react";
import "./CircularProgressBar.css";

interface CircularProgressBarProps {
  percent: number;
  size: number;
  stroke?: string;
  children?: ReactNode;
}

const CircularProgressBar = ({
  percent,
  size,
  stroke,
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
      <circle
        className="circular-progress-track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      {children}
      <circle
        className="circular-progress-circle"
        data-testid="circular-progress-circle"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={stroke ? { stroke } : undefined}
      />
    </svg>
  );
};

export default CircularProgressBar;
