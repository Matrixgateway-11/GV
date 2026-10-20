type ChipsProps = {
  items: string[];
  className?: string;
};

/** Row of small rounded tags (materials, audiences, …). */
export default function Chips({ items, className = '' }: ChipsProps) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="px-3.5 py-1.5 rounded-full border border-cream-300 bg-white/70 text-bark-700 text-xs sm:text-[13px] font-medium"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
