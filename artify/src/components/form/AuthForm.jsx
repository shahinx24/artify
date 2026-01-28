export default function AuthForm({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  buttonText
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // parent handles login/register
  };

  return (
    <>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
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