import type { LucideIcon } from 'lucide-react';
import { Eye, Hammer, Leaf, Shield } from 'lucide-react';
import heroPhoto from '../assets/hero.webp';

export const brand = {
  first: 'Golden',
  second: 'Village',
  full: 'Golden Village',
  email: 'hello@goldenvillage.com',
  phone: '+1 (555) 234-7890',
  address: '142 Design District, NY',
};

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Indoor', href: '#indoor' },
  { label: 'Outdoor', href: '#outdoor' },
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
};

const pexels = (id: number, w = 940, h = 650) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=${h}&w=${w}`;

export const heroImage = heroPhoto;

export const aboutImage = pexels(13068373, 1000, 800);

export const indoorProducts: Product[] = [
  {
    id: 'indoor-1',
    name: 'Solace Sectional',
    category: 'Living Room',
    image: pexels(8135275),
    description: 'Deep oatmeal-toned seats in soft woven linen, sized for slow weekend afternoons.',
  },
  {
    id: 'indoor-2',
    name: 'Aurelia Dining Table',
    category: 'Dining Room',
    image: pexels(14598479),
    description: 'A veined marble top on a slim gold-toned base, ringed by plush velvet chairs.',
  },
  {
    id: 'indoor-3',
    name: 'Lumière Bedroom Suite',
    category: 'Bedroom',
    image: pexels(7535063),
    description: 'A padded, tufted headboard dressed in layered linens beneath a glowing chandelier.',
  },
  {
    id: 'indoor-4',
    name: 'Haven Lounge Set',
    category: 'Living Room',
    image: pexels(27164969),
    description: 'Low-profile seating in warm neutrals for a calm, uncluttered living space.',
  },
  {
    id: 'indoor-5',
    name: 'Oakhurst Dining Set',
    category: 'Dining Room',
    image: pexels(5998031),
    description: 'A solid oak table and spindle-back chairs made for long family dinners.',
  },
  {
    id: 'indoor-6',
    name: 'Jade Hideaway',
    category: 'Bedroom',
    image: pexels(8135505),
    description: 'Rich green textiles and brass details that turn a bedroom into a quiet escape.',
  },
];

export const outdoorProducts: Product[] = [
  {
    id: 'outdoor-1',
    name: 'Sundeck Lounge Set',
    category: 'Lounge',
    image: pexels(2962114),
    description: 'Slatted timber deck chairs beside a dining nook for meals under the open sky.',
  },
  {
    id: 'outdoor-2',
    name: 'Woven Garden Daybed',
    category: 'Lounge',
    image: pexels(6363758),
    description: 'A hand-woven rattan frame topped with deep cushions for unhurried garden hours.',
  },
  {
    id: 'outdoor-3',
    name: 'Al Fresco Dining Set',
    category: 'Dining',
    image: pexels(39833689),
    description: 'Weatherproof wicker seating gathered around a teak table, ready for outdoor feasts.',
  },
  {
    id: 'outdoor-4',
    name: 'Lagoon Sun Loungers',
    category: 'Lounge',
    image: pexels(38701759),
    description: 'Padded wooden recliners built for lazy, sunlit afternoons beside the water.',
  },
  {
    id: 'outdoor-5',
    name: 'Courtyard Bistro Set',
    category: 'Dining',
    image: pexels(2615407),
    description: 'A rustic timber table and chairs that bring easy charm to any small courtyard.',
  },
  {
    id: 'outdoor-6',
    name: 'Palm Wicker Sofa',
    category: 'Lounge',
    image: pexels(6430742),
    description: 'An all-weather woven sofa with soft cushions, perfectly at home among lush greenery.',
  },
];

export type Value = { icon: LucideIcon; title: string; description: string };

export const values: Value[] = [
  {
    icon: Hammer,
    title: 'Artisan Craft',
    description: 'Every piece is finished by hand by makers skilled in joinery, carving and upholstery.',
  },
  {
    icon: Leaf,
    title: 'Responsible Materials',
    description: 'We build with certified timber and recycled fabrics so each collection treads lightly.',
  },
  {
    icon: Eye,
    title: 'Enduring Design',
    description: 'Silhouettes that outlast seasons and trends — furniture made to be handed down.',
  },
  {
    icon: Shield,
    title: 'Built to Last',
    description: 'Each frame carries a lifetime structural warranty, because good furniture should stay.',
  },
];

export const stats = [
  { value: '12+', label: 'Years of craft' },
  { value: '200+', label: 'Unique pieces' },
  { value: '50k', label: 'Homes styled' },
];
