/* eslint-disable no-useless-escape */

import { DEFAULT_IMAGE } from '../../assets/images';
import { NO_EXCERPT_WORDING } from '../constants';
import { ImageFormContextValues, PollFormContextValues } from '../types';

import { convertPollMarkdown } from './convertPollMarkdown';
import { formatRelativeTime } from './formatRelativeTime';
import { combineContentWithPollContent } from './pollUtility';
import { combineImageMarkdownWithContent } from './privateMessageReplyImageHandler';
import { replaceQuotesWithMarkdown } from './replaceQuotesWithMarkdown';

export function getPostShortUrl(content: string): Array<string> | undefined {
  //used in Post Preview scene to get all image shortUrls.

  const shortUrlRegex = /\((upload:\/\/\S+(?:jpe?g|png|gif|heic|heif))\)/g;
  const result = content.match(shortUrlRegex) ?? undefined;

  return result?.map((item) => item.replace(shortUrlRegex, '$1'));
}

function formatTime(_: string, s1: string) {
  return formatRelativeTime(s1, true, false);
}

export function handleUnsupportedMarkdown(content?: string) {
  if (!content) {
    return '';
  }

  let result = content;

  result = replaceQuotesWithMarkdown(result);

  const dateRegex = /\[(?:date=)([\d/-]*) (?:timezone=")(.*?)"\]/g;
  result = result.replace(dateRegex, formatTime);

  return result;
}

type LookUpUrl = {
  shortUrl: string;
  url: string;
};

export function sortImageUrl(
  shortUrls: Array<string>,
  lookUpUrls: Array<LookUpUrl>,
): Array<string> {
  //used in Post Preview scene. the original urls will be sorted based on their order in shortUrls
  let idx;

  return shortUrls.map((url) => {
    idx = lookUpUrls.findIndex(({ shortUrl }) => shortUrl === url);
    return idx !== -1 ? lookUpUrls[idx].url : '';
  });
}

type MarkdownWithImage = {
  content: string;
  imageUrl?: string;
  mentionedUsers?: Array<string>;
};

export function anchorToMarkdown(rawContent: string): MarkdownWithImage {
  //used in activity scene, all images and url are rendered in anchor tag, while emojis are rendered in image tags
  //image
  const imgRegex =
    /<a[^>]*? href="([^>]+(?:jpe?g|png|gif|heic|heif))".*?>(.*?)<\/a>/g;
  let content = rawContent.replace(imgRegex, '');

  //image in a square bracket
  const sqBracketImgRegex =
    /\[\w*\-?\w*\.?(jpe?g|png|gif|heic|heif)?\|\d*\sx\s\d*\]/g;
  content = content.replace(sqBracketImgRegex, '');

  //mention
  const mentionRegex = /<a class=\"mention\".*?>@(.*?)<\/a>/g;
  //get list of mentions
  let keywords = content.match(mentionRegex) ?? [];
  let mentionedUsers = keywords?.map((item) =>
    item.replace(mentionRegex, '$1'),
  );
  content = content.replace(mentionRegex, '@$1');

  //link
  const linkRegex = /<a href="(.*?)".*?>(.*?)<\/a>/g;
  content = content.replace(linkRegex, '[$2]($1)');

  //emoji
  const emojiRegex = /<img.*?class="emoji.*? alt="(.*?)">/g;
  content = content.replace(emojiRegex, '$1');

  //img tag other than emoji
  const imgRegex2 =
    /<img.*? src="(\S+(?:jpe?g|png|gif|heic|heif))".*? alt="(.*?)".*?>/g;
  content = content.replace(imgRegex2, '');

  //anchor empty tag
  const anchorRegex = /<a.*>([\s\S]*?)<\/a>/g;
  content = content.replace(anchorRegex, '$1');

  content = content === '' ? NO_EXCERPT_WORDING : content;

  //get first image url
  let imagesUrl = rawContent.match(imgRegex) ?? [];
  let imageUrl = imagesUrl[0]
    ? imagesUrl[0].replace(imgRegex, '$1')
    : undefined;

  return { content, imageUrl, mentionedUsers };
}

const imageMarkdownRegex = /(!\[.*?\]\()(upload:\/\/\S*)(\))/g;
export function generateMarkdownContent(
  raw: string,
  imageUrls?: Array<string>,
) {
  let imageCount = 0;
  const markdown = raw.replace(
    imageMarkdownRegex,
    (
      _: string,
      imageName: string,
      _shortImageUrl: string,
      closeParenthesis: string,
    ) => {
      const currentImageUrl = imageUrls?.[imageCount] ?? DEFAULT_IMAGE;
      const modifiedImageMarkdown = `${imageName}${currentImageUrl}${closeParenthesis}`;
      imageCount += 1;

      return modifiedImageMarkdown;
    },
  );
  return markdown;
}

export function filterMarkdownContentPoll(content?: string) {
  if (!content) {
    return {
      pollMarkdowns: [],
      filteredMarkdown: '',
    };
  }

  let result = content;

  const pollRegex = /\[(poll)([\s\S]*?)(\[\/\1)\]/g;

  return {
    pollMarkdowns: result.match(pollRegex) || [],
    filteredMarkdown: result.replace(pollRegex, '').trimStart(),
  };
}

// Replacing collapsible markdown in topic's excerpt with '[details]'
// Ex: <details><summary>Collapsible</summary>Content</details> => [details]
export function replaceTagsInContent(content: string) {
  const collapsibleTagRegex = /<details><summary>.+?<\/summary>.*<\/details>/gs;
  return content.replace(collapsibleTagRegex, '[details]');
}

/**
 * This function replaces image markdown patterns in the given content with a placeholder text.
 *
 * @param {Object} params An object containing the following properties:
 *                      - {string} content: The string content or markdown to be processed
 *                      - {string} placeholder='': The placeholder to replace the image markdown with
 *
 * @returns {object} {filterMarkdown: string} - An object containing the modified content in the `filterMarkdown` property.
 *                   {imageMarkdowns: Array<string>} - an object containing array of image markdown from content.
 */

export function replaceImageMarkdownWithPlaceholder({
  content,
  placeholder = '',
}: {
  content?: string;
  placeholder?: string;
}) {
  if (!content) {
    return {
      filterMarkdown: '',
      imageMarkdowns: [],
    };
  }

  // Regex pattern to match image markdown patterns with a specific format. example: ![undefined-1684143577983.jpg|3000 x 2002](upload://9WdaMOPqn99avHbcfhVV5ZbG91e.jpeg)

  const regexImage =
    /!\[([^\|]+)\|(\d+)\s*x\s*(\d+)\]\((upload:\/\/\S+(?:jpe?g|png|gif|heic|heif))\)/g;

  let result = content;

  return {
    imageMarkdowns: result.match(regexImage) || [],
    filterMarkdown: result.replace(regexImage, placeholder).trimStart(),
  };
}

/**
 * Combines the content markdown with images and polls if they exist.
 *
 * @param {Object} param The parameters required for combining data contains:
 *                       - {string} content: content markdown without poll and images
 *                       - {Array<ImageFormContextValues>} imageList: An array of objects, each containing an image markdown string and url
 *                       - {Array<PollFormContextValues>} polls: An array of polls with content
 *
 * @returns {string} - The combined content markdown with images and/or polls.
 */

export function combineDataMarkdownPollAndImageList({
  content,
  imageList,
  polls,
}: {
  content: string;
  imageList?: Array<ImageFormContextValues>;
  polls?: Array<PollFormContextValues>;
}): string {
  let newContentMarkdown = content;
  /**
   * Combine content of image markdown
   */
  if (imageList && !!imageList.length) {
    newContentMarkdown = combineImageMarkdownWithContent({
      imageList,
      content: newContentMarkdown,
    });
  }
  /**
   * Combine content of poll markdown
   */
  if (polls && !!polls.length) {
    newContentMarkdown = combineContentWithPollContent({
      content: newContentMarkdown,
      polls,
    });
  }

  return newContentMarkdown;
}

/**
 * This function will processes a markdown of a private message reply to extract and handle polls and images markdown.
 *
 * It will returns an object containing the processed data, including:
 * - `polls`: A list of polls PollFormContextValues converted from markdown.
 * - `newContentFilterRaw`: The content with poll and image markdowns removed.
 * - `imageMessageReplyList`: A list of ImageFormContextValues.
 *
 * @param {Object} params  The parameters object which contain:
 *                         - {string} content: content markdown
 *
 * @returns {Object} The processed result containing polls, filtered content, and image details.
 *                         - {Array<PollFormContextValues>} polls: contain list of poll from markdown
 *                         - {string} newContentFilterRaw: contain markdown without image and poll markdown
 *                         - {Array<ImageFormContextValues>} imageMessageReplyList: contain image url from markdown
 */

export function processDraftPollAndImageForPrivateMessageReply({
  content,
}: {
  content: string;
}): {
  polls: Array<PollFormContextValues>;
  imageMessageReplyList: Array<ImageFormContextValues>;
  newContentFilterRaw: string;
} {
  if (!content) {
    return {
      polls: [],
      imageMessageReplyList: [],
      newContentFilterRaw: content,
    };
  }

  /**
   * Get all short url from markdown content
   */
  const shortUrls = getPostShortUrl(content) ?? [];

  /**
   * Remove all image markdown from content markdown
   */
  const imageFilter = replaceImageMarkdownWithPlaceholder({ content });
  /**
   * Remove all poll markdown from content markdown
   */
  const newContentFilter = filterMarkdownContentPoll(
    imageFilter.filterMarkdown,
  );

  return {
    polls: convertPollMarkdown(newContentFilter.pollMarkdowns),
    newContentFilterRaw: newContentFilter.filteredMarkdown,
    imageMessageReplyList: shortUrls.map((value, index) => ({
      url: '',
      shortUrl: value,
      imageMarkdown: imageFilter.imageMarkdowns[index],
    })),
  };
}
