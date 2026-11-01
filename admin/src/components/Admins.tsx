import { useState } from 'react';
import { Mail, ShieldCheck, UserPlus, X } from 'lucide-react';
import { inviteAdmin, listAdmins, removeAdmin } from '../lib/admins';
import { useAsync } from '../lib/hooks';
import { supabase } from '../lib/supabase';
import { Button, Card, EmptyState, ErrorNote, Spinner } from './ui';

/**
 * "Admins" — who can sign in to this panel.
 * Adding someone emails them an invitation to choose their own password; we never set one
 * for them. Taking access away leaves their sign-in account alone.
 */
export default function Admins({ email }: { email: string }) {
  const people = useAsync(() => listAdmins(), []);
  const { reload } = people;

  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const connected = Boolean(supabase);

  async function run(action: () => Promise<void>, label: string) {
    setProblem(null);
    setNote(null);
    setBusy(label);
    try {
      await action();
    } catch (error) {
      setProblem(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
      reload();
    }
  }

  if (!connected) {
    return (
      <Card title="Admins">
        <EmptyState icon={<ShieldCheck size={22} />} title="Not connected yet">
          Add the Supabase settings to this panel to manage who can sign in.
        </EmptyState>
      </Card>
    );
  }

  const admins = people.data?.admins ?? [];
  const you = (people.data?.you || email).toLowerCase();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[22px] font-semibold text-bark-900">Admins</h1>
        <p className="mt-1 text-[13.5px] text-bark-700/75">
          Everyone here can sign in to this panel, see enquiries and change the website&rsquo;s photos.
        </p>
      </header>

      <Card title="Invite someone">
        <form
          className="flex flex-wrap items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const address = newEmail.trim();
            if (!address) return;
            run(async () => {
              const result = await inviteAdmin(address);
              setNewEmail('');
              setNote(
                result.alreadyHasAccount
                  ? address + ' already had an account, so they can sign in straight away.'
                  : 'Invitation sent to ' + address + '. They choose their own password from the email.',
              );
            }, 'Inviting…');
          }}
        >
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="name@company.com"
            className="min-w-[16rem] flex-1 rounded-xl border border-bark-900/20 bg-white px-4 py-2.5 text-[14px] text-bark-900 focus:border-gold-400 focus:outline-none"
          />
          <Button variant="primary" type="submit" icon={<UserPlus size={16} />} disabled={!newEmail.trim() || Boolean(busy)}>
            Send invitation
          </Button>
        </form>

        {busy && (
          <p className="mt-4 flex items-center gap-2 text-[13px] text-bark-700">
            <Spinner /> {busy}
          </p>
        )}
        {note && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#cfe3d4] bg-[#eef6f0] px-4 py-3 text-[13px] text-[#235c37]">
            <Mail size={15} className="mt-0.5 shrink-0" /> {note}
          </p>
        )}
        {problem && (
          <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            <span>{problem}</span>
            <button type="button" onClick={() => setProblem(null)} className="font-semibold underline-offset-4 hover:underline">
              Dismiss
            </button>
          </div>
        )}
      </Card>

      <Card title={admins.length === 1 ? '1 admin' : admins.length + ' admins'}>
        {people.loading && !people.data ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : people.error ? (
          <ErrorNote message={people.error} onRetry={reload} />
        ) : admins.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={22} />} title="Nobody listed">
            That should not happen while you are signed in. Try reloading the page.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-bark-900/10">
            {admins.map((person) => {
              const isYou = person.email.toLowerCase() === you;
              return (
                <li key={person.email} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-bark-900">
                      {person.email}
                      {isYou && <span className="ml-2 text-[12px] text-bark-700/55">you</span>}
                    </p>
                  </div>
                  {isYou ? (
                    <span className="text-[12.5px] text-bark-700/45">Cannot remove yourself</span>
                  ) : confirming === person.email ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] text-bark-700/70">Take away access?</span>
                      <Button
                        variant="primary"
                        disabled={Boolean(busy)}
                        onClick={() => {
                          setConfirming(null);
                          run(() => removeAdmin(person.email), 'Removing…');
                        }}
                      >
                        Remove
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirming(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirming(person.email)}
                      disabled={Boolean(busy)}
                      aria-label={'Remove ' + person.email}
                      className="rounded-lg p-1.5 text-bark-700/70 hover:bg-red-50 hover:text-red-700 disabled:opacity-30"
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
