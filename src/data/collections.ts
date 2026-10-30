import furnitureCover from '../assets/gallery/indoor/indoor-20.webp';
import { photo, type GalleryImage } from './gallery';
import { doorsCatalog, doorsFlooringCover, flooringCatalog } from './stock';

/**
 * "Explore the Collections": two browsable collections, each split into categories.
 *
 * Furniture & Crafts uses the photo library in src/assets/gallery (<folder>-NN).
 * Photos that don't fit a category (sideboards, shelving) still appear under "All".
 * Categories with no photos yet show a "coming soon" state.
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
/** From the Drive "Rugs" folder (checked: none repeat any other library photo). */
const rugs = (...numbers: number[]) => numbers.map((n) => photo('rugs', n));
/** From the Drive "Stools n benches", "Baskets", "Mirrors" and "Crafts and decoration" folders (checked: no repeats). */
const stools = (...numbers: number[]) => numbers.map((n) => photo('stools', n));
const baskets = (...numbers: number[]) => numbers.map((n) => photo('baskets', n));
const mirrors = (...numbers: number[]) => numbers.map((n) => photo('mirrors', n));
const crafts = (...numbers: number[]) => numbers.map((n) => photo('crafts', n));

export const collections: Collection[] = [
  {
    id: 'furniture-crafts',
    title: 'Furniture & Crafts',
    description:
      'Handcrafted indoor and outdoor furniture and home crafts — rattan, teak, synthetic wicker, and combination materials.',
    cover: { src: furnitureCover, alt: 'Hand-woven rattan armchair with woven wall baskets' },
    all: [
      ...indoor(...range(1, 22)),
      ...outdoor(...range(1, 32)),
      ...chairs(...range(1, 7)),
      ...dining(...range(1, 5)),
      ...rugs(...range(1, 8)),
      ...stools(...range(1, 12)),
      ...baskets(...range(1, 12)),
      ...mirrors(...range(1, 4)),
      ...crafts(...range(1, 7)),
    ],
    categories: [
      {
        id: 'chairs',
        label: 'Chairs',
        images: [...chairs(...range(1, 7)), ...indoor(1, 6, 7, 18, 19, 20, 22), ...outdoor(...range(1, 22), 24, 26, 29, 30, 32)],
      },
      {
        id: 'set-collections',
        label: 'Set Collections',
        images: [...dining(...range(1, 5)), ...indoor(16), ...outdoor(23, 25, 27, 28, 31)],
      },
      { id: 'tables', label: 'Tables', images: indoor(2, 5, 8, 9, 12, 13, 15) },
      // Upright photos lead and the wide ones are spread out; indoor-04 / -10 are benches already in the library.
      { id: 'stools-benches', label: 'Stools & Benches', images: [...stools(5, 3, 6, 1, 4, 8, 2, 9, 11, 7, 12, 10), ...indoor(4, 10)] },
      { id: 'baskets', label: 'Baskets', images: baskets(1, 2, 3, 6, 4, 5, 8, 7, 11, 9, 12, 10) },
      { id: 'mirrors', label: 'Mirrors', images: mirrors(...range(1, 4)) },
      // indoor-11 / -17 are the woven floor vases and planters already in the library.
      { id: 'crafts-decoration', label: 'Crafts & Decoration', images: [...crafts(...range(1, 7)), ...indoor(11, 17)] },
      { id: 'rugs-carpets', label: 'Rugs & Carpets', images: rugs(...range(1, 8)) },
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
