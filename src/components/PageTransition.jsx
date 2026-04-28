import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Smooth "Expo" ease
    >
      {children}
    </motion.div>
  );
}