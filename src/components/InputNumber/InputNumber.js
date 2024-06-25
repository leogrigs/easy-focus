import { Check, X } from "lucide-react";
import { useState } from "react";
import Button from "../Button/Button";
import "./InputNumber.css";

export default function InputNumber({ id, label, defaultValue, onSetValue }) {
  const [value, setValue] = useState(defaultValue);

  const clear = () => {
    setValue(defaultValue);
  };

  return (
    <div className="input">
      <div className="input-label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="input-container">
        <input
          id={id}
          value={value}
          onInput={(e) => setValue(e.target.value)}
          type="number"
        />
      </div>
      <div className="input-button">
        <Button size={24} icon={X} onClick={clear} />
        <Button icon={Check} onClick={() => onSetValue(value)} />
      </div>
    </div>
  );
}
