/**
 * Photos shown in the collection galleries.
 *
 * The full photo library lives in src/assets/gallery/<folder>/<folder>-NN.webp
 * (+ -thumb.webp for the grid). Only the photos picked below are shown; swap a
 * number to feature a different photo. Tall photos suit the 3:4 tiles best.
 */

import { doorsFeature, flooringFeature } from './stock';

export type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
  wide: boolean;
};

type Folder = 'indoor' | 'outdoor' | 'chairs' | 'dining' | 'rugs';

const files = import.meta.glob<string>('../assets/gallery/*/*.webp', { eager: true, import: 'default' });

const labels: Record<Folder, string> = { indoor: 'Indoor', outdoor: 'Outdoor', chairs: 'Seating', dining: 'Dining', rugs: 'Rug' };

/** Landscape photos — shown whole over a blurred copy of themselves instead of being cropped. */
const widePhotos: Record<Folder, number[]> = {
  indoor: [2, 3, 4, 10, 12, 16, 18, 21],
  outdoor: [23, 25, 27, 28, 31],
  chairs: [2, 6, 7],
  dining: [2, 3, 4, 5],
  rugs: [1, 2, 3, 4, 5, 6, 7, 8],
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

/** One large photo per product section, plus where its "View the collection" link leads. */
export type ProductFeature = {
  src: string;
  srcSet: string;
  alt: string;
  /** Small tag shown on the photo. */
  caption: string;
  /** Explore viewer to open: collection id + category id. */
  explore: { collection: string; category: string; label: string };
};

const feature = (image: GalleryImage, alt: string, caption: string, explore: ProductFeature['explore']): ProductFeature => ({
  src: image.src,
  srcSet: `${image.thumb} 640w, ${image.src} 1600w`,
  alt,
  caption,
  explore,
});

export const productFeatures: Record<'furnitures' | 'doors' | 'flooring', ProductFeature> = {
  // From the Living Set category
  furnitures: feature(photo('dining', 4), 'Teak dining table with hand-woven chairs on a sunny terrace', 'Teak dining set', {
    collection: 'furniture-crafts',
    category: 'all',
    label: 'Explore Furniture & Crafts',
  }),
  doors: feature(doorsFeature, doorsFeature.alt, 'Arched teak double doors', {
    collection: 'doors-flooring',
    category: 'doors',
    label: 'View the Doors collection',
  }),
  flooring: feature(flooringFeature, flooringFeature.alt, 'Solid wood flooring', {
    collection: 'doors-flooring',
    category: 'flooring',
    label: 'View the Flooring collection',
  }),
};
