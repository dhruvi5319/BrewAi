import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from './lib/motion';
import { pageVariants } from './lib/motion';
import { MenuPage } from './pages/MenuPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { Navigation } from './components/layout/Navigation';

export default function App() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Navigation />
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
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
