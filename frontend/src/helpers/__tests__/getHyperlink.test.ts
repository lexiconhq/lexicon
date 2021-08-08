import { getHyperlink } from '../getHyperlink';

it('should add a protocol', () => {
  const url = 'www.google.com';
  const title = 'Google';

  expect(getHyperlink(url, title)).toEqual({
    newUrl: 'https://www.google.com',
    newTitle: 'Google',
  });
});

it('should add a protocol and a sub-domain', () => {
  const url = 'google.com';
  const title = 'Google';

  expect(getHyperlink(url, title)).toEqual({
    newUrl: 'https://www.google.com',
    newTitle: 'Google',
  });
});

it('should add a title', () => {
  const url = 'google.com';
  const title = '';

  expect(getHyperlink(url, title)).toEqual({
    newUrl: 'https://www.google.com',
    newTitle: 'google.com',
  });
});

it('should remains the same', () => {
  const url = 'http://www.abc.com/def/ghi/';
  const title = 'abc';

  expect(getHyperlink(url, title)).toEqual({
    newUrl: 'http://www.abc.com/def/ghi/',
    newTitle: 'abc',
  });
});
