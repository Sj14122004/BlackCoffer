const FilterSelect = ({
  label,
  icon,
  placeholder,
  options = [],
  value = "",
  onChange,
}) => {
  return (
    <div>
      <label className="form-label small fw-semibold d-flex align-items-center gap-2">
        {icon}
        {label}
      </label>

      <select
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;