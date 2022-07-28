import { UseFormMethods } from 'react-hook-form';

import { Image } from '../types';

export function formatImageLink(
  name: string,
  width: number,
  height: number,
  url: string,
) {
  return `![${name}|${width} x ${height}](${url})`;
}

export function replaceImageUploadStatus(
  raw: string,
  imageUploadToken: number,
  url: string,
) {
  raw = raw.replace(`[uploading...](${imageUploadToken})`, url);

  return raw;
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

export function reformatMarkdownBeforeUpload(
  raw: string,
  startingCursorPosition: number,
  imagesArray: Array<Image>,
  setValue: UseFormMethods['setValue'],
) {
  const result = insertImageUploadStatus(
    raw,
    startingCursorPosition,
    imagesArray.length + 1,
  );
  setValue('raw', result);
}

export function reformatMarkdownAfterUpload(
  raw: string,
  imagesArray: Array<Image>,
  token: number,
  setValue: UseFormMethods['setValue'],
) {
  let newText = raw;
  newText = replaceImageUploadStatus(raw, token, imagesArray[token - 1].link);

  setValue('raw', newText);
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
