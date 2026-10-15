import { brand } from '../data/site';

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <span className={`font-display text-xl md:text-[1.4rem] font-semibold tracking-[0.14em] uppercase leading-none ${className}`}>
      {brand.first} <span className="gradient-gold font-bold">{brand.second}</span>
    </span>
  );
}
