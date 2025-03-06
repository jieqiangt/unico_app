export default function DateTimeInput({
  children,
  inputName,
  inputValue,
  fieldClassName,
}) {
  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="datetime-local"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
        min="2025-01-01T00:00"
        max="2027-12-31T00:00"
      />
    </div>
  );
}
