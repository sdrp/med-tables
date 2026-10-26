# Med Tables

Med Tables is a free, open-source website of clinician reference tables (loop diuretic conversions, the H's and T's, corticosteroid equivalents, and more). Every table shows its footnotes, caveats, references, and review status. The site is static, fast on a phone, works offline once visited, prints cleanly, and has no trackers. It is an educational reference only and not a substitute for clinical judgment.

Live site: https://sdrp.github.io/med-tables/

## Local development

Requires Node 22.12 or later.

```bash
npm install
npm run dev       # dev server at http://localhost:4321/med-tables/ (search is not available in dev)
npm run build     # astro check, astro build, Pagefind index, service worker
npm run preview   # serve dist/ locally, including search and offline support
```

Tables live in `src/content/tables/` as YAML files, validated by the schema in `src/content.config.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the format and review process.

## Deploy

The site deploys to GitHub Pages with the workflow in `.github/workflows/deploy.yml`. Every push to `main` builds and deploys; pull requests build (so broken tables fail CI) but do not deploy.

One-time setup: in the repository on GitHub, go to **Settings > Pages** and set **Source** to **GitHub Actions**.

The site is served under `/med-tables/`. To use a custom domain, set `site` to the domain and remove `base` in `astro.config.mjs`, then add the domain under **Settings > Pages**.

## Licenses

- Code: [MIT](LICENSE)
- Table content in `src/content/`: [CC BY 4.0](LICENSE-CONTENT)
