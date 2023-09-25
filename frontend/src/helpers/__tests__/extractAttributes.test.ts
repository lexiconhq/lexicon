import { extractAttributes } from '../extractAttributes';

describe('return empty object if empty string is passed', () => {
  it('should return empty object if empty string is passed', () => {
    expect(extractAttributes('')).toEqual({});
  });
});

describe('return empty object if there is no attribute', () => {
  it('should return empty object if there is no attribute', () => {
    expect(
      extractAttributes('no, attributes, will, return, an, empty, object'),
    ).toEqual({});
  });
});

describe('return attribute in object if there is attributes', () => {
  it('should return attribute in object if there is attributes', () => {
    expect(
      extractAttributes(
        'one:1,two:2, space-after-comma:ok, space-before-comma:ok ,two-colons::skipped,::empty-key,overwritten-attribute:original,overwritten-attribute:latest',
      ),
    ).toEqual({
      one: '1',
      two: '2',
      'space-after-comma': 'ok',
      'space-before-comma': 'ok',
      'two-colons': '',
      '': '',
      'overwritten-attribute': 'latest',
    });
  });
});
