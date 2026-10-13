import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgress() {
  const barRef = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
