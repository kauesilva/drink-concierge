import { cn } from '@/lib/utils';

interface BadgePremiumProps {
  type: 'most-chosen' | 'best-value' | 'premium';
  className?: string;
}

const badgeConfig = {
  'most-chosen': {
    label: 'Mais escolhido',
    className: 'bg-primary/10 text-foreground border-primary/20',
  },
  'best-value': {
    label: 'Melhor custo',
    className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  },
  'premium': {
    label: 'Premium',
    className: 'bg-primary/10 text-foreground border-primary/20',
  },
};

const BadgePremium = ({ type, className }: BadgePremiumProps) => {
  const config = badgeConfig[type];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};

export default BadgePremium;
