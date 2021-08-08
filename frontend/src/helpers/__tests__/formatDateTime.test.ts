import { formatDateTime } from '../formatDateTime';

let time = /(?:[01]\d):(?:[012345]\d)/;

it('should return the right format for date', () => {
  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'medium', false, 'en-US'),
  ).toBe('Aug 8, 2020');
  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'short', false, 'en-US'),
  ).toBe('08/08/2020');

  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'medium', true, 'en-US'),
  ).toContain('Aug 8, 2020');
  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'medium', true, 'en-US'),
  ).toMatch(time);

  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'short', true, 'en-US'),
  ).toContain('08/08/2020');
  expect(
    formatDateTime('2020-08-08T16:28:06.330Z', 'short', true, 'en-US'),
  ).toMatch(time);

  expect(formatDateTime('2020-18-08T16:28:06.330Z')).toBe('');
  expect(formatDateTime('')).toBe('');
});
