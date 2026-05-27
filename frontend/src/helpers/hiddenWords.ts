import {
  MAX_HIDDEN_WORDS,
  MIN_HIDDEN_WORD_LENGTH,
} from '../constants/hiddenWords';
import { Post, PostWithoutId } from '../types';

export function normalizeHiddenWord(word: string): string {
  return word.trim().toLowerCase();
}

export function normalizeHiddenWords(words: Array<string>): Array<string> {
  const seen = new Set<string>();
  const normalized: Array<string> = [];

  for (const word of words) {
    const entry = normalizeHiddenWord(word);
    if (entry.length < MIN_HIDDEN_WORD_LENGTH || seen.has(entry)) {
      continue;
    }
    seen.add(entry);
    normalized.push(entry);
    if (normalized.length >= MAX_HIDDEN_WORDS) {
      break;
    }
  }

  return normalized;
}

export function textContainsHiddenWord(
  text: string | undefined | null,
  hiddenWords: Array<string>,
): boolean {
  if (!text || hiddenWords.length === 0) {
    return false;
  }

  const haystack = text.toLowerCase();
  return hiddenWords.some((word) => {
    const needle = normalizeHiddenWord(word);
    return needle.length >= MIN_HIDDEN_WORD_LENGTH && haystack.includes(needle);
  });
}

export function profileMatchesHiddenWords(
  profile: {
    username?: string | null;
    name?: string | null;
    bioRaw?: string | null;
  },
  hiddenWords: Array<string>,
): boolean {
  return (
    textContainsHiddenWord(profile.username, hiddenWords) ||
    textContainsHiddenWord(profile.name, hiddenWords) ||
    textContainsHiddenWord(profile.bioRaw, hiddenWords)
  );
}

export function shouldHidePostByHiddenWords(
  post: Pick<Post, 'title' | 'content' | 'username'>,
  hiddenWords: Array<string>,
): boolean {
  return (
    textContainsHiddenWord(post.title, hiddenWords) ||
    textContainsHiddenWord(post.content, hiddenWords) ||
    textContainsHiddenWord(post.username, hiddenWords)
  );
}

export function shouldHideTopicByHiddenWords(
  topic: PostWithoutId,
  hiddenWords: Array<string>,
): boolean {
  return shouldHidePostByHiddenWords(topic, hiddenWords);
}

export function filterPostsByHiddenWords<T extends Pick<Post, 'title' | 'content' | 'username'>>(
  posts: Array<T>,
  hiddenWords: Array<string>,
): Array<T> {
  if (!hiddenWords.length) {
    return posts;
  }
  return posts.filter((post) => !shouldHidePostByHiddenWords(post, hiddenWords));
}

export function filterTopicsByHiddenWords(
  topics: Array<PostWithoutId>,
  hiddenWords: Array<string>,
): Array<PostWithoutId> {
  if (!hiddenWords.length) {
    return topics;
  }
  return topics.filter((topic) => !shouldHideTopicByHiddenWords(topic, hiddenWords));
}

export function shouldHideMessageByHiddenWords(
  message: { title?: string | null },
  hiddenWords: Array<string>,
): boolean {
  return textContainsHiddenWord(message.title, hiddenWords);
}

export function filterMessagesByHiddenWords<T extends { title?: string | null }>(
  messages: Array<T>,
  hiddenWords: Array<string>,
): Array<T> {
  if (!hiddenWords.length) {
    return messages;
  }
  return messages.filter(
    (message) => !shouldHideMessageByHiddenWords(message, hiddenWords),
  );
}

export function shouldHideNotificationByHiddenWords(
  notification: { name?: string | null; message?: string | null },
  hiddenWords: Array<string>,
): boolean {
  return (
    textContainsHiddenWord(notification.name, hiddenWords) ||
    textContainsHiddenWord(notification.message, hiddenWords)
  );
}
