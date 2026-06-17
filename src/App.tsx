import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from './lib/motion';
import { pageVariants } from './lib/motion';

// Temporary placeholder pages — replaced in Phase 2 and Phase 4
function MenuPlaceholder() {
  return (
    <div className="min-h-screen bg-canvas text-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-accent mb-4">BrewAI</h1>
        <p className="font-body text-secondary">Menu coming in Phase 2</p>
      </div>
    </div>
  );
}

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
          <Route path="/" element={<MenuPlaceholder />} />
          <Route path="/confirmation" element={<ConfirmationPlaceholder />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
