/** Domain-wide limits. Mirrors the constraints of the original app. */
export const RECORDING = {
  /** Hard stop for a single clip, in seconds. */
  maxDurationSec: 15,
  /** Guard rail from the legacy app — keeps an article syncable. */
  maxRecordsPerArticle: 50,
  /** Update cadence of the recorder status listener, in ms. */
  statusIntervalMs: 100,
} as const;

export const PLAYBACK = {
  /** Bounds for the per-record repeat counter. */
  minRepeat: 1,
  maxRepeat: 20,
  /** Bounds for the per-record delay, in seconds. Matches the original app's
   *  picker, which went up to two minutes. */
  minDelaySec: 0,
  maxDelaySec: 120,
  /** The ladder the delay control steps through — a 0-120 range at 1s a tap
   *  would be unusable. Mirrors the original app's preset list. */
  delayOptionsSec: [0, 1, 2, 3, 5, 10, 15, 20, 30, 45, 60, 90, 120],
} as const;

export const NAMING = {
  minArticleName: 1,
  maxArticleName: 60,
  minRecordName: 1,
  maxRecordName: 60,
} as const;
