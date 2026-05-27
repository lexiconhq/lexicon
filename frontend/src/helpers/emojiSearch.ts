import { EMOJI } from '../constants/emoji';

export type EmojiItem = {
  id: number;
  emoji: string;
  name: string;
};

const NUM_COLUMNS = 6;

function chunkEmojis(items: Array<EmojiItem>): Array<Array<EmojiItem>> {
  const rows: Array<Array<EmojiItem>> = [];

  for (let index = 0; index < items.length; index += NUM_COLUMNS) {
    rows.push(items.slice(index, index + NUM_COLUMNS));
  }

  return rows;
}

export const ALL_EMOJI_ROWS = chunkEmojis(EMOJI);

export function filterEmojiRows(query: string): Array<Array<EmojiItem>> {
  if (!query) {
    return ALL_EMOJI_ROWS;
  }

  const filtered = EMOJI.filter(({ name }) => name.includes(query));
  return chunkEmojis(filtered);
}

export const EMOJI_GRID_COLUMNS = NUM_COLUMNS;
