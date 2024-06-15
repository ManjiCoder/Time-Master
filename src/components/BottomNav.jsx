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
    linkName: 'Settings',
    icon: <CogIcon />,
    href: '/settings',
  },
];

export default function BottomNavbar() {
  const { pathname } = useRouter();
  if (pathname === '/_error') {
    return null;
  }
  return (
    <motion.nav
      variants={pageAnimationVariants}
      initial='initial'
      animate='animate'
      className='fixed bottom-0 z-10 w-full border-t-[1px] border-white bg-slate-200 py-2 dark:border-slate-400 dark:bg-slate-900 dark:text-white print:hidden'
    >
      <hr className='mb-2 hidden bg-slate-200 dark:bg-white' />
      <ul className='flex items-center justify-evenly gap-2'>
        {navList.map(({ linkName, icon, href }, index) => (
          <motion.li
            key={linkName}
            className={`px-4 text-lg font-semibold`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            viewport={{
              once: true,
            }}
            transition={{ duration: 0.2, delay: 0.2 * index }}
          >
            <Link
              href={href}
              className={`flex flex-col items-center justify-center text-xs ${
                pathname === href
                  ? 'text-slate-800 dark:text-white'
                  : 'text-gray-400 hover:scale-110 hover:text-slate-800 hover:dark:text-white'
              } transition-all`}
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
