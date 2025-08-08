export interface TextSelectorProps {
  value: string;
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabledOptionText?: string;
  options: string[];
  disabled?: boolean;
}

export default function TextSelector(props: TextSelectorProps) {
  const {
    value,
    label,
    id,
    onChange,
    disabledOptionText,
    options = [],
    disabled = false,
  } = props;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="rounded-lg bg-blue-900 border text-white border-gray-300 shadow-sm focus:ring-primary focus:border-primary p-2"
      >
        {disabledOptionText && (
          <option value="" disabled>
            {disabledOptionText}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "*" : option}
          </option>
        ))}
      </select>
    </div>
  );
}
