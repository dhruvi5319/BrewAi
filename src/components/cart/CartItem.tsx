import { Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem as CartItemType, CartItemCustomizations } from '../../types/index';

function buildSummary(customizations: CartItemCustomizations): string {
  const parts: string[] = [];
  if (customizations.size) parts.push(customizations.size);
  if (customizations.milk) parts.push(customizations.milk);
  if (customizations.temperature) parts.push(customizations.temperature);
  if (customizations.shots) parts.push(customizations.shots);
  if (customizations.addons.length > 0) parts.push(customizations.addons.join(', '));
  return parts.join(' · ');
}

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const summary = buildSummary(item.customizations);
  const lineTotal = (item.unitPrice * item.quantity).toFixed(2);

  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-display text-primary truncate">{item.name}</p>
        {summary && (
          <p className="text-secondary text-sm mt-0.5 truncate">{summary}</p>
        )}
        <p className="text-accent text-sm mt-1">${lineTotal}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() =>
            item.quantity === 1
              ? removeItem(item.cartItemId)
              : updateQuantity(item.cartItemId, item.quantity - 1)
          }
          aria-label={`Decrease quantity for ${item.name}`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-border hover:border-accent text-primary"
        >
          −
        </button>
        <span className="w-6 text-center text-primary text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          disabled={item.quantity >= 10}
          aria-label={`Increase quantity for ${item.name}`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-border hover:border-accent text-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.cartItemId)}
          aria-label={`Remove ${item.name} from cart`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary hover:text-error ml-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
