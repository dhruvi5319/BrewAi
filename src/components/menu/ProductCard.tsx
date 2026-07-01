import { motion } from 'framer-motion';
import { MenuItem } from '../../types/index';
import { Button, Badge } from '../ui';
import { cardVariants, useReducedMotion } from '../../lib/motion';

interface ProductCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export function ProductCard({ item, onCustomize, onAddToCart }: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : cardVariants}
      layout
    >
      <div className="flex flex-col justify-between bg-surface border border-border rounded-card p-4 min-h-[160px] hover:bg-surface-raised hover:border-border-hover transition-colors duration-150 ease-in-out">
        {/* Top section */}
        <div className="flex flex-col gap-2">
          <Badge variant="accent">{item.category}</Badge>
          <h3 className="font-display text-lg font-semibold text-primary leading-snug">
            {item.name}
          </h3>
          <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-accent font-semibold text-base">
            ${item.basePrice.toFixed(2)}
          </span>
          {item.hasCustomizations ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCustomize(item)}
            >
              Customize
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(item)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
