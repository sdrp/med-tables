// Icon and accent color for each category heading on the home page. Icons are
// 24x24 line drawings (stroke only), so they take the heading's text color.
// A category without an entry gets the fallback icon and a rotating color.

export interface CategoryStyle {
  color: string; // CSS custom property for the icon tile
  icon: string; // SVG inner markup
}

const heart = 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z';

const icons = {
  // Heart with an ECG trace.
  cardiology: `<path d="${heart}"/><path d="M4.5 12.5h3.2l1.6-2.6 2.4 5 1.8-3.4h6"/>`,
  // IV fluid bag on a line.
  criticalCare:
    '<path d="M9 3.5h6"/><path d="M12 3.5v2"/><path d="M7.5 5.5h9v8a4.5 4.5 0 0 1-9 0z"/><path d="M10 9.5h4M10 12.5h4"/><path d="M12 18v3.5"/>',
  // Two fused rings of a steroid nucleus (hormones).
  endocrinology:
    '<path d="M7.67 7l4.33 2.5v5L7.67 17l-4.33-2.5v-5z"/><path d="M16.33 7l4.33 2.5v5L16.33 17 12 14.5v-5z"/>',
  // Heart with a defibrillation bolt.
  resuscitation: `<path d="${heart}"/><path d="M12.8 9.2l-2.4 3.6h3.2l-2.4 3.6"/>`,
  // Fallback: a small table.
  table: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9.5 5v14"/>',
};

const styles: Record<string, CategoryStyle> = {
  cardiology: { color: 'var(--sec-cv)', icon: icons.cardiology },
  'critical care': { color: 'var(--sec-cc)', icon: icons.criticalCare },
  endocrinology: { color: 'var(--sec-en)', icon: icons.endocrinology },
  resuscitation: { color: 'var(--sec-cc)', icon: icons.resuscitation },
};

const rotation = ['var(--sec-cc)', 'var(--sec-cv)', 'var(--sec-en)', 'var(--sec-re)'];

export function categoryStyle(category: string, index: number): CategoryStyle {
  return styles[category.toLowerCase()] ?? { color: rotation[index % rotation.length], icon: icons.table };
}

export function categoryId(category: string): string {
  return `cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}
