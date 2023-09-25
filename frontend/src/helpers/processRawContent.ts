import { DEFAULT_IMAGE } from '../../assets/images';
import { NO_EXCERPT_WORDING } from '../constants';

import { formatRelativeTime } from './formatRelativeTime';
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

  const message = (item: string) =>
    t(
      '> {item} are not supported at this time. To View, please access it on the website.',
      { item },
    );

  let result = content;

  result = replaceQuotesWithMarkdown(result);

  const toogleRegex = /\[(details)([\s\S]*?)(\[\/\1)\]/g;
  result = result.replace(toogleRegex, message('Toogles'));

  const pollRegex = /\[(poll)([\s\S]*?)(\[\/\1)\]/g;
  result = result.replace(pollRegex, message('Polls'));

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
