/**
 * Photos shown in the collection galleries.
 *
 * The full photo library lives in src/assets/gallery/<folder>/<folder>-NN.webp
 * (+ -thumb.webp for the grid). Only the photos picked below are shown; swap a
 * number to feature a different photo. Tall photos suit the 3:4 tiles best.
 */

import { doorsGallery, flooringGallery } from './stock';

export type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
  wide: boolean;
};

type Folder = 'indoor' | 'outdoor' | 'chairs' | 'dining';

const files = import.meta.glob<string>('../assets/gallery/*/*.webp', { eager: true, import: 'default' });

const labels: Record<Folder, string> = { indoor: 'Indoor', outdoor: 'Outdoor', chairs: 'Seating', dining: 'Dining' };

/** Landscape photos — shown whole over a blurred copy of themselves instead of being cropped. */
const widePhotos: Record<Folder, number[]> = {
  indoor: [2, 3, 4, 10, 12, 16, 18, 21],
  outdoor: [23, 25, 27, 28, 31],
  chairs: [2, 6, 7],
  dining: [2, 3, 4, 5],
};

export function photo(folder: Folder, n: number): GalleryImage {
  const name = `${folder}-${String(n).padStart(2, '0')}`;
  const src = files[`../assets/gallery/${folder}/${name}.webp`];
  const thumb = files[`../assets/gallery/${folder}/${name}-thumb.webp`];
  if (!src || !thumb) throw new Error(`Missing gallery photo: ${folder}/${name}`);
  return {
    src,
    thumb,
    alt: `${labels[folder]} furniture by Golden Village Furnitures — photo ${n}`,
    wide: widePhotos[folder].includes(n),
  };
}

// Row 1: indoor pieces (shelving, coffee table, rattan armchair)
// Row 2: outdoor pieces (rocking chair, lounge chair, stool set)
export const furnitureGallery: GalleryImage[] = [
  photo('indoor', 14),
  photo('indoor', 13),
  photo('indoor', 20),
  photo('outdoor', 16),
  photo('outdoor', 6),
  photo('outdoor', 17),
];

/** Photos shown under each product section, keyed by product line id. */
export const productGalleries: Record<'furnitures' | 'doors' | 'flooring', GalleryImage[]> = {
  furnitures: furnitureGallery,
  doors: doorsGallery,
  flooring: flooringGallery,
};
