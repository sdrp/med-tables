import type { CollectionEntry } from 'astro:content';

type Table = CollectionEntry<'tables'>['data'];
type Reference = Table['references'][number];

export interface NoteMark {
  id: string; // footnote id from the YAML
  label: string; // display letter, e.g. "a"
  anchor: string; // unique id of this marker, for back-links
}

export interface RenderedCell {
  text: string;
  notes: NoteMark[];
}

export interface RenderedRow {
  cells: RenderedCell[]; // in column order
  notes: NoteMark[]; // notes that apply to the whole row
}

export interface RenderedFootnote {
  id: string;
  label: string;
  text: string;
  backrefs: string[]; // anchors of every marker that cites this footnote
  refs: { id: string; number: number }[];
}

export interface RenderedReference extends Reference {
  number: number;
  links: { label: string; value: string; href: string }[];
}

/** 0 -> a, 25 -> z, 26 -> aa, 27 -> ab ... */
export function letter(n: number): string {
  let s = '';
  n += 1;
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(97 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function referenceLinks(r: Reference): RenderedReference['links'] {
  const links: RenderedReference['links'] = [];
  if (r.pmid) links.push({ label: 'PubMed', value: r.pmid, href: `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` });
  if (r.pmcid) links.push({ label: 'PMC', value: r.pmcid, href: `https://pmc.ncbi.nlm.nih.gov/articles/${r.pmcid}/` });
  if (r.doi) links.push({ label: 'DOI', value: r.doi, href: `https://doi.org/${r.doi}` });
  if (r.url) links.push({ label: 'URL', value: r.url, href: r.url });
  return links;
}

/**
 * Turn a validated table into render-ready rows, footnotes and references.
 *
 * Footnotes are lettered in order of first appearance: rows top to bottom,
 * cells in column order, then the row's own notes. Footnotes never cited by a
 * row or cell follow in file order.
 *
 * References are numbered in order of first citation by a footnote (in
 * footnote display order), then any remaining references in file order.
 */
export function prepareTable(t: Table) {
  const footnoteOrder: string[] = [];
  const backrefs = new Map<string, string[]>();

  const mark = (id: string): NoteMark => {
    if (!footnoteOrder.includes(id)) footnoteOrder.push(id);
    const list = backrefs.get(id) ?? [];
    const anchor = `fnref-${id}-${list.length + 1}`;
    list.push(anchor);
    backrefs.set(id, list);
    return { id, label: '', anchor };
  };

  const rows: RenderedRow[] = t.rows.map((row) => {
    const cells = t.columns.map((col) => {
      const c = row.cells[col.key];
      if (c === undefined) return { text: '', notes: [] };
      if (typeof c === 'string') return { text: c, notes: [] };
      return { text: c.text, notes: c.notes.map(mark) };
    });
    return { cells, notes: (row.notes ?? []).map(mark) };
  });

  for (const f of t.footnotes) {
    if (!footnoteOrder.includes(f.id)) footnoteOrder.push(f.id);
  }
  const labels = new Map(footnoteOrder.map((id, i) => [id, letter(i)]));
  for (const row of rows) {
    for (const n of [...row.cells.flatMap((c) => c.notes), ...row.notes]) n.label = labels.get(n.id)!;
  }

  const byId = new Map(t.footnotes.map((f) => [f.id, f]));
  const orderedFootnotes = footnoteOrder.map((id) => byId.get(id)!);

  const refOrder: string[] = [];
  for (const f of orderedFootnotes) {
    for (const r of f.refs ?? []) if (!refOrder.includes(r)) refOrder.push(r);
  }
  for (const r of t.references) if (!refOrder.includes(r.id)) refOrder.push(r.id);
  const refNumber = new Map(refOrder.map((id, i) => [id, i + 1]));
  const refById = new Map(t.references.map((r) => [r.id, r]));

  const footnotes: RenderedFootnote[] = orderedFootnotes.map((f) => ({
    id: f.id,
    label: labels.get(f.id)!,
    text: f.text,
    backrefs: backrefs.get(f.id) ?? [],
    refs: (f.refs ?? []).map((id) => ({ id, number: refNumber.get(id)! })),
  }));

  const references: RenderedReference[] = refOrder.map((id) => {
    const r = refById.get(id)!;
    return { ...r, number: refNumber.get(id)!, links: referenceLinks(r) };
  });

  // Columns whose content is long get a minimum width so prose does not wrap
  // into a tall, thin column on small screens.
  const wideColumns = t.columns.map((_, i) => rows.some((r) => r.cells[i].text.length > 40));

  return { rows, footnotes, references, wideColumns };
}

export function formatDate(d: Date): string {
  // Dates come from YAML as UTC midnight; format in UTC to avoid an off-by-one day.
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
