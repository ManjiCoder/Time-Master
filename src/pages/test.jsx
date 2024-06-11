import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
const nums = new Array(50).fill(null);

const variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.5 },
  },
};
const items = {
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

const text = 'Testing...'.split('');

export default function Test() {
  return (
    <div className='min-h-screen bg-slate-950 p-4 pb-20 text-center text-xl text-white'>
      <motion.h1
        variants={variants}
        initial='hidden'
        animate='show'
        className='text-3xl'
      >
        {text.map((char, i) => (
          <motion.span variants={items} key={i}>
            {char}
          </motion.span>
        ))}
      </motion.h1>
      <motion.section variants={variants} initial='hidden' animate='show'>
        {nums.map((_, idx) => {
          if (idx < 11) {
            return (
              <motion.div
                variants={variants}
                className='mt-5 rounded-sm bg-slate-800 p-3 shadow-sm'
                key={idx}
              >
                {++idx}
              </motion.div>
            );
          } else {
            return <InViewItems key={idx} idx={idx} />;
          }
        })}
      </motion.section>
    </div>
  );
}

export function InViewItems({ idx }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      variants={items}
      animate={isInView ? 'show' : 'hidden'}
      className='mt-5 rounded-sm bg-slate-800 p-3 shadow-sm'
      key={idx}
    >
      {++idx}
    </motion.div>
  );
}
