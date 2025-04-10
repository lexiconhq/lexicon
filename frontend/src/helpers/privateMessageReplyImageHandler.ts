import { UploadOutput } from '../generatedAPI/server';
import { ImageFormContextValues } from '../types';

import { formatImageLink } from './imageUploadHandler';

/**
 *
 * This function takes an UploadOutput object and extracts relevant properties
 * to create a new object containing the full URL, a shortened URL, and a formatted
 * markdown discourse for the image.
 *
 * @param {UploadOutput} result - The result of the upload, containing various properties
 *                                such as the original filename, dimensions, URLs, etc.
 * @returns {Object} An object containing the following properties:
 *                   - url: The full URL of the uploaded image.
 *                   - shortUrl: A shortened version of the URL for the uploaded image.
 *                   - imageMarkdown: A formatted markdown string representing the image.
 */
export function convertResultUploadIntoImageFormContext(result: UploadOutput) {
  const { originalFilename: name, width, height, shortUrl, url } = result;
  return {
    url: url,
    shortUrl: shortUrl,
    imageMarkdown: formatImageLink(name, width, height, shortUrl),
  };
}

/**
 *
 * This function takes an array of objects containing image markdown strings and a raw content string.
 * It concatenates all the image markdown strings into a single string, separated by newlines, and then
 * appends the raw content string to the end. If the image list is empty, it simply returns the content string.
 *
 * @param {Object} params An object input containing:
 *                          - imageList: <Array<ImageFormContextValues>> - An array of objects, each containing an image markdown string and url
 *                          - content: string - The raw content text to be combined with the image markdown.
 * @returns {string} A string that combines the list of image markdown strings with the raw content text.
 */
export function combineImageMarkdownWithContent({
  imageList,
  content,
}: {
  imageList: Array<ImageFormContextValues>;
  content: string;
}): string {
  if (!imageList.length) {
    return content;
  }

  let imagesMarkdown = imageList
    .map(({ imageMarkdown }) => imageMarkdown)
    .join('\n');
  return imagesMarkdown + '\n' + content;
}
