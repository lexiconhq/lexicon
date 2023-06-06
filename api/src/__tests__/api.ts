import { DEFAULT_PROSE_APP_PORT, getAppPort } from '../constants';

describe('getAppPort', () => {
  it('should return the default port value when the params are undefined', () => {
    expect(getAppPort(undefined, undefined)).toEqual(DEFAULT_PROSE_APP_PORT);
  });
  it('should return one of the params in number when the other one is undefined', () => {
    expect(getAppPort('8929', undefined)).toEqual(8929);
    expect(getAppPort(undefined, '8929')).toEqual(8929);
  });
  it('should return the first param in number when both params are provided', () => {
    expect(getAppPort('8929', '1234')).toEqual(8929);
  });
  it('should return the number param when the other one is not a number', () => {
    expect(getAppPort('8929', 'lexicon')).toEqual(8929);
    expect(getAppPort('lexicon', '1234')).toEqual(1234);
  });
  it('should return the default port value when both params are not numbers', () => {
    expect(getAppPort('lexicon', 'cool')).toEqual(DEFAULT_PROSE_APP_PORT);
  });
});
