import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const ProgressSteps = ({ steps, currentStep, className }: ProgressStepsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative mb-4">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-colors duration-300',
                index + 1 <= currentStep
                  ? 'bg-primary border-primary'
                  : 'bg-background border-muted-foreground/20'
              )}
              initial={{ scale: 1 }}
              animate={{ scale: index + 1 === currentStep ? 1.3 : 1 }}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex justify-between text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <span
            key={index}
            className={cn(
              'transition-colors',
              index + 1 === currentStep && 'text-foreground font-semibold'
            )}
          >
            {step}
          </span>
        ))}
      </div>
      
      <p className="md:hidden text-center text-sm text-muted-foreground">
        Etapa {currentStep}/{steps.length} · <span className="font-semibold text-foreground">{steps[currentStep - 1]}</span>
      </p>
    </div>
  );
};

export default ProgressSteps;
