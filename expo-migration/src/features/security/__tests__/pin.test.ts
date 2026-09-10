import { clearPin, hasPin, PIN_LENGTH, setPin, verifyPin } from '../lib/pin';

beforeEach(async () => {
  await clearPin();
});

describe('PIN storage', () => {
  it('stores and verifies a well-formed PIN', async () => {
    expect(await setPin('1234')).toBe(true);
    expect(await hasPin()).toBe(true);
    expect(await verifyPin('1234')).toBe(true);
    expect(await verifyPin('4321')).toBe(false);
  });

  it('refuses PINs that are the wrong length or not digits', async () => {
    expect(await setPin('123')).toBe(false);
    expect(await setPin('12345')).toBe(false);
    expect(await setPin('12a4')).toBe(false);
    expect(await setPin('')).toBe(false);
    expect(await hasPin()).toBe(false);
  });

  it('reports no match once cleared', async () => {
    await setPin('1234');
    await clearPin();
    expect(await hasPin()).toBe(false);
    expect(await verifyPin('1234')).toBe(false);
  });

  it('expects a four digit PIN', () => {
    expect(PIN_LENGTH).toBe(4);
  });
});
