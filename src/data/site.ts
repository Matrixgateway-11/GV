import type { LucideIcon } from 'lucide-react';
import { Eye, Hammer, Leaf, Shield } from 'lucide-react';
import heroPhoto from '../assets/hero.webp';

export const brand = {
  first: 'Golden',
  second: 'Village',
  full: 'Golden Village',
  email: 'goldenvillageholdcom@gmail.com',
  phone: '+62 877-7060-8222',
  address: '142 Design District, NY',
};

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Furnitures', href: '#furnitures' },
  { label: 'Doors', href: '#doors' },
  { label: 'Flooring', href: '#flooring' },
  { label: 'About', href: '#about' },
];

const pexels = (id: number, w = 940, h = 650) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=${h}&w=${w}`;

export const heroImage = heroPhoto;

export const aboutImage = pexels(13068373, 1000, 800);

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
