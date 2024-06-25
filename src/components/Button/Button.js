import "./Button.css";

export default function Button({ label, icon: Icon, className, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      <Icon className={className} />
    </button>
  );
}
