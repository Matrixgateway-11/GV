import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const controlBase =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-bark-800 placeholder:text-bark-600/35 shadow-[0_1px_2px_rgba(19,16,9,0.04)] outline-none transition duration-200 focus:ring-4';
const controlOk = 'border-cream-300 hover:border-gold-400/60 focus:border-gold-500 focus:ring-gold-400/20';
const controlError = 'border-red-400 focus:border-red-500 focus:ring-red-200/60';

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | false;
  aside?: ReactNode;
  children: ReactNode;
};

/** Label, control, then either the error or the hint underneath. */
export function FieldShell({ id, label, required, hint, error, aside, children }: FieldShellProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-bark-800">
          {label}
          {required ? <span className="text-gold-600"> *</span> : <span className="ml-1.5 font-normal text-bark-600/55">(optional)</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-snug text-red-700">
          <AlertCircle size={14} className="mt-px shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-bark-600/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const describedBy = (id: string, error?: string | false, hint?: ReactNode) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | false;
  inputRef?: Ref<HTMLInputElement>;
};

export function TextField({ id, label, required, hint, error, inputRef, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        ref={inputRef}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${controlBase} ${error ? controlError : controlOk}`}
        {...input}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | false;
  count?: number;
  max?: number;
  inputRef?: Ref<HTMLTextAreaElement>;
};

export function TextAreaField({ id, label, required, hint, error, count, max, inputRef, ...textarea }: TextAreaFieldProps) {
  const counter =
    max !== undefined && count !== undefined ? (
      <span className={`text-[12px] tabular-nums ${count > max * 0.9 ? 'text-gold-600' : 'text-bark-600/50'}`}>
        {count} / {max}
      </span>
    ) : null;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} aside={counter}>
      <textarea
        id={id}
        ref={inputRef}
        maxLength={max}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${controlBase} min-h-[9rem] resize-y leading-relaxed ${error ? controlError : controlOk}`}
        {...textarea}
      />
    </FieldShell>
  );
}

type ChoiceChipsProps<T extends string> = {
  legend: string;
  options: readonly T[];
  value: T[];
  onToggle: (option: T) => void;
};

/** Multi-select pills backed by real checkboxes (keyboard and screen-reader friendly). */
export function ChoiceChips<T extends string>({ legend, options, value, onToggle }: ChoiceChipsProps<T>) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold text-bark-800">
        {legend}
        <span className="ml-1.5 font-normal text-bark-600/55">(optional)</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value.includes(option);
          return (
            <label
              key={option}
              className={`relative inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 ${
                checked ? 'border-bark-800 bg-bark-800 text-cream-50' : 'border-cream-300 bg-white text-bark-700 hover:border-gold-400'
              }`}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => onToggle(option)} />
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                  checked ? 'border-gold-400 bg-gold-400 text-bark-900' : 'border-cream-300 bg-cream-50'
                }`}
              >
                {checked && <Check size={10} strokeWidth={3.5} />}
              </span>
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type ConsentFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | false;
  inputRef?: Ref<HTMLInputElement>;
  children: ReactNode;
};

export function ConsentField({ id, checked, onChange, error, inputRef, children }: ConsentFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="group relative flex cursor-pointer items-start gap-3">
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400 peer-focus-visible:ring-offset-2 ${
            checked ? 'border-bark-800 bg-bark-800 text-gold-400' : error ? 'border-red-400 bg-white' : 'border-cream-300 bg-white group-hover:border-gold-400'
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </span>
        <span className="text-[13.5px] leading-relaxed text-bark-600/85">{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-8 flex items-start gap-1.5 text-[12.5px] leading-snug text-red-700">
          <AlertCircle size={14} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
