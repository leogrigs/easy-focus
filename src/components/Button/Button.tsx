import type { LucideIcon } from "lucide-react";
import "./Button.css";

interface ButtonProps {
  icon: LucideIcon;
  className?: string;
  onClick: () => void;
}

const Button = ({ icon: Icon, className = "", onClick }: ButtonProps) => {
  return (
    <button type="button" className="button" onClick={onClick}>
      <Icon data-testid="button-icon" className={className} />
    </button>
  );
};

export default Button;
