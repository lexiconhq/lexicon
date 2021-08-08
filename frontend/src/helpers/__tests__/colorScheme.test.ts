import { filterColorScheme } from '../colorScheme';

it('should return undefined color', () => {
  expect(filterColorScheme(null)).toEqual(undefined);
});

it('should return light color', () => {
  expect(filterColorScheme('light')).toEqual('light');
});
