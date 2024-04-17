import { Clock } from "lucide-react";
import "./title.css";

export default function Title() {
    const label = 'EASY FOCUS'

  return (
    <div className="title-container">
      <Clock size={48} />
      <h1 className="title">{label}</h1>
    </div>
  );
}
