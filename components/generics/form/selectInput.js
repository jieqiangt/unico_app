export default function SelectInput({
  children,
  inputName,
  options,
  selectedValue,
  onChangeHandler,
  fieldClassName,
  defaultOptionText,
}) {
  const selectOptions = options.map((option) => {
    return (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    );
  });

  selectOptions.unshift(
    <option key="defaultValue" value="" disabled hidden>
      {defaultOptionText}
    </option>
  );

  return (
    <div className={fieldClassName}>
      <label htmlFor={inputName}>{children}</label>
      {selectedValue ? (
        <select
          id={inputName}
          name={inputName}
          value={selectedValue}
          onChange={onChangeHandler}
        >
          {selectOptions}
        </select>
      ) : (
        <select
          id={inputName}
          name={inputName}
          defaultValue=""
          onChange={onChangeHandler}
        >
          {selectOptions}
        </select>
      )}
    </div>
  );
}
