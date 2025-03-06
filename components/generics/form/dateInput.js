export default function DateInput({
  children,
  inputName,
  inputValue,
  fieldClassName,
}) {
  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="date"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
      />
    </div>
  );
}
