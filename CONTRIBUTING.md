# Contributing to Med Tables

Thank you for helping. Accuracy matters more than speed here, so every change is reviewed against its sources before it is published.

**Never include patient information** in issues, pull requests, or table content.

## Ways to contribute

- **Report an error:** use the "Report an error" link at the bottom of any table page, or open a [Report an error](https://github.com/sdrp/med-tables/issues/new?template=report-error.yml) issue. Include a source for the correction.
- **Propose a table:** open a [Propose a new table](https://github.com/sdrp/med-tables/issues/new?template=new-table.yml) issue. You do not need to write code.
- **Submit a table directly:** open a pull request that adds a YAML file to `src/content/tables/` (see below).

## Table format

Each table is one YAML file in `src/content/tables/`, named `<slug>.yaml`. The existing files are the reference examples. The schema lives in `src/content.config.ts`.

```yaml
title: Loop diuretic conversion
slug: loop-diuretic-conversion   # kebab-case, must match the file name
category: Cardiology
summary: One or two plain sentences.
status: draft                    # always "draft" in a pull request
reviewed_by: Pending
columns:
  - key: property
    label: Property
  - key: dose
    label: Dose
    unit: mg                     # optional, shown in the header
rows:
  - cells:
      property: "Approximate equivalent IV dose"
      dose: { text: "40", notes: [a] }   # a cell with a footnote
    notes: [b]                           # optional, applies to the whole row
footnotes:
  - id: a
    text: "Footnote text."
    refs: [felker2020]
caveats:
  - "Conversions are approximate."
references:
  - id: felker2020
    citation: "Author A, Author B. Title. Journal. Year;Vol(Issue):Pages."
    pmid: "32164892"             # any of pmid, pmcid, doi, url
    doi: "10.1016/j.jacc.2019.12.059"
```

On the site, footnotes are lettered in order of first appearance and references are numbered in order of first citation, so the ids in the file can be anything short and unique.

The build fails if a cell or row cites an undefined footnote, a footnote cites an undefined reference, a cell uses a key that is not a column, or a table has no references. Run `npm run build` before opening a pull request.

## Reference requirements

- Every value must come from a cited source. Do not round, convert, or derive values unless a footnote says exactly how, and the reviewer agrees.
- Prefer primary sources: guidelines, consensus statements, review articles, and product labeling. Avoid secondary websites.
- Give a PMID, PMCID, or DOI where one exists. Use `url` only for guidelines without one.
- Point to the specific table or section (for example "Table 3") in the citation.
- Where sources disagree, say so in a caveat or footnote rather than choosing silently.
- Keep doses out of tables where they depend on local protocols, and say so in a caveat.

## Writing style

- Plain, short sentences. No marketing language.
- Table titles and categories use title case: capitalize every major word, but not articles, short conjunctions, or prepositions (a, an, the, and, but, or, if, of, to, in, on, for, with).
- Spell out ranges as "8 to 12", not "8-12".
- Do not use em dashes. Use commas, colons, or parentheses.

## How review works

1. New and changed tables are merged with `status: draft`. The site shows them as "Not yet reviewed".
2. A clinician reviewer checks every value, footnote, and caveat against the cited sources, and records any concerns in the pull request.
3. Only the maintainer changes a table to `status: reviewed`, setting `last_reviewed` (YYYY-MM-DD) and `reviewed_by`. The pull request is the review record.
4. Any later change to a reviewed table's values returns it to review.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321/med-tables/
npm run build    # type check, build, search index, service worker
npm run preview  # serve the built site, including search
```

## Licenses

By contributing, you agree that code is licensed under the MIT License (`LICENSE`) and table content under CC BY 4.0 (`LICENSE-CONTENT`).
