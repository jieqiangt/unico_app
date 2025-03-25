export default function TextInput({
  children,
  inputName,
  inputValue,
  onChangeHandler,
  fieldClassName,
}) {
  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="text"
        id={inputName}
        name={inputName}
        value={inputValue ?? ""}
        onChange={onChangeHandler}
      />
    </div>
  );
}
