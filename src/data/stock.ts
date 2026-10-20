/**
 * PLACEHOLDER stock photos for the Doors and Wood Flooring sections.
 *
 * These are free-licence photos from Pexels (https://www.pexels.com/license/), used only until
 * Golden Village's own door and flooring product photos are available. Replace them with real
 * product photos before using the site for sales, so buyers see the actual products.
 */

export type StockImage = { src: string; srcSet: string; alt: string };

const url = (id: number, w: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

function pexels(id: number, alt: string): StockImage {
  return { src: url(id, 1000), srcSet: [600, 1000, 1400].map((w) => `${url(id, w)} ${w}w`).join(', '), alt };
}

export const doorImages = {
  main: pexels(14125257, 'Carved solid wood double doors on a classic facade'),
  detail: pexels(8134757, 'Modern engineered wood doors set in wood-panelled walls'),
  card: pexels(12596661, 'Arched teak double door in a white stucco wall'),
};

export const flooringImages = {
  main: pexels(7027842, 'Elegant room with warm solid wood flooring and a chandelier'),
  detail: pexels(368754, 'Close-up of light engineered wood floor planks'),
  card: pexels(3935327, 'Bright room with warm solid wood flooring'),
};
