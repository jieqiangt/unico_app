export default function PasswordInput({
  children,
  inputName,
  inputValue,
  onChange,
  fieldClassName,
}) {
  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="password"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
        onChange={onChange}
        required
      />
    </div>
  );
}
