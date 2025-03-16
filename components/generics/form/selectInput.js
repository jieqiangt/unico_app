export default function SelectInput({
  children,
  inputName,
  options,
  selectedValue,
  onChangeHandler,
  fieldClassName,
}) {
  const selectOptions = options.map((option) => {
    return (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    );
  });

  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      {selectedValue ? (
        <select
          name={inputName}
          defaultValue={selectedValue}
          onChange={onChangeHandler}
        >
          {selectOptions}
        </select>
      ) : (
        <select name={inputName} onChange={onChangeHandler}>
          {selectOptions}
        </select>
      )}
    </div>
  );
}
