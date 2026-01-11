import { cn } from '@/lib/utils';

interface BadgePremiumProps {
  type: 'most-chosen' | 'best-value' | 'premium';
  className?: string;
}

const badgeConfig = {
  'most-chosen': {
    label: 'Mais escolhido',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'best-value': {
    label: 'Melhor custo',
    className: 'bg-green-500/10 text-green-700 border-green-500/20',
  },
  'premium': {
    label: 'Premium',
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
};

const BadgePremium = ({ type, className }: BadgePremiumProps) => {
  const config = badgeConfig[type];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};

export default BadgePremium;
