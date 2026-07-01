import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/index';
import type { OrderResponse, OrderResponseItem } from '../types/index';

// Customization summary string builder (same format as CartDrawer)
function buildCustomizationSummary(item: OrderResponseItem): string {
  const parts: string[] = [];
  if (item.customizations.size) parts.push(item.customizations.size);
  if (item.customizations.milk) parts.push(item.customizations.milk);
  if (item.customizations.temperature) parts.push(item.customizations.temperature);
  if (item.customizations.shots) parts.push(item.customizations.shots);
  if (item.customizations.addons.length > 0) parts.push(item.customizations.addons.join(', '));
  return parts.join(' · ');
}

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as OrderResponse | undefined;

  // Redirect to / if accessed directly without order data
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface rounded-2xl p-6 sm:p-8 space-y-6">

        {/* Success icon + heading */}
        <div className="text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto" aria-hidden="true" />
          <h1
            className="font-display text-3xl text-primary"
            tabIndex={-1}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            role="status"
          >
            Order Placed!
          </h1>
        </div>

        {/* Order reference — BRW-NNNNN — Playfair Display, text-4xl, text-accent, above the fold */}
        <div className="text-center space-y-1">
          <p className="text-sm text-secondary font-body">Your order reference:</p>
          <p className="font-display text-4xl text-accent font-bold tracking-wide">
            {order.orderReference}
          </p>
          <p className="text-sm text-secondary font-body mt-1">
            Ready in approximately 15–20 minutes
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Order summary — itemized list */}
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Order Summary
          </h2>
          <ul className="space-y-3">
            {order.items.map((item) => {
              const summary = buildCustomizationSummary(item);
              const lineTotal = (item.unitPrice * item.quantity).toFixed(2);
              return (
                <li key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-body text-sm font-medium">
                      {item.name} × {item.quantity}
                    </p>
                    {summary && (
                      <p className="text-secondary text-xs mt-0.5 truncate">{summary}</p>
                    )}
                  </div>
                  <span className="text-primary text-sm font-medium whitespace-nowrap">
                    ${lineTotal}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Subtotal */}
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="font-semibold text-primary text-sm">Subtotal</span>
          <span className="font-semibold text-primary text-sm">
            ${order.subtotal.toFixed(2)}
          </span>
        </div>

        {/* Start a New Order CTA */}
        <Button
          variant="primary"
          onClick={() => navigate('/')}
          className="w-full"
          aria-label="Start a new order and return to menu"
        >
          Start a New Order
        </Button>
      </div>
    </div>
  );
}
