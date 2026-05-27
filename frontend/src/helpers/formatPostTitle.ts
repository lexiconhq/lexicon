import { EMOJI } from '../constants/emoji';

import { unescapeHTML } from './unescapeHTML';

const emojiByName = new Map(
  EMOJI.map(({ name, emoji }) => [name, emoji] as const),
);

/** Discourse shortcodes, e.g. :wave: or :+1:t5: */
const EMOJI_SHORTCODE_REGEX = /:([a-z0-9_+-]+)(?::t([1-6]))?:/gi;

/** Cooked titles may include emoji <img> tags from Discourse. */
const EMOJI_IMG_TAG_REGEX =
  /<img[^>]*class="[^"]*emoji[^"]*"[^>]*alt="([^"]*)"[^>]*>/gi;

function resolveEmojiFromShortcode(shortcode: string): string | undefined {
  const normalized = shortcode.replace(/^:|:$/g, '');
  const match = normalized.match(/^([a-z0-9_+-]+)(?::t([1-6]))?$/i);
  if (!match) {
    return undefined;
  }

  const [, name, tone] = match;
  const key = tone ? `${name}:t${tone}` : name;
  return emojiByName.get(key);
}

/**
 * Formats topic/post titles for display: unescapes HTML entities and renders
 * Discourse emoji shortcodes (e.g. :wave:) as native unicode emoji.
 */
export function formatPostTitle(title: string): string {
  if (!title) {
    return title;
  }

  let result = unescapeHTML(title);

  result = result.replace(EMOJI_IMG_TAG_REGEX, (_, alt) => {
    return resolveEmojiFromShortcode(alt) ?? alt;
  });

  result = result.replace(EMOJI_SHORTCODE_REGEX, (match, name, tone) => {
    const key = tone ? `${name}:t${tone}` : name;
    return emojiByName.get(key) ?? match;
  });

  result = result.replace(/<[^>]+>/g, '');

  return result.trim();
}
