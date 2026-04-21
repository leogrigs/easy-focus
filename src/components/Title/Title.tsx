import { Clock } from "lucide-react";
import "./Title.css";

interface TitleProps {
  label?: string;
}

const Title = ({ label = "EASY FOCUS" }: TitleProps) => {
  return (
    <div className="title-container">
      <Clock className="title--icon" aria-hidden="true" />
      <h1 className="title">{label}</h1>
    </div>
  );
};

export default Title;
