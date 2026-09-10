import { z } from 'zod';

/**
 * The shapes the original app wrote. Everything is tolerant: fields were
 * optional in practice and a malformed row must not break the whole listing.
 */

/**
 * The original app wrote several of these through a `Picker`, whose values are
 * strings — `delay: "120"`, not `120`. Coercing rather than rejecting is what
 * keeps those values; a plain `z.number()` fell through to the catch and
 * silently zeroed every delay.
 *
 * Booleans get their own reader instead of `z.coerce.boolean()`, which is
 * `Boolean(value)` and would read the string `"false"` as `true`.
 */
const looseBoolean = (fallback: boolean) =>
  z
    .union([z.boolean(), z.string(), z.number()])
    .transform((value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value !== 0;
      return value === 'true' || value === '1';
    })
    .catch(fallback);
export const remoteArticleSchema = z.object({
  name: z.string().min(1).catch('Untitled'),
  random: looseBoolean(false),
  repeat: looseBoolean(false),
  size: z.coerce.number().catch(0),
  author: z.string().optional(),
  shared: looseBoolean(false).optional(),
});

export const remoteRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).catch('Untitled'),
  duration: z.coerce.number().catch(0),
  size: z.coerce.number().catch(0),
  position: z.coerce.number().catch(0),
  repeat: z.coerce.number().min(1).catch(1),
  delay: z.coerce.number().min(0).catch(0),
  enable: looseBoolean(true),
  /** Set on duplicates: the record whose audio file this one shares. */
  origin: z.string().optional(),
});

/** `articles/{aid}/records` — an index of `{ id, title }` keyed by record id. */
export const remoteRecordIndexSchema = z.record(
  z.string(),
  z.object({ id: z.string().min(1), title: z.string().optional() }),
);

export type RemoteArticle = z.infer<typeof remoteArticleSchema>;
export type RemoteRecord = z.infer<typeof remoteRecordSchema>;

/** An article that exists in the cloud, with its local availability resolved. */
export type CloudArticle = RemoteArticle & {
  id: string;
  /** False when the article has not been downloaded to this device. */
  isOnDevice: boolean;
};
