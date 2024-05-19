import { motion } from 'framer-motion';
const nums = new Array(50).fill(null);

const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const items = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const text = 'Testing...'.split('');

export default function Test() {
  return (
    <div className='min-h-screen text-white text-center bg-slate-950 p-4 text-xl pb-20'>
      <motion.h1
        variants={variants}
        initial='hidden'
        animate='show'
        className='text-3xl'
      >
        {text.map((char) => (
          <motion.span
            variants={items}
            key={char}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      <motion.section
        variants={variants}
        initial='hidden'
        animate='show'
      >
        {nums.map((v, idx) => (
          <motion.div
            variants={variants}
            className='p-3 bg-slate-800 mt-5 rounded-sm shadow-sm'
            key={idx}
          >
            {++idx}
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
