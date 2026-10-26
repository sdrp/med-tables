export const SITE_NAME = 'Med Tables';
export const SITE_DESCRIPTION = 'Free, open-source clinician reference tables with cited sources.';
export const REPO = 'sdrp/med-tables';
export const REPO_URL = `https://github.com/${REPO}`;
export const MAINTAINER = { name: '@sdrp', url: 'https://github.com/sdrp' };

/** Prefix a site-relative path with the configured base, e.g. "about/" -> "/med-tables/about/". */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}

/** Absolute URL for a site-relative path, for canonical links and print. */
export function absoluteUrl(path = ''): string {
  return new URL(withBase(path), import.meta.env.SITE).href;
}

export function reportErrorUrl(title: string, slug: string): string {
  const params = new URLSearchParams({
    template: 'report-error.yml',
    title: `Error in: ${title}`,
    table: absoluteUrl(`tables/${slug}/`),
  });
  return `${REPO_URL}/issues/new?${params}`;
}
