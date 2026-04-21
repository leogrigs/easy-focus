import "./Timer.css";

interface TimerProps {
  time: number;
  size: number;
}

const Timer = ({ time, size }: TimerProps) => {
  const safeTime = Math.max(0, time);
  const minutes = String(Math.floor(safeTime / 60)).padStart(2, "0");
  const seconds = String(safeTime % 60).padStart(2, "0");

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

export default Timer;
