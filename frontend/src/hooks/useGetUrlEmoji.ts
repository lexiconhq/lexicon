/**
 * This will change format emoji from :speech_ballon: into speech_ballon
 * or :bearded_person:t6: into :bearded_person/6:
 */

import { useStorage } from '../helpers';

export function useGetUrlEmoji(emojiCode?: string) {
  const storage = useStorage();

  if (!emojiCode) {
    return '';
  }

  const status = storage.getItem('userStatus');
  const external_emoji_url = status?.externalEmojiUrl || '';
  const emoji_set = status?.emojiSet || '';
  const base_path = status?.discourseBaseUrl || '';

  const emojiName = emojiCode
    .replace(/(^:|:$)/g, '')
    .replace(/(.+):t([1-6])/, '$1/$2');
  let url = '';
  if (!external_emoji_url) {
    url = `${base_path}/images/emoji/${emoji_set}/${emojiName}.png?v=12`;
  } else {
    url = `${external_emoji_url}/${emoji_set}/${emojiName}.png?v=12`;
  }
  return url;
}
