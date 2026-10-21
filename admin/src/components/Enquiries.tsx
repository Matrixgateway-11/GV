import { useMemo, useState } from 'react';
import { Download, Inbox, RotateCw, Search, SearchX } from 'lucide-react';
import EnquiryDrawer from './EnquiryDrawer';
import { Button, EmptyState, ErrorNote, Segmented, Spinner, StatusBadge, Toggle } from './ui';
import { downloadEnquiriesCsv } from '../lib/csv';
import { relativeTime } from '../lib/format';
import { useStoredState, type AsyncState } from '../lib/hooks';
import type { Enquiry, EnquiryPatch, EnquiryStatus } from '../lib/types';

type Filter = 'all' | EnquiryStatus;

type EnquiriesProps = {
  enquiries: AsyncState<Enquiry[]>;
  includeTest: boolean;
  onIncludeTest: (value: boolean) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: EnquiryPatch) => Promise<void>;
};

const normalise = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Enquiries({ enquiries, includeTest, onIncludeTest, selectedId, onSelect, onUpdate }: EnquiriesProps) {
  const [filter, setFilter] = useStoredState<Filter>('gv-admin-enquiry-filter', 'all');
  const [query, setQuery] = useState('');
  const all = enquiries.data ?? [];

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: all.length, new: 0, contacted: 0, closed: 0 };
    for (const enquiry of all) result[enquiry.status]++;
    return result;
  }, [all]);

  const visible = useMemo(() => {
    const q = normalise(query.trim());
    return all.filter((enquiry) => {
      if (filter !== 'all' && enquiry.status !== filter) return false;
      if (!q) return true;
      return normalise([enquiry.name, enquiry.email, enquiry.company, enquiry.country, enquiry.phone, enquiry.message].filter(Boolean).join(' ')).includes(q);
    });
  }, [all, filter, query]);

  const selected = selectedId ? all.find((enquiry) => enquiry.id === selectedId) : undefined;
  const firstLoad = !enquiries.data && enquiries.loading;

  const filterOptions = (['all', 'new', 'contacted', 'closed'] as Filter[]).map((value) => ({
    value,
    label: (
      <>
        {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
        <span className={`text-[11.5px] tabular-nums ${filter === value ? 'text-gold-400' : 'text-bark-600/55'}`}>{counts[value]}</span>
      </>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] font-normal leading-tight text-bark-800">Enquiries</h1>
          <p className="mt-1 text-[14px] text-bark-600/70">Every &ldquo;Request Catalog&rdquo; form sent from the website, newest first.</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<RotateCw size={14} className={enquiries.loading ? 'animate-spin' : ''} />} onClick={enquiries.reload} disabled={enquiries.loading}>
            Refresh
          </Button>
          <Button icon={<Download size={14} />} onClick={() => downloadEnquiriesCsv(visible)} disabled={!visible.length}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="no-scrollbar -mx-4 max-w-[100vw] overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Segmented label="Status" value={filter} onChange={setFilter} options={filterOptions} />
        </div>
        <label className="relative min-w-[14rem] flex-1 sm:max-w-xs">
          <span className="sr-only">Search enquiries</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-600/45" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, company…"
            className="w-full rounded-full border border-cream-300 bg-white py-2 pl-10 pr-4 text-[13.5px] text-bark-800 outline-none placeholder:text-bark-600/40 focus:border-gold-500 focus:ring-4 focus:ring-gold-400/20"
          />
        </label>
        <Toggle checked={includeTest} onChange={onIncludeTest} label="Include test site" />
      </div>

      {enquiries.error && <ErrorNote message={enquiries.error} onRetry={enquiries.reload} />}

      <div className={`rounded-2xl border border-cream-200 bg-white shadow-[0_1px_2px_rgba(19,16,9,0.04)] transition-opacity ${enquiries.loading && enquiries.data ? 'opacity-60' : ''}`}>
        {firstLoad ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !all.length ? (
          <EmptyState icon={<Inbox size={20} />} title="No enquiries yet">
            They appear here as soon as someone sends the Request Catalog form on the website.
          </EmptyState>
        ) : !visible.length ? (
          <EmptyState icon={<SearchX size={20} />} title="Nothing matches">
            Try another search or status.
          </EmptyState>
        ) : (
          <>
            {/* Desktop: table */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-cream-200 text-[11px] uppercase tracking-[0.14em] text-bark-600/65">
                  <th className="py-3 pl-6 pr-3 font-semibold">Received</th>
                  <th className="px-3 py-3 font-semibold">From</th>
                  <th className="px-3 py-3 font-semibold">Contact</th>
                  <th className="px-3 py-3 font-semibold">Interested in</th>
                  <th className="py-3 pl-3 pr-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {visible.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    tabIndex={0}
                    onClick={() => onSelect(enquiry.id)}
                    onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), onSelect(enquiry.id))}
                    className={`cursor-pointer align-top text-[13.5px] outline-none transition-colors hover:bg-cream-50 focus-visible:bg-cream-100 ${selectedId === enquiry.id ? 'bg-cream-100' : ''}`}
                  >
                    <td className="whitespace-nowrap py-3.5 pl-6 pr-3 text-bark-600/75">{relativeTime(enquiry.created_at)}</td>
                    <td className="max-w-[16rem] px-3 py-3.5">
                      <span className={`flex items-center gap-2 truncate ${enquiry.status === 'new' ? 'font-semibold text-bark-900' : 'font-medium text-bark-800'}`}>
                        {enquiry.name}
                        {enquiry.is_test && <span className="rounded bg-cream-200 px-1.5 text-[10px] font-semibold uppercase text-bark-600">Test</span>}
                      </span>
                      <span className="block truncate text-[12.5px] text-bark-600/65">{[enquiry.company, enquiry.country].filter(Boolean).join(' · ') || '—'}</span>
                    </td>
                    <td className="max-w-[15rem] px-3 py-3.5">
                      <span className="block truncate text-bark-700">{enquiry.email}</span>
                      <span className="block truncate text-[12.5px] text-bark-600/65">{enquiry.phone}</span>
                    </td>
                    <td className="max-w-[14rem] px-3 py-3.5 text-[12.5px] text-bark-700">{enquiry.interests.join(', ') || <span className="text-bark-600/50">—</span>}</td>
                    <td className="py-3.5 pl-3 pr-6">
                      <StatusBadge status={enquiry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phones: cards */}
            <ul className="divide-y divide-cream-200 md:hidden">
              {visible.map((enquiry) => (
                <li key={enquiry.id}>
                  <button type="button" onClick={() => onSelect(enquiry.id)} className="w-full px-4 py-4 text-left hover:bg-cream-50">
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className={`block truncate text-[14.5px] ${enquiry.status === 'new' ? 'font-semibold text-bark-900' : 'font-medium text-bark-800'}`}>{enquiry.name}</span>
                        <span className="block truncate text-[12.5px] text-bark-600/65">{[enquiry.company, enquiry.country].filter(Boolean).join(' · ') || enquiry.email}</span>
                      </span>
                      <StatusBadge status={enquiry.status} />
                    </span>
                    <span className="mt-2 line-clamp-2 block text-[13px] leading-relaxed text-bark-700">{enquiry.message}</span>
                    <span className="mt-2 block text-[12px] text-bark-600/60">
                      {relativeTime(enquiry.created_at)}
                      {enquiry.interests.length ? ` · ${enquiry.interests.join(', ')}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-cream-200 px-6 py-3 text-[12.5px] text-bark-600/60">
              Showing {visible.length.toLocaleString('en')} of {all.length.toLocaleString('en')}
            </p>
          </>
        )}
      </div>

      {selected && <EnquiryDrawer enquiry={selected} onClose={() => onSelect(null)} onUpdate={(patch) => onUpdate(selected.id, patch)} />}
    </div>
  );
}
