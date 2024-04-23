import "./button.css";

export default function Button({ label, icon: Icon, onClick }) {
  const size = window.innerWidth < 768 ? 24 : 48

  return (
    <button className="button" onClick={onClick}>
      <Icon className="button--icon" />
    </button>
  );
}
