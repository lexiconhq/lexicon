import { Post, PostWithoutId } from '../types';

/** Discourse `PUT /u/:username/notification_level.json` expects string levels, not integers. */
export const DISCOURSE_IGNORE_NOTIFICATION_LEVEL = 'ignore';
export const DISCOURSE_REGULAR_NOTIFICATION_LEVEL = 'normal';

/** Max ignore duration on Discourse (see ignore-duration UI). */
const DISCOURSE_MAX_IGNORE_MONTHS = 4;

export function discourseIgnoreExpiringAt(): string {
  const expiringAt = new Date();
  expiringAt.setMonth(expiringAt.getMonth() + DISCOURSE_MAX_IGNORE_MONTHS);
  return expiringAt.toISOString();
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function mergeBlockedUsernames(
  local: Array<string>,
  discourseIgnored: Array<string>,
): Array<string> {
  const merged = new Set<string>();
  local.forEach((username) => merged.add(normalizeUsername(username)));
  discourseIgnored.forEach((username) => merged.add(normalizeUsername(username)));
  return Array.from(merged);
}

/** Pending local blocks that still need to be applied on Discourse after sign-in. */
export function getBlocksToSyncToDiscourse(params: {
  pending: Array<string>;
  discourseIgnored: Array<string>;
  currentUsername?: string | null;
}): Array<string> {
  const { pending, discourseIgnored, currentUsername } = params;
  const discourseSet = new Set(
    discourseIgnored.map((username) => normalizeUsername(username)),
  );
  const current = normalizeUsername(currentUsername ?? '');
  const seen = new Set<string>();
  const toSync: Array<string> = [];

  for (const username of pending) {
    const normalized = normalizeUsername(username);
    if (
      !normalized ||
      normalized === current ||
      discourseSet.has(normalized) ||
      seen.has(normalized)
    ) {
      continue;
    }
    seen.add(normalized);
    toSync.push(username);
  }

  return toSync;
}

export function isUsernameBlocked(
  username: string | undefined | null,
  blockedUsernames: Set<string>,
): boolean {
  if (!username) {
    return false;
  }
  return blockedUsernames.has(normalizeUsername(username));
}

export function filterPostsByBlockedUsernames<T extends Pick<Post, 'username'>>(
  posts: Array<T>,
  blockedUsernames: Set<string>,
): Array<T> {
  return posts.filter((post) => !isUsernameBlocked(post.username, blockedUsernames));
}

export function filterTopicsByBlockedUsernames(
  topics: Array<PostWithoutId>,
  blockedUsernames: Set<string>,
): Array<PostWithoutId> {
  return topics.filter((topic) => {
    if (isUsernameBlocked(topic.username, blockedUsernames)) {
      return false;
    }
    return !topic.freqPosters?.some((poster) =>
      isUsernameBlocked(poster.username, blockedUsernames),
    );
  });
}
