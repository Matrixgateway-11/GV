import { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Images, Trash2, UploadCloud } from 'lucide-react';
import {
  deletePhoto,
  fileUrl,
  listPhotos,
  listSections,
  nextSortOrder,
  patchPhoto,
  SECTIONS,
  sectionLabel,
  setShowBuiltin,
  swapOrder,
  uploadPhoto,
  type GalleryPhoto,
} from '../lib/photos';
import { useAsync, useStoredState } from '../lib/hooks';
import { supabase } from '../lib/supabase';
import { Button, Card, EmptyState, ErrorNote, Spinner, Toggle } from './ui';

/**
 * "Photos" — add furniture pictures to any section of "Explore the Collections".
 * What is added here shows on the website within a minute; nothing is rebuilt.
 */
export default function Photos({ email }: { email: string }) {
  const [category, setCategory] = useStoredState('gv-admin-photo-section', SECTIONS[0].category);
  const photos = useAsync(() => listPhotos(), []);
  const { reload } = photos;
  const sections = useAsync(() => listSections(), []);

  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  /** Photo awaiting a "really remove it?" answer. Asked on the card, not with window.confirm:
   *  browsers let people silence native dialogs, and then deleting looks like it does nothing. */
  const [confirming, setConfirming] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const section = SECTIONS.find((s) => s.category === category) ?? SECTIONS[0];
  // No row for a section means its built-in photos are still shown.
  const showBuiltin = sections.data?.find((s) => s.category === category)?.show_builtin ?? true;
  const connected = Boolean(supabase);

  const inSection = useMemo(
    () => (photos.data ?? []).filter((photo) => photo.category === category).sort((a, b) => a.sort_order - b.sort_order),
    [photos.data, category],
  );

  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const photo of photos.data ?? []) tally[photo.category] = (tally[photo.category] ?? 0) + 1;
    return tally;
  }, [photos.data]);

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!list.length) return;
    setProblem(null);

    let order = nextSortOrder(photos.data ?? [], category);
    for (const [index, file] of list.entries()) {
      setBusy(`Adding ${file.name} (${index + 1} of ${list.length})…`);
      try {
        await uploadPhoto({
          file,
          collection: section.collection,
          category,
          alt: `${section.label} by Golden Village Furnitures`,
          sortOrder: order,
          addedBy: email,
        });
        order += 1;
      } catch (error) {
        setProblem(error instanceof Error ? error.message : String(error));
        break;
      }
    }
    setBusy(null);
    reload();
  }

  async function run(action: () => Promise<void>, label: string) {
    setProblem(null);
    setBusy(label);
    try {
      await action();
    } catch (error) {
      setProblem(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
      // Reload either way, so the grid shows what is really stored rather than what we hoped.
      reload();
    }
  }

  const move = (photo: GalleryPhoto, by: -1 | 1) => {
    const at = inSection.findIndex((item) => item.id === photo.id);
    const other = inSection[at + by];
    if (!other) return;
    run(() => swapOrder(photo, other), 'Reordering…');
  };

  if (!connected) {
    return (
      <Card title="Photos">
        <EmptyState icon={<Images size={22} />} title="Not connected yet">
          Add the Supabase settings to this panel to upload furniture photos. Until then the website shows the photos built into it.
        </EmptyState>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[22px] font-semibold text-bark-900">Photos</h1>
        <p className="mt-1 text-[13.5px] text-bark-700/75">
          Pictures you add here appear on the website within a minute, in the section you choose.
        </p>
      </header>

      <Card title="Section">
        <div className="space-y-4">
          {['Furniture & Crafts', 'Doors & Flooring'].map((group) => (
            <div key={group}>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-bark-700/55">{group}</p>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.filter((item) => item.group === group).map((item) => {
                  const active = item.category === category;
                  return (
                    <button
                      key={item.category}
                      type="button"
                      onClick={() => setCategory(item.category)}
                      aria-pressed={active}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        active ? 'bg-bark-900 text-cream-50' : 'bg-bark-900/5 text-bark-700 hover:bg-bark-900/10'
                      }`}
                    >
                      {item.label}
                      {counts[item.category] ? (
                        <span className={`ml-2 tabular-nums ${active ? 'text-gold-400' : 'text-bark-700/55'}`}>{counts[item.category]}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-bark-900/10 pt-4">
          <Toggle
            checked={showBuiltin}
            onChange={(next) =>
              run(async () => {
                await setShowBuiltin(section.collection, category, next, email);
                sections.reload();
              }, 'Saving…')
            }
            label={`Show the website's own ${section.label} photos`}
          />
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-bark-700/65">
            The website ships with its own {section.label.toLowerCase()} photos. Turn this off to show only
            the photos you upload here.
          </p>
        </div>
      </Card>

      <Card title={`Add to ${section.label}`}>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? 'border-gold-600 bg-gold-400/10' : 'border-bark-900/15 bg-bark-900/[0.02]'
          }`}
        >
          <UploadCloud size={26} className="text-bark-700/50" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-medium text-bark-900">Drop photos here</p>
          <p className="mt-1 text-[13px] text-bark-700/70">JPEG, PNG, HEIC or WebP — up to 25 MB each. Both sizes are made for you.</p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) addFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <Button variant="primary" icon={<ImagePlus size={16} />} className="mt-5" onClick={() => fileInput.current?.click()} disabled={Boolean(busy)}>
            Choose photos
          </Button>
        </div>

        {busy && (
          <p className="mt-4 flex items-center gap-2 text-[13px] text-bark-700">
            <Spinner /> {busy}
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

      <Card title={`${section.label} — ${inSection.length} photo${inSection.length === 1 ? '' : 's'}`}>
        {photos.loading && !photos.data ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : photos.error ? (
          <ErrorNote message={photos.error} onRetry={reload} />
        ) : inSection.length === 0 ? (
          <EmptyState icon={<Images size={22} />} title="No photos added here yet">
            The website still shows the photos built into it for this section. Anything you add appears alongside them.
          </EmptyState>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {inSection.map((photo, index) => (
              <li key={photo.id} className="overflow-hidden rounded-xl border border-bark-900/10 bg-white">
                <div className="relative aspect-[3/4] bg-bark-900/5">
                  <img
                    src={fileUrl(photo.thumb_path)}
                    alt={photo.alt}
                    loading="lazy"
                    className={`h-full w-full object-cover ${photo.is_published ? '' : 'opacity-40'}`}
                  />
                  {!photo.is_published && (
                    <span className="absolute left-2 top-2 rounded-full bg-bark-900/85 px-2 py-0.5 text-[11px] font-semibold text-cream-50">Hidden</span>
                  )}
                  {confirming === photo.id && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-bark-900/92 px-3 text-center">
                      <p className="text-[12.5px] leading-snug text-cream-100">
                        Remove this photo from {sectionLabel(photo.category)}?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirming(null);
                            run(() => deletePhoto(photo), 'Removing…');
                          }}
                          className="rounded-full bg-red-600 px-3 py-1 text-[12px] font-semibold text-white hover:bg-red-500"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirming(null)}
                          className="rounded-full border border-cream-100/30 px-3 py-1 text-[12px] font-semibold text-cream-100 hover:border-gold-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 px-2 py-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(photo, -1)}
                      disabled={index === 0 || Boolean(busy)}
                      aria-label="Move earlier"
                      className="rounded-lg p-1.5 text-bark-700/70 hover:bg-bark-900/5 hover:text-bark-900 disabled:opacity-30"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(photo, 1)}
                      disabled={index === inSection.length - 1 || Boolean(busy)}
                      aria-label="Move later"
                      className="rounded-lg p-1.5 text-bark-700/70 hover:bg-bark-900/5 hover:text-bark-900 disabled:opacity-30"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => run(() => patchPhoto(photo.id, { is_published: !photo.is_published }), 'Saving…')}
                      disabled={Boolean(busy)}
                      aria-label={photo.is_published ? 'Hide from the website' : 'Show on the website'}
                      className="rounded-lg p-1.5 text-bark-700/70 hover:bg-bark-900/5 hover:text-bark-900 disabled:opacity-30"
                    >
                      {photo.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(photo.id)}
                      disabled={Boolean(busy)}
                      aria-label="Remove photo"
                      className="rounded-lg p-1.5 text-bark-700/70 hover:bg-red-50 hover:text-red-700 disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
