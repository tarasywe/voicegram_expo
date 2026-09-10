import { makeSessionFixture } from '../__mocks__/auth-factories';
import { useAuthStore } from '../store';
import { credentialsSchema } from '../types/user';

beforeEach(() => {
  useAuthStore.setState({ session: null });
});

describe('useAuthStore', () => {
  it('holds and clears the session', () => {
    const session = makeSessionFixture();

    useAuthStore.getState().setSession(session);
    expect(useAuthStore.getState().session?.user.email).toBe(session.user.email);

    useAuthStore.getState().clearSession();
    expect(useAuthStore.getState().session).toBeNull();
  });
});

describe('credentialsSchema', () => {
  it('accepts a well-formed email and password', () => {
    expect(
      credentialsSchema.safeParse({
        email: 'taras@voicegram.app',
        password: 'hunter22',
      }).success,
    ).toBe(true);
  });

  it('rejects a malformed email and a short password', () => {
    expect(
      credentialsSchema.safeParse({ email: 'nope', password: 'hunter22' }).success,
    ).toBe(false);

    const short = credentialsSchema.safeParse({
      email: 'taras@voicegram.app',
      password: '123',
    });
    expect(short.success).toBe(false);
    if (!short.success) {
      expect(short.error.issues[0]?.message).toBe('Use at least 6 characters');
    }
  });
});
