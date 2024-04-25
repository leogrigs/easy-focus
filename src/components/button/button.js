import "./button.css";

export default function Button({ label, icon: Icon, size , onClick }) {
  return (
    <button className="button" onClick={onClick}>
      <Icon size={size} />
    </button>
  );
}
