import { percent } from '../lib/format';

export type RankedItem = { key: string; label: string; value: number };

/** Top-N list: label and value on one line, a thin bar (share of the leader) underneath. */
export default function RankedList({ items, color, total, empty }: { items: RankedItem[]; color: string; total: number; empty: string }) {
  if (!items.length || total === 0) return <p className="py-6 text-center text-[13px] text-bark-600/60">{empty}</p>;
  const max = Math.max(...items.map((item) => item.value));
  return (
    <ol className="space-y-3.5">
      {items.map((item) => (
        <li key={item.key}>
          <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
            <span className="min-w-0 truncate text-bark-700">{item.label}</span>
            <span className="shrink-0 tabular-nums">
              <span className="font-semibold text-bark-800">{item.value.toLocaleString('en')}</span>
              <span className="ml-2 inline-block w-12 text-right text-[12px] text-bark-600/60">{percent(item.value, total)}</span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-cream-100">
            <div className="h-full rounded-full" style={{ width: `${Math.max(2, (item.value / max) * 100)}%`, backgroundColor: color }} />
          </div>
        </li>
      ))}
    </ol>
  );
}
