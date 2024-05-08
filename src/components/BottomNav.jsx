import { pageAnimationVariants } from '@/utils/Animation';
import {
  CogIcon,
  FolderPlusIcon,
  HomeIcon,
  IdentificationIcon,
} from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navList = [
  {
    linkName: 'Home',
    icon: <HomeIcon />,
    href: '/',
  },
  {
    linkName: 'Attendance',
    icon: <IdentificationIcon />,
    href: '/attendance',
  },
  {
    linkName: 'Upload',
    icon: <FolderPlusIcon />,
    href: '/upload',
  },
  {
    linkName: 'Setting',
    icon: <CogIcon />,
    href: '/setting',
  },
];

export default function BottomNavbar() {
  const { pathname } = useRouter();
  return (
    <motion.nav
      variants={pageAnimationVariants}
      initial='initial'
      animate='animate'
      className='print:hidden fixed border-t-[1px]  bottom-0 py-2 z-10 bg-slate-200 dark:bg-slate-900 w-full dark:text-white border-white dark:border-slate-400'
    >
      <hr className='hidden bg-slate-200 dark:bg-white mb-2' />
      <ul className='flex gap-2 items-center justify-evenly'>
        {navList.map(({ linkName, icon, href }, index) => (
          <motion.li
            key={linkName}
            className={`font-semibold text-lg px-4`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            viewport={{
              once: true,
            }}
            transition={{ duration: 0.2, delay: 0.2 * index }}
          >
            <Link
              href={href}
              className={`flex flex-col justify-center items-center text-xs ${
                pathname === href
                  ? 'text-slate-800 dark:text-white'
                  : 'text-gray-400 hover:scale-110 hover:dark:text-white hover:text-slate-800'
              }  transition-all`}
            >
              <motion.span
                className={`${pathname === href ? 'h-8 w-8' : 'h-7 w-7'}`}
              >
                {icon}
              </motion.span>
              {linkName}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
