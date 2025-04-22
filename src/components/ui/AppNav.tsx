import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Todos' },
  { href: '/insights', label: 'Insights' },
];

export default function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-4 mb-6 items-center">
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-1 rounded hover:bg-primary/10 font-medium transition-colors ${pathname === link.href ? 'bg-primary/10 text-primary' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
