import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from './lib/motion';
import { pageVariants } from './lib/motion';
import { MenuPage } from './pages/MenuPage';

function ConfirmationPlaceholder() {
  return (
    <div className="min-h-screen bg-canvas text-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-accent mb-4">Order Confirmed</h1>
        <p className="font-body text-secondary">Confirmation page coming in Phase 4</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={shouldReduceMotion ? {} : pageVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        exit={shouldReduceMotion ? undefined : 'exit'}
      >
        <Routes location={location}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/confirmation" element={<ConfirmationPlaceholder />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
