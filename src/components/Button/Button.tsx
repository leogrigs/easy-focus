import type { LucideIcon } from "lucide-react";
import "./Button.css";

interface ButtonProps {
  icon: LucideIcon;
  className?: string;
  onClick: () => void;
  ariaLabel?: string;
  variant?: "default" | "primary";
}

const Button = ({
  icon: Icon,
  className = "",
  onClick,
  ariaLabel,
  variant = "default",
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`button button--${variant}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon data-testid="button-icon" className={className} />
    </button>
  );
};

export default Button;
