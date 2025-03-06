export default function ErrorMsgs({ errors }) {
  return (
    <ul>
      {Object.keys(errors).map((key) => {
        return <li key={key}>{errors[key]}</li>;
      })}
    </ul>
  );
}
