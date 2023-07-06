const emojiImageNameRegex = /^emoji-:[^:]+(?::t\d+)?:$/;

export function isEmojiImage(nameContent: string) {
  return emojiImageNameRegex.test(nameContent);
}
