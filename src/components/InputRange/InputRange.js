import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import "./InputRange.css";
import { Check } from "lucide-react";

const InputRange = ({
  label,
  defaultValue,
  min,
  max,
  step,
  valueLabelFunction,
  onConfirm,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleConfirmClick = () => {
    onConfirm(value);
  };

  return (
    <div className="input-range">
      <label className="input-range-label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="input-range-slider"
      />
      <span className="input-range-value">{valueLabelFunction(value)}</span>
      <Button
        icon={Check}
        onClick={handleConfirmClick}
        className="input-range-button"
      />
    </div>
  );
};

InputRange.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  valueLabelFunction: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default InputRange;
