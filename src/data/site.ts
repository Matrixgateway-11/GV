import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Factory, Handshake, Leaf, PencilRuler } from 'lucide-react';
import heroPhoto from '../assets/hero.webp';
import aboutPhoto from '../assets/gallery/indoor/indoor-05.webp';

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

export const heroImage = heroPhoto;
export const heroHighlights = ['SVLK certified wood', 'OEM & ODM available', 'Worldwide shipping'];

export const intro = {
  lead: 'Golden Village Furnitures is a trusted B2B exporter of premium furniture, solid and engineering wood doors, and wood flooring, based in the heart of Java, Indonesia.',
  partners:
    'We partner with importers, wholesalers, retailers, developers, and hospitality projects worldwide to deliver authentic Indonesian craftsmanship at export-quality standards.',
};

export const audiences = ['Importers', 'Wholesalers', 'Retailers', 'Developers', 'Hospitality projects'];

export type ProductLine = {
  id: 'furnitures' | 'doors' | 'flooring';
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  materials: string[];
  enquiry: { label: string; subject: string };
};

export const productLines: ProductLine[] = [
  {
    id: 'furnitures',
    number: '01',
    title: 'Furnitures',
    eyebrow: 'Our Furnitures Collection',
    description:
      'Handcrafted indoor and outdoor furniture — rattan, teak, synthetic wicker, and combination materials. Designed for durability, comfort, and timeless elegance.',
    materials: ['Rattan', 'Teak', 'Synthetic wicker', 'Combination materials'],
    enquiry: { label: 'Request Furniture Catalog', subject: 'Furniture catalog request' },
  },
  {
    id: 'doors',
    number: '02',
    title: 'Doors',
    eyebrow: 'Our Doors Collection',
    description:
      'Solid and engineering doors — teak, merbau, and engineered wood. Custom sizes, carvings, and finishes for residential, commercial, and project needs.',
    materials: ['Teak', 'Merbau', 'Engineered wood', 'Custom sizes', 'Carvings & finishes'],
    enquiry: { label: 'Request Doors Catalog', subject: 'Doors catalog request' },
  },
  {
    id: 'flooring',
    number: '03',
    title: 'Wood Flooring',
    eyebrow: 'Our Flooring Collection',
    description:
      'Premium solid and engineered wood flooring — teak and exotic woods. Sustainable, durable, and crafted for luxury living.',
    materials: ['Solid wood', 'Engineered wood', 'Teak', 'Exotic woods'],
    enquiry: { label: 'Request Flooring Catalog', subject: 'Wood flooring catalog request' },
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

export const commitment =
  'We are not just selling products — we are building long-term partnerships. From Central Java, Indonesia to your showroom anywhere in the world, we ensure quality that speaks for itself.';

export const aboutImage = aboutPhoto;

export const contactCta = {
  title: "Let's Build Your Next Collection Together.",
  text: 'Contact us today for catalog, factory price list, and samples.',
};
