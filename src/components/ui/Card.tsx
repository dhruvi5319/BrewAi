import { ReactNode } from 'react';

export interface CardProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function Card({ className = '', onClick, children }: CardProps) {
  const isInteractive = onClick !== undefined;

  return (
    <div
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={[
        'bg-surface border border-border rounded-card p-4',
        isInteractive
          ? 'cursor-pointer hover:border-border-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
