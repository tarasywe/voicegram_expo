import { create } from 'zustand';

export type TransferKind = 'upload' | 'download';

export type TransferState = {
  kind: TransferKind;
  /** 0–1 across every record in the article. */
  progress: number;
  /** Records finished so far, and how many there are in total. */
  done: number;
  total: number;
  error: string | null;
};

type SyncState = {
  /** Keyed by article id — several articles can transfer at once. */
  transfers: Record<string, TransferState>;

  begin: (articleId: string, kind: TransferKind, total: number) => void;
  setProgress: (articleId: string, progress: number, done: number) => void;
  fail: (articleId: string, error: string) => void;
  finish: (articleId: string) => void;
};

/**
 * Live transfer progress. Deliberately *not* React Query state: this is
 * ephemeral UI feedback, not a cache of anything the server owns.
 */
export const useSyncStore = create<SyncState>()((set) => ({
  transfers: {},

  begin: (articleId, kind, total) =>
    set((state) => ({
      transfers: {
        ...state.transfers,
        [articleId]: { kind, progress: 0, done: 0, total, error: null },
      },
    })),

  setProgress: (articleId, progress, done) =>
    set((state) => {
      const current = state.transfers[articleId];
      if (!current) return state;
      return {
        transfers: {
          ...state.transfers,
          [articleId]: { ...current, progress: Math.min(1, Math.max(0, progress)), done },
        },
      };
    }),

  fail: (articleId, error) =>
    set((state) => {
      const current = state.transfers[articleId];
      if (!current) return state;
      return { transfers: { ...state.transfers, [articleId]: { ...current, error } } };
    }),

  finish: (articleId) =>
    set((state) => {
      const { [articleId]: _removed, ...rest } = state.transfers;
      return { transfers: rest };
    }),
}));

export const useTransfer = (articleId: string): TransferState | undefined =>
  useSyncStore((state) => state.transfers[articleId]);
