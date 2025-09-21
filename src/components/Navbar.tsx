"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { label: string; href: string };

export default function Navbar({ items = defaultItems }: { items?: NavItem[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="mx-auto max-w-5xl flex items-center justify-between p-4 text-sm">
      <Link href="/" className="font-semibold brand-heading">Admissions Portal</Link>
      <div className="flex items-center gap-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={
              'px-2 py-1 border-b-2 transition-colors ' +
              (isActive(it.href)
                ? 'border-crimson text-crimson'
                : 'border-transparent hover:border-crimson/60 hover:text-crimson')
            }
          >
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const defaultItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Apply', href: '/apply' },
  { label: 'Teacher', href: '/teacher' },
  { label: 'About', href: '/about' },
];
