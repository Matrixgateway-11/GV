import { brand } from '../data/site';

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <span className={`font-serif text-2xl tracking-wide ${className}`}>
      {brand.first}
      <span className="gradient-gold font-semibold">{brand.second}</span>
    </span>
  );
}
