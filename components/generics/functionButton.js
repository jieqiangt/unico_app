export default function FunctionButton({ children, className, onClickFn }) {
  return (
    <button type="button" className={className} onClick={onClickFn}>
      {children}
    </button>
  );
}
