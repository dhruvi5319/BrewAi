import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g., clearFilters resets to '')
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear previous debounce timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Set new 200ms debounce timer
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 200);
  };

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder ?? 'Search drinks\u2026'}
        aria-label="Search drinks"
        className={[
          'w-full pl-10 pr-4 py-3',
          'bg-surface border border-border rounded-input',
          'text-primary placeholder:text-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'transition-colors duration-150 ease-in-out',
          'hover:border-border-hover',
        ].join(' ')}
      />
    </div>
  );
}
