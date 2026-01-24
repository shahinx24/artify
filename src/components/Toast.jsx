import "./style/toast.css";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
}