import markDark from '../assets/brand/logo-mark-dark.png';
import markLight from '../assets/brand/logo-mark-light.png';
import wordmarkDark from '../assets/brand/logo-wordmark-dark.png';
import wordmarkLight from '../assets/brand/logo-wordmark-light.png';
import { brand, taglineText } from '../data/site';

type BrandLogoProps = {
  /** 'light' = cream chair + lettering for dark backgrounds, 'dark' = brown for light backgrounds. */
  tone: 'light' | 'dark';
  /** Inline (navbar) or stacked with tagline (footer). */
  layout?: 'inline' | 'stacked';
  className?: string;
};

/** Stacks both colour versions of an image and cross-fades between them. */
function ToneImage({ light, dark, tone, alt, className }: { light: string; dark: string; tone: 'light' | 'dark'; alt: string; className: string }) {
  const showDark = tone === 'dark';
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <img src={light} alt={alt} className={`h-full w-auto transition-opacity duration-300 ${showDark ? 'opacity-0' : 'opacity-100'}`} />
      <img
        src={dark}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-auto transition-opacity duration-300 ${showDark ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  );
}

export default function BrandLogo({ tone, layout = 'inline', className = '' }: BrandLogoProps) {
  if (layout === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-start gap-3 ${className}`}>
        <ToneImage light={markLight} dark={markDark} tone={tone} alt="" className="h-16" />
        <ToneImage light={wordmarkLight} dark={wordmarkDark} tone={tone} alt={brand.name} className="h-5 sm:h-6" />
        <span className={`text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.32em] ${tone === 'light' ? 'text-gold-400' : 'text-gold-600'}`}>
          {taglineText}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <ToneImage light={markLight} dark={markDark} tone={tone} alt="" className="h-9 sm:h-10" />
      <ToneImage light={wordmarkLight} dark={wordmarkDark} tone={tone} alt={brand.name} className="h-[15px] sm:h-[18px] xl:h-5" />
    </span>
  );
}
