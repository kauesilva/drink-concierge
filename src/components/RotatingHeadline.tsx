import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = [
  'bar de drinks',
  'bartender',
  'consultor de bar',
  'bar de casamento',
  'bar não alcoólico',
];

interface RotatingHeadlineProps {
  onIndexChange?: (i: number) => void;
}

const RotatingHeadline = ({ onIndexChange }: RotatingHeadlineProps = {}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    onIndexChange?.(0);
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % WORDS.length;
        onIndexChange?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onIndexChange]);

  return (
    <span className="inline-flex items-baseline gap-[0.25em]">
      <span className="text-foreground">Meu</span>
      <span className="relative inline-block align-baseline overflow-hidden leading-[1.1] h-[1.1em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ y: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="block whitespace-nowrap"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

export default RotatingHeadline;