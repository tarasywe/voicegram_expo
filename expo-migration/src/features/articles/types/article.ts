import { z } from 'zod';
import { NAMING, PLAYBACK, RECORDING } from '@/config/constants';

export const audioRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(NAMING.minRecordName).max(NAMING.maxRecordName),
  /** Clip length in seconds, as measured by the recorder. */
  durationSec: z.number().min(0).max(RECORDING.maxDurationSec),
  sizeBytes: z.number().int().min(0),
  /** Skipped during article playback when false. */
  enabled: z.boolean(),
  repeat: z.number().int().min(PLAYBACK.minRepeat).max(PLAYBACK.maxRepeat),
  /** Silence inserted after the clip, in seconds. */
  delaySec: z.number().int().min(PLAYBACK.minDelaySec).max(PLAYBACK.maxDelaySec),
  /** Set on duplicates: the record whose audio file this one copied. */
  originId: z.string().min(1).optional(),
  createdAt: z.number().int(),
});

export const articleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(NAMING.minArticleName).max(NAMING.maxArticleName),
  /** Ordered — index is the playback position, reordered by drag and drop. */
  records: z.array(audioRecordSchema),
  randomOrder: z.boolean(),
  loop: z.boolean(),
  /** Mirrors the legacy "make public" flag; wired to Firebase in a later step. */
  isPublic: z.boolean(),
  syncedAt: z.number().int().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type AudioRecord = z.infer<typeof audioRecordSchema>;
export type Article = z.infer<typeof articleSchema>;
