import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Factory, Handshake, Leaf, PencilRuler } from 'lucide-react';
import heroPhoto from '../assets/hero.webp';
import whyPhoto from '../assets/gallery/outdoor/outdoor-02.webp';
import aboutPhoto from '../assets/gallery/dining/dining-03.webp';
import aboutPhotoSmall from '../assets/gallery/dining/dining-03-thumb.webp';
import aboutDetailPhoto from '../assets/about/coffee-table.webp';
import aboutDetailPhotoSmall from '../assets/about/coffee-table-thumb.webp';
import contactPhoto from '../assets/gallery/outdoor/outdoor-27.webp';

/** All site copy lives here — edit text in this file rather than in the components. */

export const brand = {
  name: 'Golden Village Furnitures',
  tagline: ['Furnitures', 'Doors', 'Flooring'],
  slogan: 'From Indonesia to the World',
  /** Used for the "Request Catalog" / enquiry buttons. */
  email: 'goldenvillageholdcom@gmail.com',
  emails: ['admgoldenvillageholdcom@gmail.com', 'goldenvillageholdcom@gmail.com'],
  phone: '+62 877-7060-8222',
  /** Same number in international format, for WhatsApp / tel: links. */
  phoneDigits: '6287770608222',
  website: 'www.goldenvillagefurnitureindonesia.com',
  websiteUrl: 'http://www.goldenvillagefurnitureindonesia.com',
  location: 'Central Java, Indonesia',
};

export const taglineText = brand.tagline.join(' • ');

export const mailto = (subject: string) => `mailto:${brand.email}?subject=${encodeURIComponent(subject)}`;

export const whatsappUrl = `https://wa.me/${brand.phoneDigits}?text=${encodeURIComponent(
  `Hello ${brand.name}, I would like to request your catalog and factory price list.`,
)}`;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Furnitures', href: '#furnitures' },
  { label: 'Doors', href: '#doors' },
  { label: 'Flooring', href: '#flooring' },
  { label: 'About', href: '#about' },
];

export const hero = {
  image: heroPhoto,
  eyebrow: 'Handcrafted Furniture House',
  titleLine1: 'Every Room',
  titleLine2: 'Deserves a Story',
  text: 'Thoughtfully made pieces for the rooms you live in and the gardens you escape to — From Indonesia to the World.',
};

/** Scrolling strip under the hero. */
export const marqueeItems = ['Furnitures', 'Doors', 'Flooring', 'SVLK Certified', 'OEM & ODM', 'Worldwide Shipping', 'From Indonesia to the World'];

export const intro = {
  /** Shown as the large statement under "What We Do"; the brand name is highlighted. */
  lead: 'is a trusted B2B exporter of premium furniture, solid and engineering wood doors, and wood flooring, based in the heart of Java, Indonesia.',
  partners:
    'We partner with importers, wholesalers, retailers, developers, and hospitality projects worldwide to deliver authentic Indonesian craftsmanship at export-quality standards.',
  highlights: ['SVLK certified wood', 'OEM & ODM available', 'Worldwide shipping', 'Direct factory price'],
};

export const audiences = ['Importers', 'Wholesalers', 'Retailers', 'Developers', 'Hospitality projects'];

export type ProductLine = {
  id: 'furnitures' | 'doors' | 'flooring';
  title: string;
  /** Small label above the title (kept different from the title itself). */
  label: string;
  description: string;
  /** Shown as small tags under the description. */
  materials: string[];
};

export const productLines: ProductLine[] = [
  {
    id: 'furnitures',
    title: 'Furnitures',
    label: 'Indoor & Outdoor',
    description:
      'Handcrafted indoor and outdoor furniture — rattan, teak, synthetic wicker, and combination materials. Designed for durability, comfort, and timeless elegance.',
    materials: ['Rattan', 'Teak', 'Synthetic wicker', 'Combination materials'],
  },
  {
    id: 'doors',
    title: 'Doors',
    label: 'Solid & Engineered',
    description:
      'Solid and engineering doors — teak, merbau, and engineered wood. Custom sizes, carvings, and finishes for residential, commercial, and project needs.',
    materials: ['Teak', 'Merbau', 'Engineered wood', 'Custom sizes', 'Carvings & finishes'],
  },
  {
    id: 'flooring',
    title: 'Flooring',
    label: 'Teak & Exotic Woods',
    description:
      'Premium solid and engineered wood flooring — teak and exotic woods. Sustainable, durable, and crafted for luxury living.',
    materials: ['Solid wood', 'Engineered wood', 'Teak', 'Exotic woods'],
  },
];

export type Reason = { icon: LucideIcon; title: string; description: string };

export const reasons: Reason[] = [
  {
    icon: Handshake,
    title: 'B2B Focused',
    description: 'We understand bulk orders, custom specifications, and project timelines.',
  },
  {
    icon: BadgeCheck,
    title: 'Export Quality',
    description: 'Strict QC, proper packing, and on-time shipment worldwide.',
  },
  {
    icon: PencilRuler,
    title: 'Custom Made',
    description: 'OEM & ODM available — your design, our craftsmanship.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Source',
    description: 'Legally sourced wood, SVLK certified.',
  },
  {
    icon: Factory,
    title: 'Competitive Factory Price',
    description: 'Direct from manufacturer.',
  },
];

export const whyImage = { src: whyPhoto, alt: 'Teak armchair with a hand-woven rope seat and back on a garden deck' };

export const commitment = {
  quote: 'We are not just selling products — we are building long-term partnerships.',
  text: 'From Central Java, Indonesia to your showroom anywhere in the world, we ensure quality that speaks for itself.',
};

/** "Who We Are" photos, both landscape — width/height keep each photo's own shape, so nothing is cropped or padded. */
export const aboutImages = {
  main: {
    src: aboutPhoto,
    srcSet: `${aboutPhotoSmall} 640w, ${aboutPhoto} 1600w`,
    alt: 'Teak trestle dining table with six woven-back armchairs on a stone terrace',
    caption: 'Teak dining set',
    width: 1600,
    height: 668,
  },
  detail: {
    src: aboutDetailPhoto,
    srcSet: `${aboutDetailPhotoSmall} 640w, ${aboutDetailPhoto} 1600w`,
    alt: 'Solid teak slatted coffee table in a light living room',
    caption: 'Teak coffee table',
    width: 1600,
    height: 883,
  },
};

export const contactCta = {
  title: "Let's Build Your Next Collection Together.",
  text: 'Contact us today for catalog, factory price list, and samples.',
  image: contactPhoto,
};
