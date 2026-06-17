import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../lib/motion';
import { Spinner } from './Spinner';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-accent text-canvas font-semibold hover:bg-accent-hover active:bg-accent',
  secondary: 'bg-surface-raised text-primary border border-border hover:border-accent',
  ghost:     'bg-transparent text-secondary hover:text-primary',
  danger:    'bg-error/10 text-error border border-error/30 hover:bg-error/20',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-[44px] px-3 py-2 text-sm',
  md: 'min-h-[44px] px-4 py-2.5 text-sm',
  lg: 'min-h-[44px] px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  children,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading ? true : undefined}
      aria-disabled={isDisabled ? true : undefined}
      whileTap={shouldReduceMotion || isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-input font-body',
        'transition-colors duration-150 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </motion.button>
  );
}
