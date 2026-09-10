import { mockSignIn, mockSignUp } from '../api/mock-auth';
import { authSessionSchema } from '../types/user';

const CREDENTIALS = { email: 'taras@voicegram.app', password: 'hunter22' };

describe('mockSignIn', () => {
  it('returns a session that satisfies the schema', async () => {
    const session = await mockSignIn(CREDENTIALS);

    expect(authSessionSchema.safeParse(session).success).toBe(true);
    expect(session.user.email).toBe(CREDENTIALS.email);
    expect(session.user.displayName).toBe('Taras');
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it('rejects a disabled account', async () => {
    await expect(
      mockSignIn({ ...CREDENTIALS, email: 'locked@voicegram.app' }),
    ).rejects.toThrow('disabled');
  });

  it('rejects a bad password', async () => {
    await expect(
      mockSignIn({ ...CREDENTIALS, password: 'wrongpassword' }),
    ).rejects.toThrow('Wrong email or password.');
  });
});

describe('mockSignUp', () => {
  it('creates a session for a fresh email', async () => {
    const session = await mockSignUp(CREDENTIALS);
    expect(authSessionSchema.safeParse(session).success).toBe(true);
  });

  it('rejects an email that is already taken', async () => {
    await expect(
      mockSignUp({ ...CREDENTIALS, email: 'taken@voicegram.app' }),
    ).rejects.toThrow('already uses this email');
  });
});
