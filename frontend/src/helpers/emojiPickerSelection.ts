type EmojiSelection = {
  emojiCode: string;
  emojiText: string;
};

type EmojiSelectionHandler = (selection: EmojiSelection) => void;

let selectionHandler: EmojiSelectionHandler | null = null;

export function registerEmojiSelectionHandler(
  handler: EmojiSelectionHandler,
): void {
  selectionHandler = handler;
}

export function clearEmojiSelectionHandler(): void {
  selectionHandler = null;
}

export function completeEmojiSelection(selection: EmojiSelection): void {
  selectionHandler?.(selection);
  selectionHandler = null;
}
