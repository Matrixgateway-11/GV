import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Eye, EyeOff, Info, Lock } from 'lucide-react';
import { BrandLogo, Spinner } from './ui';
import { supabase } from '../lib/supabase';

const inputClass =
  'mt-2 block w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-bark-800 outline-none transition placeholder:text-bark-600/35 hover:border-gold-400/60 focus:border-gold-500 focus:ring-4 focus:ring-gold-400/20';

function Frame({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bark-900 px-4 py-12">
      <div className="mb-8">
        <BrandLogo tone="light" />
      </div>
      <div className="w-full max-w-md rounded-3xl bg-cream-50 px-6 py-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:px-9 sm:py-10">
        <h1 className="font-serif text-[1.9rem] font-normal leading-tight text-bark-800">{title}</h1>
        <div className="mt-2 text-[14px] leading-relaxed text-bark-600/75">{intro}</div>
        <div className="mt-7">{children}</div>
      </div>
      <p className="mt-8 flex items-center gap-2 text-[12px] text-cream-200/50">
        <Lock size={13} /> Private area for the Golden Village team
      </p>
    </main>
  );
}

const SubmitButton = ({ busy, children }: { busy: boolean; children: ReactNode }) => (
  <button
    type="submit"
    disabled={busy}
    className="flex w-full items-center justify-center gap-2 rounded-full bg-bark-800 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-gold-500 hover:text-bark-900 disabled:cursor-wait disabled:opacity-70"
  >
    {busy && <Spinner className="text-current" />}
    {children}
  </button>
);

const Alert = ({ tone, children }: { tone: 'error' | 'info'; children: ReactNode }) => (
  <p
    role={tone === 'error' ? 'alert' : 'status'}
    className={`mb-5 rounded-xl px-4 py-3 text-[13px] leading-relaxed ${tone === 'error' ? 'bg-red-50 text-red-800' : 'bg-[#e4eef7] text-[#24507a]'}`}
  >
    {children}
  </p>
);

export function Login({ notice, onDemo }: { notice?: string; onDemo: () => void }) {
  const [mode, setMode] = useState<'sign-in' | 'reset'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!supabase) {
    return (
      <Frame title="Admin panel" intro="Visitors, enquiries and daily / weekly / monthly reports for the Golden Village website.">
        <div className="flex gap-3 rounded-xl bg-[#f6ecd9] px-4 py-3.5 text-[13px] leading-relaxed text-[#6f5219]">
          <Info size={17} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">Demo mode.</strong> The database isn&rsquo;t connected yet, so the panel shows sample data. Once it&rsquo;s
            connected, this page asks for your admin email and password.
          </span>
        </div>
        <button
          type="button"
          onClick={onDemo}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-bark-800 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-gold-500 hover:text-bark-900"
        >
          Open the demo
        </button>
      </Frame>
    );
  }
  const client = supabase;

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) setError(/invalid/i.test(signInError.message) ? 'Wrong email or password.' : signInError.message);
  };

  const sendReset = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: resetError } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    setBusy(false);
    if (resetError) setError(resetError.message);
    else setSent(true);
  };

  if (mode === 'reset') {
    return (
      <Frame title="Reset password" intro="Enter your admin email and we’ll send you a link to choose a new password.">
        {error && <Alert tone="error">{error}</Alert>}
        {sent ? (
          <Alert tone="info">If {email.trim()} has admin access, a reset link is on its way. Check your inbox (and spam folder).</Alert>
        ) : (
          <form onSubmit={sendReset} className="space-y-6">
            <label className="block text-[13px] font-semibold text-bark-800">
              Email
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </label>
            <SubmitButton busy={busy}>Send reset link</SubmitButton>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setMode('sign-in');
            setSent(false);
            setError(null);
          }}
          className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-bark-700 hover:text-gold-600"
        >
          <ArrowLeft size={15} /> Back to sign in
        </button>
      </Frame>
    );
  }

  return (
    <Frame title="Sign in" intro="Admin access to visitors and enquiries.">
      {(error || notice) && <Alert tone="error">{error ?? notice}</Alert>}
      <form onSubmit={signIn} className="space-y-5">
        <label className="block text-[13px] font-semibold text-bark-800">
          Email
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-[13px] font-semibold text-bark-800">
              Password
            </label>
            <button type="button" onClick={() => setMode('reset')} className="text-[12.5px] font-medium text-gold-600 hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-full p-1.5 text-bark-600/60 hover:text-bark-800"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <div className="pt-2">
          <SubmitButton busy={busy}>Sign in</SubmitButton>
        </div>
      </form>
    </Frame>
  );
}

/** Shown after following a "reset password" email link. */
export function NewPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setError('Use at least 8 characters.');
    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase!.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message);
    else onDone();
  };

  return (
    <Frame title="Choose a new password" intro="Pick a password you don’t use anywhere else.">
      {error && <Alert tone="error">{error}</Alert>}
      <form onSubmit={save} className="space-y-6">
        <label className="block text-[13px] font-semibold text-bark-800">
          New password
          <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </label>
        <SubmitButton busy={busy}>Save password</SubmitButton>
      </form>
    </Frame>
  );
}
