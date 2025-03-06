"use client";
export default function SubmitButton({ children, submitFn, className }) {
  return (
    <button className={className} type="button" onClick={submitFn}>
      {children}
    </button>
  );
}
