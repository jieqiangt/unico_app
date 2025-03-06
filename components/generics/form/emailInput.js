export default function EmailInput({
  children,
  inputName,
  inputValue,
  onChange,
  fieldClassName,
  required
}) {
  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="email"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
