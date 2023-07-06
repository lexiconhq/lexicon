import { isEmojiImage } from '../emojiHandler';

describe('check is this image emoji', () => {
  test('isEmojiImage should return true for valid emoji image names', () => {
    expect(isEmojiImage('emoji-:smile:')).toBe(true);
    expect(isEmojiImage('emoji-:heart:')).toBe(true);
    expect(isEmojiImage('emoji-:thumbs_up:')).toBe(true);
    expect(isEmojiImage('emoji-:thumbs_up:t5:')).toBe(true);
  });

  test('isEmojiImage should return false for invalid emoji image names', () => {
    expect(isEmojiImage('emoji-:smile')).toBe(false);
    expect(isEmojiImage('emoji-:happy:face:')).toBe(false);
    expect(isEmojiImage('emoji-:')).toBe(false);
    expect(isEmojiImage('emoji-::')).toBe(false);
    expect(isEmojiImage('emoji-:smile:happy:')).toBe(false);
  });
});
