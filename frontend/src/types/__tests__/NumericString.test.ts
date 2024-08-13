import { NumericString } from '..';

describe('should test convert numeric using zod', () => {
  it('should success and return data 10', () => {
    const value = '10';
    const result = NumericString.safeParse(value);
    expect(result.success).toBeTruthy();
    expect(result.success && result.data).toBe(10);
    expect(!result.success && result.error).toBeFalsy();
  });
  it('should success and return data 5', () => {
    const value = '5';
    const result = NumericString.safeParse(value);
    expect(result.success).toBeTruthy();
    expect(result.success && result.data).toBe(5);
    expect(!result.success && result.error).toBeFalsy();
  });

  it('should not success and return error', () => {
    const value = 'this is the end';
    const result = NumericString.safeParse(value);
    expect(result.success).toBeFalsy();
    expect(result.success && result.data).toBeFalsy();
    expect(!result.success && result.error.errors[0].message).toBe(
      'Not a number',
    );
  });
});
