export default function Custominput({ label, inputType, onChange, className }) {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      <input
        className={className}
        type={inputType}
        name={label}
        id={label}
        onChange={onChange}
      />
    </>
  );
}
