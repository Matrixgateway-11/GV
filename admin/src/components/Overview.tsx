import { useState, type ReactNode } from 'react';
import { ArrowRight, BarChart3, Inbox, RotateCw, Table2 } from 'lucide-react';
import ColumnChart, { ColumnTable, type ColumnPoint } from './ColumnChart';
import RankedList, { type RankedItem } from './RankedList';
import { Button, Card, EmptyState, ErrorNote, Segmented, Spinner, StatusBadge, Toggle } from './ui';
import { useAsync, useStoredState, type AsyncState } from '../lib/hooks';
import { bucketDate, capitalise, compact, countryName, percent, periodLabel, periodTick, relativeTime, sectionName } from '../lib/format';
import { periodViews, type Backend, type BreakdownRow, type Dimension, type Enquiry, type Period, type TrafficPoint } from '../lib/types';

const VISITS_COLOR = '#ad7a26';
const ENQUIRIES_COLOR = '#16876a';

type OverviewProps = {
  backend: Backend;
  includeTest: boolean;
  onIncludeTest: (value: boolean) => void;
  enquiries: AsyncState<Enquiry[]>;
  onOpenEnquiry: (id: string) => void;
  onAllEnquiries: () => void;
};

function StatTile({ label, period, value, previousLabel, previous }: { label: string; period: string; value: ReactNode; previousLabel: string; previous: ReactNode }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(19,16,9,0.04)]">
      <p className="text-[13px] font-medium text-bark-600/80">
        {label} <span className="text-bark-600/50">· {period}</span>
      </p>
      <p className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.02em] text-bark-800">{value}</p>
      <p className="mt-2.5 text-[12.5px] text-bark-600/65">
        {previousLabel}: <span className="font-medium text-bark-700">{previous}</span>
      </p>
    </div>
  );
}

function ChartCard({ title, subtitle, points, color, unit, currentNote }: { title: string; subtitle: string; points: ColumnPoint[]; color: string; unit: string; currentNote: string }) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <Button variant="ghost" className="-mr-2 -mt-1 px-3" icon={asTable ? <BarChart3 size={15} /> : <Table2 size={15} />} onClick={() => setAsTable((v) => !v)}>
          {asTable ? 'Chart' : 'Table'}
        </Button>
      }
    >
      {asTable ? (
        <ColumnTable points={points} unit={unit} />
      ) : (
        <ColumnChart points={points} color={color} unit={unit} description={`${title} ${subtitle.toLowerCase()}`} currentNote={currentNote} />
      )}
    </Card>
  );
}

const breakdownCards: { dimension: Dimension; title: string; subtitle: string; label: (raw: string) => string; empty: string }[] = [
  { dimension: 'country', title: 'Where visitors are from', subtitle: 'Visits by country', label: countryName, empty: 'No visits yet' },
  { dimension: 'source', title: 'How they found the site', subtitle: 'Visits by source', label: (raw) => (raw === 'Direct' ? 'Direct / typed address' : raw), empty: 'No visits yet' },
  { dimension: 'device', title: 'Devices', subtitle: 'Visits by device type', label: capitalise, empty: 'No visits yet' },
  { dimension: 'section', title: 'Most opened', subtitle: 'Collections and the catalog form', label: sectionName, empty: 'Nothing opened yet' },
];

export default function Overview({ backend, includeTest, onIncludeTest, enquiries, onOpenEnquiry, onAllEnquiries }: OverviewProps) {
  const [period, setPeriod] = useStoredState<Period>('gv-admin-period', 'day');
  const view = periodViews[period];
  const traffic = useAsync(() => backend.traffic(period, view.periods, includeTest), [backend, period, includeTest]);
  const breakdown = useAsync(() => backend.breakdown(period, view.periods, includeTest), [backend, period, includeTest]);

  const points: TrafficPoint[] = traffic.data ?? [];
  const current = points[points.length - 1];
  const previous = points[points.length - 2];
  const rangeStart = points[0] ? bucketDate(points[0].bucket) : null;
  const rangeVisits = points.reduce((sum, point) => sum + point.visits, 0);
  const columns = (pick: (point: TrafficPoint) => number): ColumnPoint[] =>
    points.map((point) => ({ key: point.bucket, label: periodLabel(point.bucket, period), tick: periodTick(point.bucket, period), value: pick(point) }));

  const rows = (dimension: Dimension): RankedItem[] => {
    const card = breakdownCards.find((item) => item.dimension === dimension)!;
    return (breakdown.data ?? [])
      .filter((row: BreakdownRow) => row.dimension === dimension)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((row) => ({ key: row.label, label: card.label(row.label), value: row.total }));
  };

  const rangeEnquiries = (enquiries.data ?? []).filter((enquiry) => !rangeStart || new Date(enquiry.created_at) >= rangeStart);
  const interestCounts = new Map<string, number>();
  for (const enquiry of rangeEnquiries) {
    for (const interest of enquiry.interests.length ? enquiry.interests : ['Not specified']) interestCounts.set(interest, (interestCounts.get(interest) ?? 0) + 1);
  }
  const interests = [...interestCounts.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ key: label, label, value }));

  const refresh = () => {
    traffic.reload();
    breakdown.reload();
    enquiries.reload();
  };
  const busy = traffic.loading || breakdown.loading;
  const firstLoad = !traffic.data && traffic.loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] font-normal leading-tight text-bark-800">Overview</h1>
          <p className="mt-1 text-[14px] text-bark-600/70">Visits to the website and catalog enquiries — {view.range.toLowerCase()}.</p>
        </div>
      </div>

      {/* One filter row scopes everything below it. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Segmented
          label="Report period"
          value={period}
          onChange={setPeriod}
          options={(Object.keys(periodViews) as Period[]).map((value) => ({ value, label: periodViews[value].tab }))}
        />
        <Toggle checked={includeTest} onChange={onIncludeTest} label="Include test site" />
        <div className="ml-auto flex items-center gap-3 text-[12.5px] text-bark-600/60">
          {traffic.updatedAt && <span className="hidden sm:inline">Updated {traffic.updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
          <Button icon={<RotateCw size={14} className={busy ? 'animate-spin' : ''} />} onClick={refresh} disabled={busy}>
            Refresh
          </Button>
        </div>
      </div>

      {traffic.error && <ErrorNote message={traffic.error} onRetry={traffic.reload} />}

      {firstLoad ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        current && (
          <div className={`space-y-6 transition-opacity ${busy ? 'opacity-60' : ''}`}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              <StatTile label="Visits" period={view.current} value={compact(current.visits)} previousLabel={view.previous} previous={compact(previous?.visits ?? 0)} />
              <StatTile label="Visitors" period={view.current} value={compact(current.visitors)} previousLabel={view.previous} previous={compact(previous?.visitors ?? 0)} />
              <StatTile label="Enquiries" period={view.current} value={compact(current.enquiries)} previousLabel={view.previous} previous={compact(previous?.enquiries ?? 0)} />
              <StatTile
                label="Enquiry rate"
                period={view.current}
                value={percent(current.enquiries, current.visitors)}
                previousLabel={view.previous}
                previous={previous ? percent(previous.enquiries, previous.visitors) : '—'}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <ChartCard title="Visits" subtitle={`${view.range}, ${view.per}`} points={columns((p) => p.visits)} color={VISITS_COLOR} unit="visit" currentNote="so far" />
              <ChartCard title="Enquiries" subtitle={`${view.range}, ${view.per}`} points={columns((p) => p.enquiries)} color={ENQUIRIES_COLOR} unit="enquiry" currentNote="so far" />
            </div>

            {breakdown.error && <ErrorNote message={breakdown.error} onRetry={breakdown.reload} />}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {breakdownCards.map((card) => (
                <Card key={card.dimension} title={card.title} subtitle={`${card.subtitle} · ${view.range.toLowerCase()}`}>
                  <RankedList items={rows(card.dimension)} color={VISITS_COLOR} total={rangeVisits} empty={card.empty} />
                </Card>
              ))}
              <Card title="What buyers ask about" subtitle={`Enquiries by interest · ${view.range.toLowerCase()}`}>
                <RankedList items={interests} color={ENQUIRIES_COLOR} total={rangeEnquiries.length} empty="No enquiries in this period" />
              </Card>
              <Card
                title="Latest enquiries"
                action={
                  <button type="button" onClick={onAllEnquiries} className="inline-flex items-center gap-1 text-[13px] font-semibold text-gold-600 hover:text-bark-800">
                    View all <ArrowRight size={14} />
                  </button>
                }
              >
                {enquiries.data?.length ? (
                  <ul className="-mx-2 divide-y divide-cream-200">
                    {enquiries.data.slice(0, 5).map((enquiry) => (
                      <li key={enquiry.id}>
                        <button type="button" onClick={() => onOpenEnquiry(enquiry.id)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-cream-50">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold text-bark-800">{enquiry.name}</span>
                            <span className="block truncate text-[12.5px] text-bark-600/65">
                              {relativeTime(enquiry.created_at)}
                              {enquiry.company ? ` · ${enquiry.company}` : ''}
                            </span>
                          </span>
                          <StatusBadge status={enquiry.status} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : enquiries.loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <EmptyState icon={<Inbox size={20} />} title="No enquiries yet" />
                )}
              </Card>
            </div>
          </div>
        )
      )}
    </div>
  );
}
