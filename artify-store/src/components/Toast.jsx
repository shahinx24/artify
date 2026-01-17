export default function Toast({ message }) {
  if (!message) return null;
  

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "#111",
        color: "#fff",
        padding: "14px 20px",
        borderRadius: "8px",
        fontSize: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 3000,
        animation: "fadein .3s, fadeout .3s 2.2s"
      }}
    >
      {message}
      <style>
        {`
          @keyframes fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0);} }
          @keyframes fadeout { from { opacity: 1;} to { opacity: 0;} }
        `}
      </style>
    </div>
  );
}
