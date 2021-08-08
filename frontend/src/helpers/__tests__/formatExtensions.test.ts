import { formatExtensions } from '../formatExtensions';

it('should return empty array', () => {
  expect(formatExtensions()).toEqual([]);
  expect(formatExtensions([])).toEqual([]);
});

it('should return original extensions', () => {
  expect(formatExtensions(['jpeg', 'jpg', 'png'])).toEqual([
    'jpeg',
    'jpg',
    'png',
  ]);
});

it('should return processed extensions', () => {
  expect(formatExtensions(['.jpeg', '.jpg', '.png'])).toEqual([
    'jpeg',
    'jpg',
    'png',
  ]);
});
