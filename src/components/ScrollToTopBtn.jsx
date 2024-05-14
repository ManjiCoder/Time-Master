import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef } from 'react';

const radius = 22;
const circumference = Math.round(2 * Math.PI * radius);
export default function ScrollToTopBtn() {
  const progressRef = useRef(0);
  const circleRef = useRef(0);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const percent = Math.round(latest * 100);
    if (scrollY.current > 150) {
      progressRef.current.style.display = 'flex';
      circleRef.current.style.strokeDashoffset = Math.round(
        circumference - (circumference * percent) / 100
      );
    } else {
      progressRef.current.style.display = 'none';
    }
  });

  return (
    <button
      type='button'
      className='fixed w-11 h-11 bottom-20 right-3 hidden justify-center items-center rounded-full shadow-lg bg-slate-950 text-white p-1'
      ref={progressRef}
      onClick={() => scrollTo(0, 0)}
    >
      <svg
        ref={circleRef}
        width='100'
        height='100'
        className='absolute -rotate-90 stroke-yellow-400'
      >
        <circle
          cx={50}
          cy={50}
          r={radius}
          strokeDasharray={circumference}
          fill='none'
          strokeWidth={4}
          strokeLinecap='round'
        ></circle>
      </svg>
      <ChevronUpIcon />
    </button>
  );
}
