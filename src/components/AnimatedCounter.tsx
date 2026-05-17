import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // segundos
  className?: string;
}

const AnimatedCounter = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const rawProgress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setDisplay(Math.round(eased * value));

      if (rawProgress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString('pt-BR')}{suffix}
    </span>
  );
};

export default AnimatedCounter;
