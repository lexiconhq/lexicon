import {
  DISCOURSE_IGNORE_NOTIFICATION_LEVEL,
  DISCOURSE_REGULAR_NOTIFICATION_LEVEL,
  getBlocksToSyncToDiscourse,
  mergeBlockedUsernames,
  normalizeUsername,
} from '../blockedUsers';

describe('blockedUsers', () => {
  it('normalizes usernames for comparison', () => {
    expect(normalizeUsername('  Alice ')).toBe('alice');
  });

  it('merges local and discourse ignored lists', () => {
    expect(
      mergeBlockedUsernames(['Alice', 'bob'], ['BOB', 'carol']).sort(),
    ).toEqual(['alice', 'bob', 'carol']);
  });

  it('only syncs pending blocks not already ignored on Discourse', () => {
    expect(
      getBlocksToSyncToDiscourse({
        pending: ['alice', 'bob', 'carol'],
        discourseIgnored: ['bob'],
        currentUsername: 'me',
      }),
    ).toEqual(['alice', 'carol']);
  });

  it('skips self and duplicates in pending sync list', () => {
    expect(
      getBlocksToSyncToDiscourse({
        pending: ['me', 'ME', 'alice', 'alice'],
        discourseIgnored: [],
        currentUsername: 'Me',
      }),
    ).toEqual(['alice']);
  });

  it('uses Discourse string notification levels', () => {
    expect(DISCOURSE_IGNORE_NOTIFICATION_LEVEL).toBe('ignore');
    expect(DISCOURSE_REGULAR_NOTIFICATION_LEVEL).toBe('normal');
  });
});
