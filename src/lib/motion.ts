import { Variants } from 'framer-motion';

// ─── Base Variants ────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 20, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
};

// ─── Card Variants (for stagger children) ────────────────────

export const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// ─── Drawer Variants (cart + mobile menu) ────────────────────

export const drawerVariantsRight: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const drawerVariantsBottom: Variants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Modal Variants ───────────────────────────────────────────

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Toast Variants ───────────────────────────────────────────

export const toastVariants: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
};

// ─── Cart Item Exit Variant ───────────────────────────────────

export const cartItemExitVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Badge Pop Variant ────────────────────────────────────────

export const badgePopVariants: Variants = {
  initial: { scale: 1 },
  pop:     { scale: [1, 1.3, 1], transition: { duration: 0.3, times: [0, 0.5, 1] } },
};

// ─── Page Transition Variants ─────────────────────────────────

export const pageVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Reduced Motion Helper ────────────────────────────────────
// Re-export useReducedMotion so components import from one place
export { useReducedMotion } from 'framer-motion';
