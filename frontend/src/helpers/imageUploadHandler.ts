import { Image } from '../types';

export function formatImageLink(
  name: string,
  width: number,
  height: number,
  url: string,
) {
  return `![${name}|${width} x ${height}](${url})`;
}

export function getReplacedImageUploadStatus(
  raw: string,
  imageUploadToken: number,
  url: string,
) {
  return raw.replace(`[uploading...](${imageUploadToken})`, url);
}

export function insertImageUploadStatus(
  raw: string,
  cursorPosition: number,
  imageUploadToken: number,
) {
  const textBeforeCursorPosition = raw.substring(0, cursorPosition);
  const textAfterCursorPosition = raw.substring(cursorPosition, raw.length);

  raw = `${textBeforeCursorPosition}${
    textBeforeCursorPosition.length ? '\n' : ''
  }[uploading...](${imageUploadToken})${
    textAfterCursorPosition.length ? '\n' : ' '
  }${textAfterCursorPosition}`;

  return raw;
}

export function updateImagesArray(
  imagesArray: Array<Image>,
  imageUrl: string,
  token: number,
  setImagesArray: (imagesArray: Array<Image>) => void,
) {
  let newArray = imagesArray;
  newArray[token] = { link: imageUrl, done: true };
  setImagesArray(newArray);
}
