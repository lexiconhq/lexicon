import { normalizeTopicTags } from '../normalizeTopicTags';

it('returns string tags unchanged', () => {
  expect(normalizeTopicTags(['biohacking', 'nutrition'])).toEqual([
    'biohacking',
    'nutrition',
  ]);
});

it('maps Discourse tag objects to display names', () => {
  expect(
    normalizeTopicTags([
      { id: 1, name: 'Biohacking', slug: 'biohacking' },
      { id: 2, slug: 'sleep' },
    ]),
  ).toEqual(['Biohacking', 'sleep']);
});

it('handles empty input', () => {
  expect(normalizeTopicTags(null)).toEqual([]);
  expect(normalizeTopicTags([])).toEqual([]);
});
