export default function AuthForm({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  buttonText
}) {
  return (
    <>
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        {fields.map(f => (
          <input
            key={f.name}
            type={f.type}
            name={f.name}
            placeholder={f.placeholder}
            value={values[f.name] || ""}
            onChange={onChange}
          />
        ))}
        <button type="submit">{buttonText}</button>
      </form>
    </>
  );
}