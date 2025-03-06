import classes from "@/components/generics/generics.module.scss";

export default function FixedInput({
  children,
  inputName,
  inputValue,
  onChange,
  fieldClassName,
}) {
  return (
    <div className={`${fieldClassName} ${classes["readOnlyField"]}`}>
      <label htmlFor={inputName}>{children}</label>
      <input
        type="text"
        id={inputName}
        name={inputName}
        defaultValue={inputValue}
        onChange={onChange}
        readOnly
      />
    </div>
  );
}
