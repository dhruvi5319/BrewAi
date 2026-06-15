import { ChangeEvent } from 'react';

export interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function Input({
  label,
  error,
  placeholder,
  value,
  onChange,
  maxLength,
  type = 'text',
  id,
  className = '',
  disabled = false,
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={[
          'w-full rounded-input border bg-surface px-3 py-2.5 font-body text-sm text-primary',
          'placeholder:text-tertiary',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          error ? 'border-error' : 'border-border hover:border-border-hover',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          'min-h-[44px]',
        ].join(' ')}
      />
      {error && (
        <span className="font-body text-xs text-error">{error}</span>
      )}
    </div>
  );
}
