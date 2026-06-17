export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  label,
  options,
  value,
  onChange,
  id,
  className = '',
  disabled = false,
}: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      {label && (
        <label
          htmlFor={selectId}
          className="font-body text-sm font-medium text-primary"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          'w-full rounded-input border border-border bg-surface px-3 py-2.5',
          'font-body text-sm text-primary',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'hover:border-border-hover',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          'min-h-[44px]',
          'appearance-none',
        ].join(' ')}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-raised text-primary">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
