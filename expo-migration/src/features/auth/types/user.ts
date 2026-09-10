import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Use at least 6 characters'),
});

/** Parsed from every auth response before it reaches the store. */
export const userSchema = z.object({
  uid: z.string().min(1),
  email: z.email(),
  displayName: z.string().min(1),
  photoUrl: z.url().nullable(),
  createdAt: z.number().int(),
});

export const authSessionSchema = z.object({
  user: userSchema,
  token: z.string().min(1),
  expiresAt: z.number().int(),
});

export type Credentials = z.infer<typeof credentialsSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
