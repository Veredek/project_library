const RadioInput = ({ label, value, checked, onChange }) => {
  return (
    <label>
      <input
        type="radio"
        name="filter"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default RadioInput;