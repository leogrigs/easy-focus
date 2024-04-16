import "./button.css";

export default function Button({ label, icon: Icon, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      <Icon size={48} />
    </button>
  );
}
