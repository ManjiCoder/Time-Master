import { items, variants } from '@/utils/Animation';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Shimmer() {
  return (
    <motion.section variants={variants} initial='hidden' animate='show'>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, idx) => {
        return <InViewItems key={idx} idx={idx} />;
      })}
    </motion.section>
  );
}

export function InViewItems({ idx }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      key={idx}
      variants={items}
      animte={isInView ? 'show' : 'hidden'}
      className='m-auto grid grid-cols-[30%,70%] justify-evenly h-36 w-full p-2 md:h-44 md:max-w-xl lg:max-w-2xl'
    >
      <div className='flex flex-col items-center justify-center rounded-l-lg bg-slate-800'>
        <div className='mb-0.5 grid h-6 w-[70%] place-items-center rounded-tl-lg rounded-tr-lg bg-slate-600 text-sm font-bold max-ss:text-xs'></div>
        <div
          className={`grid h-16 w-[70%] place-items-center rounded-bl-lg rounded-br-lg bg-slate-600 text-4xl font-bold`}
        ></div>
      </div>

      <div className='relative grid flex-col items-center justify-center rounded-r-lg bg-slate-800 font-bold text-white'>
        {/* <div className='flex justify-center text-sm md:pb-2 md:text-base'>
          <p>
            <span className='h-2 bg-slate-700 font-semibold'></span>
          </p>
          <button className='absolute right-3 h-4 w-4 rounded-full bg-slate-600'></button>
          <button className='absolute left-3 h-4 w-4 rounded-full bg-slate-600'></button>
        </div> */}
        <div className='flex gap-1 text-center'>
          <div>
            <div
              className={`flex h-16 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full items-center justify-center rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md w-[5rem] max-ss:text-sm md:w-28`}
            >
              <span className='-mb-1.5 ml-0.5 h-2 text-xs font-light'></span>
            </div>
            <div className='mt-2 h-4 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full rounded-md bg-slate-600 font-semibold shadow-md w-[5rem] max-ss:text-sm md:w-28'></div>
          </div>
          <div>
            <div
              className={`flex h-16 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full items-center justify-center rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md w-[5rem] max-ss:text-sm md:w-28`}
            >
              <span className='-mb-1.5 ml-0.5 h-2 text-xs font-light'></span>
            </div>
            <div className='mt-2 h-4 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full rounded-md bg-slate-600 font-semibold shadow-md w-[5rem] max-ss:text-sm md:w-28'></div>
          </div>
          <div>
            <div
              className={`flex h-16 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full items-center justify-center rounded-md bg-slate-600 px-2 py-3 text-center text-xl font-bold shadow-md w-[5rem] max-ss:text-sm md:w-28`}
            >
              <span className='-mb-1.5 ml-0.5 h-2 text-xs font-light'></span>
            </div>
            <div className='mt-2 h-4 max-ss:w-[3rem] max-xs:w-[4rem] max-w-full rounded-md bg-slate-600 font-semibold shadow-md w-[5rem] max-ss:text-sm md:w-28'></div>
          </div>
        </div>
        {/* For IMP Note */}
        {/* <div className='h-2 rounded bg-slate-600'></div> */}
      </div>
    </motion.div>
  );
}
