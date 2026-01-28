import "./productFilter.css";

export default function ProductFilter({
  search,
  setSearch,
  category,
  setCategory,
  categories
}) {
  return (
    <div className="admin-filter">
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
