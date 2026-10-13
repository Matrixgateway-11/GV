/**
 * Image-only gallery layout for the Indoor / Outdoor sections.
 *
 * Photos live in src/assets/gallery/<folder>/<folder>-NN.webp (+ -thumb.webp),
 * numbered by the order they were shot. Each grid is 4 columns wide and every
 * row has the same height:
 *   - tall photos take 1 column
 *   - 'wide'    photos take 2 columns (landscape shots: sideboards, benches, sofas)
 *   - 'feature' photos take 2 columns x 2 rows (highlight tiles)
 * The order below is arranged so every row is exactly filled on desktop (4 cols)
 * and on phones (2 cols) — keep tall photos in pairs when editing it.
 */

export type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
  span: 'tall' | 'wide' | 'feature';
};

const files = import.meta.glob<string>('../assets/gallery/*/*.webp', { eager: true, import: 'default' });

type Tile = number | { n: number; span: 'wide' | 'feature' };

function buildGallery(folder: 'indoor' | 'outdoor', label: string, tiles: Tile[]): GalleryImage[] {
  return tiles.map((tile) => {
    const { n, span } = typeof tile === 'number' ? { n: tile, span: 'tall' as const } : tile;
    const name = `${folder}-${String(n).padStart(2, '0')}`;
    const src = files[`../assets/gallery/${folder}/${name}.webp`];
    const thumb = files[`../assets/gallery/${folder}/${name}-thumb.webp`];
    if (!src || !thumb) throw new Error(`Missing gallery image: ${folder}/${name}`);
    return { src, thumb, alt: `${label} furniture by Golden Village — photo ${n}`, span };
  });
}

const wide = (n: number) => ({ n, span: 'wide' as const });
const feature = (n: number) => ({ n, span: 'feature' as const });

// 22 photos -> 9 full rows
export const indoorGallery = buildGallery('indoor', 'Indoor', [
  feature(14), 1, 6, wide(3),
  wide(16), 13, 9,
  11, 15, wide(4),
  19, 20, feature(5), wide(10),
  22, 17, wide(12),
  wide(21), 7, 8,
  wide(2), wide(18),
]);

// 32 photos -> 10 full rows
export const outdoorGallery = buildGallery('outdoor', 'Outdoor', [
  1, 2, 3, 4,
  wide(23), 5, 6,
  7, 8, wide(25),
  9, 10, feature(16), 11, 12,
  wide(27), 13, 14,
  15, 17, 18, 19,
  20, 21, wide(28),
  22, 24, 26, 29,
  wide(31), 30, 32,
]);
