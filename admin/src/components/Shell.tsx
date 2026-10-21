import type { ReactNode } from 'react';
import { ExternalLink, Inbox, LayoutDashboard, LogOut } from 'lucide-react';
import { BrandLogo } from './ui';

export type Page = 'overview' | 'enquiries';

type ShellProps = {
  page: Page;
  onNavigate: (page: Page) => void;
  email: string;
  newCount: number;
  demo: boolean;
  onSignOut: () => void;
  children: ReactNode;
};

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://gv-rosy-three.vercel.app/';

const navItems: { page: Page; label: string; icon: ReactNode }[] = [
  { page: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { page: 'enquiries', label: 'Enquiries', icon: <Inbox size={18} /> },
];

/** Sidebar on large screens; a top bar with tabs on phones and tablets. */
export default function Shell({ page, onNavigate, email, newCount, demo, onSignOut, children }: ShellProps) {
  const badge = (active: boolean) =>
    newCount > 0 && (
      <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${active ? 'bg-gold-400 text-bark-900' : 'bg-gold-400/20 text-gold-400'}`}>
        {newCount} new
      </span>
    );

  return (
    <div className="min-h-screen lg:pl-72">
      {/* Large screens: sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-bark-900 px-6 py-6 text-cream-100 lg:flex">
        <BrandLogo tone="light" />
        <nav className="mt-10 space-y-1" aria-label="Admin">
          {navItems.map((item) => {
            const active = item.page === page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                  active ? 'bg-cream-50/10 text-cream-50' : 'text-cream-200/70 hover:bg-cream-50/5 hover:text-cream-50'
                }`}
              >
                <span className={active ? 'text-gold-400' : ''}>{item.icon}</span>
                {item.label}
                {item.page === 'enquiries' && badge(active)}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4 border-t border-cream-100/10 pt-5">
          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-cream-200/70 hover:text-gold-400">
            <ExternalLink size={15} /> View website
          </a>
          <div>
            <p className="truncate text-[12.5px] text-cream-200/55" title={email}>
              {demo ? 'Demo mode' : email}
            </p>
            <button type="button" onClick={onSignOut} className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-cream-100 hover:text-gold-400">
              <LogOut size={15} /> {demo ? 'Leave demo' : 'Sign out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Phones and tablets: top bar */}
      <header className="sticky top-0 z-30 bg-bark-900 text-cream-100 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <BrandLogo tone="light" />
          <button
            type="button"
            onClick={onSignOut}
            aria-label={demo ? 'Leave demo' : 'Sign out'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/20 text-cream-100 hover:border-gold-400 hover:text-gold-400"
          >
            <LogOut size={17} />
          </button>
        </div>
        <nav className="flex gap-1 px-3 pb-2" aria-label="Admin">
          {navItems.map((item) => {
            const active = item.page === page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium ${
                  active ? 'bg-cream-50/10 text-cream-50' : 'text-cream-200/65'
                }`}
              >
                {item.icon}
                {item.label}
                {item.page === 'enquiries' && newCount > 0 && (
                  <span className="rounded-full bg-gold-400 px-1.5 text-[11px] font-semibold tabular-nums text-bark-900">{newCount}</span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        {demo && (
          <p className="mb-6 rounded-xl border border-[#ead9b4] bg-[#f6ecd9] px-4 py-3 text-[13px] leading-relaxed text-[#6f5219]">
            <strong className="font-semibold">Demo mode — sample data.</strong> Connect the database to see real visitors and enquiries. Changes you make here aren&rsquo;t saved.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
