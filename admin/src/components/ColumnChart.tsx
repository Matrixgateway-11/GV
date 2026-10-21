import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { compact } from '../lib/format';

export type ColumnPoint = { key: string; label: string; tick: string; value: number };

type ColumnChartProps = {
  points: ColumnPoint[];
  /** Series colour (marks only — text always uses the ink colours). */
  color: string;
  /** "visit" → "1 visit", "12 visits". */
  unit: string;
  /** Accessible description, e.g. "Visits per day, last 30 days". */
  description: string;
  /** Note for the last, still-running period, e.g. "so far". */
  currentNote?: string;
};

const PLOT_HEIGHT = 180;
const TOP = 22; // room for the value label above the tallest column
const AXIS = 26; // x-axis label band (part of the chart's height, so it never gets cut off)
const LEFT = 36;

/** Rounded "nice" axis steps: 1, 2, 5, 10, 20, 50… */
function niceTicks(max: number): number[] {
  const target = Math.max(max, 4);
  const rough = target / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power;
  const ticks: number[] = [];
  for (let value = 0; value < target + step; value += step) {
    ticks.push(value);
    if (value >= target) break;
  }
  return ticks;
}

/** X-axis label, kept inside the chart: the end labels align to the edge instead of being cut off. */
function Tick({ x, y, width, text }: { x: number; y: number; width: number; text: string }) {
  const half = text.length * 3.2; // ≈ half the label's width at 11px
  const anchor = x + half > width ? 'end' : x - half < LEFT ? 'start' : 'middle';
  const at = anchor === 'end' ? width : anchor === 'start' ? LEFT : x;
  return (
    <text x={at} y={y} textAnchor={anchor} className="fill-bark-600/60 text-[11px]">
      {text}
    </text>
  );
}

/** "visit" → "visits", "enquiry" → "enquiries". */
const plural = (unit: string) => (unit.endsWith('y') ? `${unit.slice(0, -1)}ies` : `${unit}s`);
const counted = (count: number, unit: string) => `${count.toLocaleString('en')} ${count === 1 ? unit : plural(unit)}`;

/** Columns on one baseline: ≤24px wide with 4px rounded tops, a hover/keyboard tooltip and the latest value labelled. */
export default function ColumnChart({ points, color, unit, description, currentNote }: ColumnChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ticks = niceTicks(Math.max(0, ...points.map((point) => point.value)));
  const top = ticks[ticks.length - 1];
  const plotWidth = Math.max(0, width - LEFT);
  const band = points.length ? plotWidth / points.length : 0;
  const barWidth = Math.max(2, Math.min(24, band * 0.62, band - 2));
  const y = (value: number) => TOP + PLOT_HEIGHT - (value / top) * PLOT_HEIGHT;
  const height = TOP + PLOT_HEIGHT + AXIS;
  const last = points.length - 1;

  // Show only as many x labels as fit, always including the latest period.
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(plotWidth / 52))));
  const showTick = (index: number) => (last - index) % labelEvery === 0;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    setActive((current) => {
      const from = current ?? last;
      if (event.key === 'Home') return 0;
      if (event.key === 'End') return last;
      return Math.max(0, Math.min(last, from + (event.key === 'ArrowLeft' ? -1 : 1)));
    });
  };

  const tip = active !== null ? points[active] : null;
  const tipX = active !== null ? LEFT + band * active + band / 2 : 0;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label={`${description}. Use the left and right arrow keys to read each value.`}
      onKeyDown={onKeyDown}
      onFocus={() => setActive((current) => current ?? last)}
      onBlur={() => setActive(null)}
      onPointerLeave={() => setActive(null)}
      className="relative rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4"
      style={{ height }}
    >
      {width > 0 && (
        <svg width={width} height={height} className="block" aria-hidden="true">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={LEFT} x2={width} y1={y(tick)} y2={y(tick)} stroke="#efe9dd" strokeWidth={1} shapeRendering="crispEdges" />
              <text x={LEFT - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-bark-600/60 text-[11px] tabular-nums">
                {compact(tick)}
              </text>
            </g>
          ))}

          {points.map((point, index) => {
            const x = LEFT + band * index + (band - barWidth) / 2;
            const barTop = y(point.value);
            const barHeight = TOP + PLOT_HEIGHT - barTop;
            const radius = Math.min(4, barWidth / 2, barHeight);
            const dimmed = active !== null && active !== index;
            return (
              <g key={point.key}>
                {point.value > 0 && (
                  <path
                    d={`M${x},${TOP + PLOT_HEIGHT} V${barTop + radius} Q${x},${barTop} ${x + radius},${barTop} H${x + barWidth - radius} Q${x + barWidth},${barTop} ${x + barWidth},${barTop + radius} V${TOP + PLOT_HEIGHT} Z`}
                    fill={color}
                    opacity={dimmed ? 0.35 : 1}
                    style={{ transition: 'opacity 150ms' }}
                  />
                )}
                {index === last && (
                  <text x={x + barWidth / 2} y={barTop - 7} textAnchor="middle" className="fill-bark-800 text-[12px] font-semibold">
                    {compact(point.value)}
                  </text>
                )}
                {showTick(index) && <Tick x={LEFT + band * index + band / 2} y={TOP + PLOT_HEIGHT + 18} width={width} text={point.tick} />}
                {/* Hit area: the whole column slot, not just the painted bar. */}
                <rect x={LEFT + band * index} y={0} width={band} height={TOP + PLOT_HEIGHT} fill="transparent" onPointerMove={() => setActive(index)} />
              </g>
            );
          })}
          <line x1={LEFT} x2={width} y1={TOP + PLOT_HEIGHT} y2={TOP + PLOT_HEIGHT} stroke="#e4d8c0" strokeWidth={1} shapeRendering="crispEdges" />
        </svg>
      )}

      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-bark-900 px-3 py-2 text-cream-50 shadow-lg"
          style={{ left: Math.min(Math.max(tipX, 70), width - 70), top: Math.max(y(tip.value) - 10, 44) }}
        >
          <p className="text-[14px] font-semibold">{counted(tip.value, unit)}</p>
          <p className="text-[12px] text-cream-200/75">
            {tip.label}
            {active === last && currentNote ? ` · ${currentNote}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}

/** The same numbers as a table — every value readable without hovering. */
export function ColumnTable({ points, unit }: { points: ColumnPoint[]; unit: string }) {
  return (
    <div className="max-h-[226px] overflow-y-auto rounded-lg border border-cream-200">
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 bg-cream-100 text-left text-[11px] uppercase tracking-[0.14em] text-bark-600/70">
          <tr>
            <th className="px-3 py-2 font-semibold">Period</th>
            <th className="px-3 py-2 text-right font-semibold">{plural(unit)}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200">
          {[...points].reverse().map((point) => (
            <tr key={point.key}>
              <td className="px-3 py-2 text-bark-700">{point.label}</td>
              <td className="px-3 py-2 text-right font-medium tabular-nums text-bark-800">{point.value.toLocaleString('en')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
