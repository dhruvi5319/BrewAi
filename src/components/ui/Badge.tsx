import { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'accent' | 'muted' | 'success' | 'error';
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  accent:  'bg-accent/20 text-accent border border-accent/30',
  muted:   'bg-surface-raised text-secondary border border-border',
  success: 'bg-success/20 text-success border border-success/30',
  error:   'bg-error/20 text-error border border-error/30',
};

export function Badge({ variant = 'accent', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'rounded-pill font-body text-xs font-semibold',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
