import furnitureCover from '../assets/gallery/indoor/indoor-20.webp';
import { photo, type GalleryImage } from './gallery';
import { doorsCatalog, doorsFlooringCover, flooringCatalog } from './stock';

/**
 * "Explore the Collections": two browsable collections, each split into categories.
 *
 * Furniture & Crafts uses the photo library in src/assets/gallery (indoor-NN / outdoor-NN).
 * Photos that don't fit a category (sideboards, shelving, benches, vases, planters) still
 * appear under "All". Categories with no photos yet show a "coming soon" state.
 * Doors & Flooring uses the placeholder stock photos from ./stock until real ones are added.
 */

export type CollectionCategory = { id: string; label: string; images: GalleryImage[] };

export type Collection = {
  id: string;
  title: string;
  description: string;
  cover: { src: string; srcSet?: string; alt: string };
  /** Every photo in the collection (shown on the "All" tab). */
  all: GalleryImage[];
  categories: CollectionCategory[];
};

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const indoor = (...numbers: number[]) => numbers.map((n) => photo('indoor', n));
const outdoor = (...numbers: number[]) => numbers.map((n) => photo('outdoor', n));
/** From the Drive "Chairs" and "Dining set" folders (checked: none repeat the indoor/outdoor photos). */
const chairs = (...numbers: number[]) => numbers.map((n) => photo('chairs', n));
const dining = (...numbers: number[]) => numbers.map((n) => photo('dining', n));

export const collections: Collection[] = [
  {
    id: 'furniture-crafts',
    title: 'Furniture & Crafts',
    description:
      'Handcrafted indoor and outdoor furniture and home crafts — rattan, teak, synthetic wicker, and combination materials.',
    cover: { src: furnitureCover, alt: 'Hand-woven rattan armchair with woven wall baskets' },
    all: [...indoor(...range(1, 22)), ...outdoor(...range(1, 32)), ...chairs(...range(1, 7)), ...dining(...range(1, 5))],
    categories: [
      {
        id: 'chairs',
        label: 'Chairs',
        images: [...chairs(...range(1, 7)), ...indoor(1, 6, 7, 18, 19, 20, 22), ...outdoor(...range(1, 22), 24, 26, 29, 30, 32)],
      },
      {
        id: 'living-set',
        label: 'Living Set',
        images: [...dining(...range(1, 5)), ...indoor(16), ...outdoor(23, 25, 27, 28, 31)],
      },
      { id: 'tables', label: 'Tables', images: indoor(2, 5, 8, 9, 12, 13, 15) },
      { id: 'lampshade', label: 'Lampshade', images: [] },
      { id: 'rugs-carpets', label: 'Rugs & Carpets', images: [] },
    ],
  },
  {
    id: 'doors-flooring',
    title: 'Doors & Flooring',
    description: 'Solid and engineered wood doors and premium wood flooring — teak, merbau, and exotic woods.',
    cover: doorsFlooringCover,
    all: [...doorsCatalog, ...flooringCatalog],
    categories: [
      { id: 'doors', label: 'Doors', images: doorsCatalog },
      { id: 'flooring', label: 'Flooring', images: flooringCatalog },
    ],
  },
];
