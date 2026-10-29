// Self-hosted fonts, Latin subset only, so the site makes no third-party
// requests and the service worker precaches just these two files.
// Archivo is variable in weight (100 to 900) and width (62% to 125%).
// Kalam is for handwritten accents only (taglines, the hero note).
import archivoUrl from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url';
import kalamUrl from '@fontsource/kalam/files/kalam-latin-400-normal.woff2?url';

export const preloadFonts = [archivoUrl];

const latin =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

export const fontFaceCss = `
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  font-stretch: 62% 125%;
  src: url(${archivoUrl}) format('woff2-variations'), url(${archivoUrl}) format('woff2');
  unicode-range: ${latin};
}
@font-face {
  font-family: 'Kalam';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${kalamUrl}) format('woff2');
  unicode-range: ${latin};
}`;
