/**
 * Image-only gallery for the Indoor / Outdoor sections.
 *
 * Photos live in src/assets/gallery/<folder>/<folder>-NN.webp (+ -thumb.webp for the grid)
 * and are shown in number order, 4 per row. Every tile has the same 3:4 shape: tall photos
 * fill it, while landscape photos (listed as `wide` below) are shown whole over a blurred
 * copy of themselves so furniture is never cropped off.
 */

export type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
  wide: boolean;
};

const files = import.meta.glob<string>('../assets/gallery/*/*.webp', { eager: true, import: 'default' });

function buildGallery(folder: 'indoor' | 'outdoor', label: string, wide: number[]): GalleryImage[] {
  const prefix = `../assets/gallery/${folder}/`;

  return Object.keys(files)
    .filter((path) => path.startsWith(prefix) && !path.endsWith('-thumb.webp'))
    .sort()
    .map((path) => {
      const n = Number(path.match(/-(\d+)\.webp$/)?.[1]);
      const thumb = files[path.replace(/\.webp$/, '-thumb.webp')];
      if (!thumb) throw new Error(`Missing thumbnail for ${path}`);
      return { src: files[path], thumb, alt: `${label} furniture by Golden Village — photo ${n}`, wide: wide.includes(n) };
    });
}

export const indoorGallery = buildGallery('indoor', 'Indoor', [2, 3, 4, 10, 12, 16, 18, 21]);
export const outdoorGallery = buildGallery('outdoor', 'Outdoor', [23, 25, 27, 28, 31]);
