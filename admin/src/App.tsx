import { useCallback, useEffect } from 'react';
import Enquiries from './components/Enquiries';
import { Login, NewPassword } from './components/Login';
import Overview from './components/Overview';
import Shell, { type Page } from './components/Shell';
import { Spinner } from './components/ui';
import { useAuth } from './lib/auth';
import { demoBackend } from './lib/demo';
import { useAsync, useHashPath, useStoredState } from './lib/hooks';
import { liveBackend, supabase } from './lib/supabase';
import type { Backend, EnquiryPatch } from './lib/types';

const backend: Backend = supabase ? liveBackend(supabase) : demoBackend;

function Panel({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [segments, go] = useHashPath();
  const page: Page = segments[0] === 'enquiries' ? 'enquiries' : 'overview';
  const selectedId = page === 'enquiries' ? (segments[1] ?? null) : null;
  const [includeTest, setIncludeTest] = useStoredState('gv-admin-include-test', false);

  // Enquiries are shared by both pages (latest list, interest counts, "new" badge).
  const enquiries = useAsync(() => backend.enquiries(includeTest), [includeTest]);
  const { reload, setData } = enquiries;
  const newCount = enquiries.data?.filter((enquiry) => enquiry.status === 'new').length ?? 0;

  // Pick up new enquiries every 2 minutes while the panel is open.
  useEffect(() => {
    const timer = window.setInterval(() => document.visibilityState === 'visible' && reload(), 120_000);
    return () => window.clearInterval(timer);
  }, [reload]);

  useEffect(() => {
    document.title = `${newCount ? `(${newCount}) ` : ''}Golden Village — Admin`;
  }, [newCount]);

  const update = useCallback(
    async (id: string, patch: EnquiryPatch) => {
      await backend.updateEnquiry(id, patch);
      setData((list) => list.map((enquiry) => (enquiry.id === id ? { ...enquiry, ...patch } : enquiry)));
    },
    [setData],
  );

  const navigate = (next: Page) => go(next === 'enquiries' ? '/enquiries' : '/');

  return (
    <Shell page={page} onNavigate={navigate} email={email} newCount={newCount} demo={backend.mode === 'demo'} onSignOut={onSignOut}>
      {page === 'enquiries' ? (
        <Enquiries
          enquiries={enquiries}
          includeTest={includeTest}
          onIncludeTest={setIncludeTest}
          selectedId={selectedId}
          onSelect={(id) => go(id ? `/enquiries/${id}` : '/enquiries')}
          onUpdate={update}
        />
      ) : (
        <Overview
          backend={backend}
          includeTest={includeTest}
          onIncludeTest={setIncludeTest}
          enquiries={enquiries}
          onOpenEnquiry={(id) => go(`/enquiries/${id}`)}
          onAllEnquiries={() => go('/enquiries')}
        />
      )}
    </Shell>
  );
}

export default function App() {
  const { state, signOut, enterDemo, finishRecovery } = useAuth();

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bark-900">
        <Spinner />
      </div>
    );
  }
  if (state.status === 'recovery') return <NewPassword onDone={finishRecovery} />;
  if (state.status === 'signed-out') return <Login notice={state.notice} onDemo={enterDemo} />;
  return <Panel email={state.email} onSignOut={signOut} />;
}
