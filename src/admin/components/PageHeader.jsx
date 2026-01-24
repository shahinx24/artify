export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-title">{title}</h1>
        {subtitle && (
          <p className="admin-subtitle">{subtitle}</p>
        )}
      </div>

      {right && <div className="admin-header-right">{right}</div>}
    </div>
  );
}