import "./InputRange.css";

interface InputRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabelFunction: (value: number) => string;
  handleValueChange: (value: number) => void;
}

const InputRange = ({
  label,
  value,
  min,
  max,
  step,
  valueLabelFunction,
  handleValueChange,
}: InputRangeProps) => {
  const id = `input-range-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="input-range">
      <label htmlFor={id} className="input-range-label">
        {label}
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleValueChange(parseFloat(e.target.value))}
        className="input-range-slider"
      />
      <span className="input-range-value">{valueLabelFunction(value)}</span>
    </div>
  );
};

export default InputRange;
