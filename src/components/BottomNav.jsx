import React from 'react';
import {
  HomeIcon,
  IdentificationIcon,
  CogIcon,
  FolderPlusIcon,
} from '@heroicons/react/20/solid';
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
    <nav className="fixed border border-b-0  bottom-0 py-2 z-50 bg-slate-200 dark:bg-slate-900 w-full dark:text-white border-white dark:border-slate-400">
      <hr className="hidden bg-slate-200 dark:bg-white mb-2" />
      <ul className="flex gap-2 items-center justify-evenly">
        {navList.map(({ linkName, icon, href }) => (
          <li key={linkName} className={`font-semibold text-lg px-4`}>
            <Link
              href={href}
              className={`flex flex-col justify-center items-center text-xs ${
                pathname === href
                  ? 'text-slate-800 dark:text-white'
                  : 'text-gray-400'
              }`}
            >
              <span className="h-7 w-7">{icon}</span>
              {linkName}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
