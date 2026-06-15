import { ReactNode, useEffect, useRef, useCallback, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariants, backdropVariants, useReducedMotion } from '../../lib/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

// Focus trap: get all focusable elements inside a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap — Tab/Shift+Tab cycles within modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = getFocusableElements(modalRef.current);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // Focus first element when modal opens
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = getFocusableElements(modalRef.current);
    if (focusable.length > 0) {
      // Small delay to allow AnimatePresence to mount
      requestAnimationFrame(() => focusable[0].focus());
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={!isOpen}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            variants={shouldReduceMotion ? {} : backdropVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : 'exit'}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={[
              'relative z-10 w-full bg-surface-raised rounded-card overflow-hidden',
              'max-h-[90vh] overflow-y-auto',
              sizeClasses[size],
            ].join(' ')}
            variants={shouldReduceMotion ? {} : modalVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : 'exit'}
            onKeyDown={handleKeyDown}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2
                id={titleId}
                className="font-display text-xl font-semibold text-primary"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className={[
                  'flex items-center justify-center h-8 w-8 rounded-input text-secondary',
                  'hover:text-primary hover:bg-surface transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised',
                ].join(' ')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
