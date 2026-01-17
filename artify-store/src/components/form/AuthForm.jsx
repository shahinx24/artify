export default function AuthForm({
  title,
  fields,
  buttonText,
  onSubmit,
  onChange,
}) {
  return (
    <>
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        {fields.map(field => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={onChange}
          />
        ))}
        <button type="submit">{buttonText}</button>
      </form>
    </>
  );
}