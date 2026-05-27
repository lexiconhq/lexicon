import {
  filterPostsByHiddenWords,
  normalizeHiddenWords,
  profileMatchesHiddenWords,
  shouldHidePostByHiddenWords,
  textContainsHiddenWord,
} from '../hiddenWords';

describe('hiddenWords', () => {
  it('normalizes and deduplicates words', () => {
    expect(normalizeHiddenWords(['Foo', ' foo ', 'BAR', 'a'])).toEqual([
      'foo',
      'bar',
    ]);
  });

  it('matches substrings case-insensitively', () => {
    expect(textContainsHiddenWord('Hello Spoiler World', ['spoiler'])).toBe(
      true,
    );
    expect(textContainsHiddenWord('Hello World', ['spoiler'])).toBe(false);
  });

  it('hides posts when title, content, or username matches', () => {
    expect(
      shouldHidePostByHiddenWords(
        { title: 'Safe', content: 'has spoiler text', username: 'alice' },
        ['spoiler'],
      ),
    ).toBe(true);
    expect(
      shouldHidePostByHiddenWords(
        { title: 'Spoiler alert', content: 'ok', username: 'alice' },
        ['spoiler'],
      ),
    ).toBe(true);
    expect(
      shouldHidePostByHiddenWords(
        { title: 'Safe', content: 'ok', username: 'spoilerfan' },
        ['spoiler'],
      ),
    ).toBe(true);
  });

  it('filters posts and profiles', () => {
    const posts = [
      { title: 'A', content: 'clean', username: 'a' },
      { title: 'B', content: 'bad word', username: 'b' },
    ];
    expect(filterPostsByHiddenWords(posts, ['bad'])).toHaveLength(1);
    expect(
      profileMatchesHiddenWords(
        { username: 'user', name: 'Nice', bioRaw: 'mentions bad things' },
        ['bad'],
      ),
    ).toBe(true);
  });
});
