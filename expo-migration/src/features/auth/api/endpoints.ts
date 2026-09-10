/**
 * Auth is handled entirely by the Firebase SDK, which resolves its own
 * endpoints from the native config files. This file records that so nobody
 * goes looking for a base URL that does not exist.
 */
export const authProvider = 'firebase' as const;
