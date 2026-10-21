import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { describedBy, FieldShell } from './fields';
import { countries, countryAliases, type Country } from '../../data/countries';
import { findCountry, mainCountryForDial, splitInternational } from '../../lib/phone';

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const searchIndex = countries.map((country) => {
  const name = normalize(country.name);
  const words = normalize(`${country.name} ${countryAliases[country.iso] ?? ''}`).split(/[\s(),.’'-]+/);
  return { country, name, words, iso: country.iso.toLowerCase() };
});

/** Countries matching a name, alias, ISO code or dialling code; best matches first. */
function searchCountries(query: string): Country[] {
  const q = normalize(query.trim());
  if (!q) return countries;
  const digits = q.replace(/^\+/, '');
  if (/^\d+$/.test(digits)) {
    const rank = (country: Country) => country.dial.length * 2 + (mainCountryForDial[country.dial] === country.iso ? 0 : 1);
    return countries.filter((country) => country.dial.startsWith(digits)).sort((a, b) => rank(a) - rank(b));
  }
  // Exact code or alias ("uk", "uae", "us"), then names starting with the text, then any word, then anywhere.
  const tiers: Country[][] = [[], [], [], []];
  for (const entry of searchIndex) {
    if (entry.name === q) tiers[0].unshift(entry.country);
    else if (entry.iso === q || entry.words.includes(q)) tiers[0].push(entry.country);
    else if (entry.name.startsWith(q)) tiers[1].push(entry.country);
    else if (entry.words.some((word) => word.startsWith(q))) tiers[2].push(entry.country);
    else if (entry.name.includes(q)) tiers[3].push(entry.country);
  }
  return tiers.flat();
}

function Flag({ iso }: { iso: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}flags/${iso.toLowerCase()}.svg`}
      alt=""
      width={21}
      height={14}
      loading="lazy"
      decoding="async"
      className="h-3.5 w-[21px] shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(19,16,9,0.12)]"
    />
  );
}

type PhoneFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | false;
  /** ISO code of the selected dialling-code country. */
  country: string;
  onCountryChange: (iso: string) => void;
  /** The number without the dialling code. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputRef?: (element: HTMLInputElement | null) => void;
};

/** Phone number with a searchable country / dialling-code picker in front of it. */
export default function PhoneField({ id, label, required, hint, error, country, onCountryChange, value, onChange, onBlur, inputRef }: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const numberRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = findCountry(country);
  const results = useMemo(() => searchCountries(query), [query]);
  const listId = `${id}-countries`;
  const optionId = (iso: string) => `${listId}-${iso}`;

  const openMenu = () => {
    setQuery('');
    setActive(Math.max(0, countries.findIndex((item) => item.iso === country)));
    setOpen(true);
  };

  const closeMenu = (focus?: 'button' | 'number') => {
    setOpen(false);
    (focus === 'button' ? buttonRef.current : focus === 'number' ? numberRef.current : null)?.focus({ preventScroll: true });
  };

  const choose = (iso: string) => {
    onCountryChange(iso);
    closeMenu('number');
  };

  // While open: focus the search box, and close on any click outside the field.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted country in view — scrolling only the list, never the page.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
  }, [active, results]);

  // On opening, show the selected country in the middle of the list.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (open && list && item) list.scrollTop = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2;
    // Only when the list opens; `active` is the selected country at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      openMenu();
    }
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const last = results.length - 1;
    const move = (to: number) => {
      event.preventDefault();
      setActive(Math.max(0, Math.min(last, to)));
    };
    switch (event.key) {
      case 'ArrowDown':
        return move(active + 1);
      case 'ArrowUp':
        return move(active - 1);
      case 'PageDown':
        return move(active + 6);
      case 'PageUp':
        return move(active - 6);
      case 'Enter':
        event.preventDefault(); // never submit the form from here
        if (results[active]) choose(results[active].iso);
        return;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation(); // close just the list, not the whole enquiry page
        return closeMenu('button');
      case 'Tab':
        event.preventDefault();
        return closeMenu(event.shiftKey ? 'button' : 'number');
    }
  };

  // A full international number typed or pasted into the box switches the country to match.
  const onNumberChange = (next: string) => {
    const split = splitInternational(next, country);
    if (!split) return onChange(next);
    if (split.iso !== country) onCountryChange(split.iso);
    onChange(split.national);
  };

  const frame = error
    ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-200/60'
    : 'border-cream-300 hover:border-gold-400/60 focus-within:border-gold-500 focus-within:ring-gold-400/20';

  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div ref={wrapRef} className={`relative mt-2 ${open ? 'z-30' : ''}`}>
        <div className={`flex rounded-xl border bg-white shadow-[0_1px_2px_rgba(19,16,9,0.04)] transition duration-200 focus-within:ring-4 ${frame}`}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => (open ? closeMenu() : openMenu())}
            onKeyDown={onButtonKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={selected ? `Country code: ${selected.name} +${selected.dial}. Change` : 'Choose country code'}
            className="flex shrink-0 items-center gap-2 rounded-l-xl border-r border-cream-200 pl-3.5 pr-2.5 text-[15px] text-bark-800 transition-colors hover:bg-cream-50 focus:outline-none focus-visible:bg-cream-100"
          >
            {selected && <Flag iso={selected.iso} />}
            <span className="tabular-nums">{selected ? `+${selected.dial}` : 'Code'}</span>
            <ChevronDown size={15} className={`text-bark-600/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
          <input
            id={id}
            ref={(element) => {
              numberRef.current = element;
              inputRef?.(element);
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Phone number"
            value={value}
            onChange={(event) => onNumberChange(event.target.value)}
            onBlur={onBlur}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, error, hint)}
            className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3.5 py-3 text-[15px] text-bark-800 outline-none placeholder:text-bark-600/35"
          />
        </div>

        {open && (
          <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-[0_24px_60px_-20px_rgba(19,16,9,0.35)] animate-fade-in">
            <div className="flex items-center gap-2.5 border-b border-cream-200 px-4">
              <Search size={16} className="shrink-0 text-bark-600/45" />
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={results[active] ? optionId(results[active].iso) : undefined}
                aria-label="Search countries"
                placeholder="Search country or code"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onSearchKeyDown}
                className="w-full bg-transparent py-3 text-[14px] text-bark-800 outline-none placeholder:text-bark-600/40"
              />
            </div>
            <ul ref={listRef} id={listId} role="listbox" aria-label="Country codes" className="relative max-h-64 overflow-y-auto overscroll-contain py-1.5">
              {results.map((item, index) => {
                const isSelected = item.iso === country;
                return (
                  <li
                    key={item.iso}
                    id={optionId(item.iso)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()} // keep focus in the search box
                    onMouseMove={() => index !== active && setActive(index)}
                    onClick={() => choose(item.iso)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] ${index === active ? 'bg-cream-100' : ''}`}
                  >
                    <Flag iso={item.iso} />
                    <span className={`min-w-0 flex-1 truncate ${isSelected ? 'font-semibold text-bark-800' : 'text-bark-700'}`}>{item.name}</span>
                    <span className="tabular-nums text-[13px] text-bark-600/60">+{item.dial}</span>
                    <Check size={15} className={`shrink-0 text-gold-600 ${isSelected ? '' : 'invisible'}`} />
                  </li>
                );
              })}
            </ul>
            {results.length === 0 && <p className="px-4 pb-6 pt-4 text-center text-[13px] text-bark-600/60">No country matches “{query.trim()}”</p>}
          </div>
        )}
      </div>
    </FieldShell>
  );
}
