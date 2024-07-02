import PropTypes from "prop-types";
import "./InputRange.css";

const InputRange = ({
  label,
  value,
  min,
  max,
  step,
  valueLabelFunction,
  handleValueChange,
}) => {
  return (
    <div className="input-range">
      <label className="input-range-label">{label}</label>
      <input
        type="range"
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

InputRange.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  valueLabelFunction: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
};

export default InputRange;
