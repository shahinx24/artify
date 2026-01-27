export default function AuthSwitch({ text, actionText, onClick }) {
  return (
    <p onClick={onClick}>
      {text} <b>{actionText}</b>
    </p>
  );
}