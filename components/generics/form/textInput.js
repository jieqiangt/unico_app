export default function TextInput({
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
        type="text"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
        onChange={onChange}
      />
    </div>
  );
}
