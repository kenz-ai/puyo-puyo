'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'How I Build', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d1117]/80 backdrop-blur-md border-b border-slate-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-end">
        <nav className="flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-xs font-mono text-slate-500 hover:text-slate-200 transition-colors tracking-widest uppercase"
            >
              {label}
            </a>
          ))}
          <Link
            href="/game"
            className="text-xs font-mono px-3 py-1.5 rounded border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 transition-colors tracking-widest uppercase"
          >
            Play
          </Link>
        </nav>
      </div>
    </header>
  );
}
