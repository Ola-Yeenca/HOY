import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl bg-black/40 backdrop-blur-xl border border-gold/20',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export { Card };
