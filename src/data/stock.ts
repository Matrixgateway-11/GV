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

export const doorsGallery: GalleryImage[] = [
  pexels(14125257, 'Carved solid wood double doors on a classic facade'),
  pexels(12596661, 'Arched teak double door in a white stucco wall'),
  pexels(13600510, 'Modern solid wood panel door in a minimalist hallway'),
];

export const flooringGallery: GalleryImage[] = [
  pexels(7027842, 'Elegant room with warm solid wood flooring and a chandelier'),
  pexels(368754, 'Close-up of light engineered wood floor planks'),
  pexels(3935327, 'Bright room with warm solid wood flooring'),
];
