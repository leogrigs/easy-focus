import "./timer.css";

export default function Timer({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <span className="counter">{`${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`}</span>
  );
}
