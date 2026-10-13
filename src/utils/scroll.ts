export function scrollToSection(target: string) {
  const id = target.startsWith('#') ? target.slice(1) : target;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
