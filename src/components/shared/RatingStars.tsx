import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const RatingStars = ({ rating, totalReviews, size = 'md', showCount = true }: RatingStarsProps) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= Math.floor(rating)
                ? 'fill-primary text-primary'
                : 'fill-muted text-muted'
            )}
          />
        ))}
      </div>
      <span className={cn('font-semibold text-foreground', textSizeClasses[size])}>
        {rating.toFixed(1)}
      </span>
      {showCount && totalReviews !== undefined && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
