import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = [
  'bar de drinks',
  'bartender',
  'consultor de bar',
  'bar de casamento',
  'bar não alcoólico',
];

const RotatingHeadline = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-baseline gap-[0.25em]">
      <span className="text-foreground">Seu</span>
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