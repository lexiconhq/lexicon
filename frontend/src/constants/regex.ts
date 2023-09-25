// Capture group 1: capture the attribute of the quote bb code
// Capture group 2: capture the content of the quote
export const QUOTE_REGEX =
  /\[quote(?:="([^"]*)")?\]([\s\S]*?)\[\/quote\](?:\n|$)/g;
export const QUOTE_OPEN_REGEX = /\[quote(?:="([^"]*)")?\]/g;
export const QUOTE_CLOSE_REGEX = /(\[\/quote\])(?!.*\1)/g;
