export const pageAnimationVariants = (customDelay) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
});

export const variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.5 },
  },
};

export const items = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};
