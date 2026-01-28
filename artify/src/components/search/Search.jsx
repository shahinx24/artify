import "./search.css";

export default function Search({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
