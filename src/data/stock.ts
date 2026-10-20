import type { GalleryImage } from './gallery';

/**
 * PLACEHOLDER stock photos for the Doors and Flooring galleries.
 *
 * These are free-licence photos from Pexels (https://www.pexels.com/license/), used only until
 * Golden Village's own door and flooring product photos are available. Replace them with real
 * product photos before using the site for sales, so buyers see the actual products.
 */

const url = (id: number, w: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const pexels = (id: number, alt: string): GalleryImage => ({ src: url(id, 1600), thumb: url(id, 640), alt, wide: false });

/** Single feature photos for the Doors and Flooring sections. */
export const doorsFeature = pexels(12596661, 'Arched teak double door in a white stucco wall');
export const flooringFeature = pexels(7027842, 'Elegant room with warm solid wood flooring and a chandelier');

export const doorsGallery: GalleryImage[] = [
  pexels(14125257, 'Carved solid wood double doors on a classic facade'),
  doorsFeature,
  pexels(13600510, 'Modern solid wood panel door in a minimalist hallway'),
];

export const flooringGallery: GalleryImage[] = [
  flooringFeature,
  pexels(368754, 'Close-up of light engineered wood floor planks'),
  pexels(3935327, 'Bright room with warm solid wood flooring'),
];

/** Fuller sets for the "Explore the Collections" Doors & Flooring view (same placeholder caveat). */
export const doorsCatalog: GalleryImage[] = [
  ...doorsGallery,
  pexels(6015516, 'Hand-carved solid wood double doors'),
  pexels(14118340, 'Ornate carved wooden door with an arched frame'),
  pexels(8134757, 'Modern engineered wood doors set in wood-panelled walls'),
];

export const flooringCatalog: GalleryImage[] = [
  ...flooringGallery,
  pexels(7587861, 'Chevron parquet wood flooring in a modern kitchen'),
  pexels(3935315, 'Living room with warm hardwood flooring'),
  pexels(6835181, 'Spacious room with natural hardwood floors'),
];

export const doorsFlooringCover = {
  src: url(12700466, 1400),
  srcSet: [700, 1100, 1600].map((w) => `${url(12700466, w)} ${w}w`).join(', '),
  alt: 'Home foyer with a solid wood door and warm wood flooring',
};
