import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const id = z.string().min(1);
const kebab = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case');

const cell = z.union([
  z.string(),
  z.strictObject({
    text: z.string(),
    notes: z.array(id).min(1),
  }),
]);

const table = z
  .strictObject({
    title: z.string().min(1),
    slug: kebab,
    category: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['draft', 'reviewed']),
    // YAML parses bare YYYY-MM-DD as a Date; accept a quoted string too.
    last_reviewed: z.coerce.date().optional(),
    reviewed_by: z.string().min(1),
    columns: z
      .array(
        z.strictObject({
          key: id,
          label: z.string().min(1),
          unit: z.string().min(1).optional(),
        }),
      )
      .min(1),
    rows: z
      .array(
        z.strictObject({
          cells: z.record(z.string(), cell),
          notes: z.array(id).optional(),
        }),
      )
      .min(1),
    footnotes: z
      .array(
        z.strictObject({
          id,
          text: z.string().min(1),
          refs: z.array(id).optional(),
        }),
      )
      .default([]),
    caveats: z.array(z.string().min(1)).default([]),
    references: z
      .array(
        z.strictObject({
          id,
          citation: z.string().min(1),
          pmid: z.string().regex(/^\d+$/, 'PMID must be digits').optional(),
          pmcid: z.string().regex(/^PMC\d+$/, 'PMCID must look like PMC1234567').optional(),
          doi: z.string().regex(/^10\.\S+\/\S+$/, 'DOI must start with 10.').optional(),
          url: z.url().optional(),
        }),
      )
      .min(1, 'every table must cite at least one reference'),
  })
  .superRefine((t, ctx) => {
    const issue = (message: string, path: (string | number)[]) =>
      ctx.addIssue({ code: 'custom', message, path });

    const dupes = (ids: string[]) => ids.filter((x, i) => ids.indexOf(x) !== i);
    for (const d of dupes(t.columns.map((c) => c.key))) issue(`duplicate column key "${d}"`, ['columns']);
    for (const d of dupes(t.footnotes.map((f) => f.id))) issue(`duplicate footnote id "${d}"`, ['footnotes']);
    for (const d of dupes(t.references.map((r) => r.id))) issue(`duplicate reference id "${d}"`, ['references']);

    const columnKeys = new Set(t.columns.map((c) => c.key));
    const footnoteIds = new Set(t.footnotes.map((f) => f.id));
    const referenceIds = new Set(t.references.map((r) => r.id));

    t.rows.forEach((row, r) => {
      for (const n of row.notes ?? []) {
        if (!footnoteIds.has(n)) issue(`row cites undefined footnote "${n}"`, ['rows', r, 'notes']);
      }
      for (const [key, c] of Object.entries(row.cells)) {
        if (!columnKeys.has(key)) issue(`cell key "${key}" is not a defined column`, ['rows', r, 'cells', key]);
        if (typeof c !== 'string') {
          for (const n of c.notes) {
            if (!footnoteIds.has(n)) issue(`cell cites undefined footnote "${n}"`, ['rows', r, 'cells', key]);
          }
        }
      }
    });

    t.footnotes.forEach((f, i) => {
      for (const ref of f.refs ?? []) {
        if (!referenceIds.has(ref)) issue(`footnote "${f.id}" cites undefined reference "${ref}"`, ['footnotes', i, 'refs']);
      }
    });

    if (t.status === 'reviewed') {
      if (!t.last_reviewed) issue('reviewed tables need last_reviewed', ['last_reviewed']);
      if (t.reviewed_by.trim().toLowerCase() === 'pending') issue('reviewed tables need a reviewer name', ['reviewed_by']);
    }
  });

const tables = defineCollection({
  loader: glob({
    pattern: '*.{yaml,yml}',
    base: './src/content/tables',
    // Use the file name as the id so two files can never share a slug.
    // The table page checks that slug matches the file name.
    generateId: ({ entry }) => entry.replace(/\.ya?ml$/, ''),
  }),
  schema: table,
});

export const collections = { tables };
