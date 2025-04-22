/* eslint-disable no-useless-escape */

import { discourseHost } from '../../constants';

const imageRegex = /<img.*? src="(\S+(?:jpe?g|png|gif|heic|heif))"/g;
const anchoredImageVideoRegex =
  /<a.*? href="((https?:)?\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif|mov|mp4|webm|avi|wmv|flv|webp))".*?>/g;
const srcSetRegex = /srcset="(.+?)"/g;
const imageUrlRegex = /((https?:)?\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif))/g;
const mentionRegex = /<a class=\"mention\".*?>@(.*?)<\/a>/g;
const imageMarkdownRegex = /(!\[.*?\]\()(upload:\/\/\S*)(\))/g;
const imageVideoTagRegex =
  /(?:<img[^>]*src(?:set)?=")(.+?)"|(?:<a[^>]* href="((https?:)?\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif|mov|mp4|webm|avi|wmv|flv|webp))")([^$]+?)<\/a>/g;

const emojiBBCodeRegex = /(?<=^|\s):\w+:(?:t\d+:)?/g;
const emojiImageTagRegex = /<img.*?class="emoji.*? alt="(.*?)">/g;
const emojiTitleRegex = /title="([^"]+)"/g;
const emojiUrlWithoutHttps = /src=["'](\/[^ ]*\.(?:jpe?g|png|gif|heic|heif))/;

const userActivityContentRegex =
  /(?:<img[^>]*src(?:set)?="(.+?)"(?:[^>]*title="([^"]*)")?(?:[^>]*class="([^"]*)")?[^>]*>)|(?:<a[^>]* href="((https?:)?\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif|mov|mp4|webm|avi|wmv|flv|webp))"([^>]*?)title="([^"]*)"\s*>(\[.*?\])?<\/a>)|(?:<a[^>]* class="mention" href="\/u\/([^"]+)">@(.*?)<\/a>)|(?:<a[^>]* href="([^"]+)"[^>]*>(.*?)<\/a>)/g;

function handleRegexResult(
  result: RegExpMatchArray,
  host: string,
  regex: RegExp,
) {
  //when upload url is not found, discourse will return transparent.png
  const transparantRegex = new RegExp(
    `\\${host}\\\S*(transparent\.)(?:jpe?g|png|gif|heic|heif)`,
  );

  if (regex === srcSetRegex) {
    let optimizedUrl: Array<string> = [];
    result.forEach((item) => {
      const url = item.match(imageUrlRegex);
      if (url) {
        optimizedUrl.push(url[url.length - 1]);
      }
    });
    return optimizedUrl.map((item) => {
      const itemReplace = item.replace(transparantRegex, '');
      /**
       * This changes is used to handle some image which using local url into https url example :
       *
       * //kflounge-staging.kfox.io/uploads/default/optimized/1X/1a4ea5cb345d30d4230bdfa3671d1bc1026c772e_2_690x388.jpeg
       * into
       * https://kflounge-staging.kfox.io/uploads/default/optimized/1X/1a4ea5cb345d30d4230bdfa3671d1bc1026c772e_2_690x388.jpeg
       */

      return itemReplace[0] === '/' ? `https:${itemReplace}` : itemReplace;
    });
  } else if (
    regex === anchoredImageVideoRegex ||
    regex === imageRegex ||
    regex === mentionRegex
  ) {
    const processedResult: Array<string> = result.map((item) =>
      item.replace(regex, '$1'),
    );

    return processedResult.map((item) => {
      const itemReplace = item.replace(transparantRegex, '');

      /**
       * There is a case where, after replying to a post with an image, the cooked format is returned as `<img src="/uploads/default/original/1X/{image}.jpeg"/>`.
       * If we use the previous condition, which only checks `itemReplace[0] === '/'` and returns `https:{url}`, it results in an invalid URL like `https:/uploads/...`.
       * The expected format is `https://{hostname}/uploads/...`, so we need to ensure that URLs starting with `/uploads` are prefixed with the host.
       */

      return itemReplace.startsWith('/uploads')
        ? `${host}${itemReplace}`
        : itemReplace[0] === '/'
        ? `https:${itemReplace}`
        : itemReplace;
    });
  }
}

export function getCompleteImageVideoUrls(
  content: string,
  host: string = discourseHost,
): Array<string | undefined> | undefined {
  // Get all image tags in content
  let imageVideoTags = content.match(imageVideoTagRegex);
  // Get complete url from each image tag
  return imageVideoTags?.map((imageVideoTag) =>
    getPostImageUrl(imageVideoTag, host),
  );
}

export function getPostImageUrl(
  content: string,
  host: string = discourseHost,
): string | undefined {
  // Return only the first element of array because only one url is found

  let result = content.match(srcSetRegex) ?? undefined;

  if (result) {
    return handleRegexResult(result, host, srcSetRegex)?.[0];
  }

  result = content.match(anchoredImageVideoRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, anchoredImageVideoRegex)?.[0];
  }

  result = content.match(imageRegex) ?? undefined;

  if (result) {
    return handleRegexResult(result, host, imageRegex)?.[0];
  }
}

type EmojiResult = { emojiUrl: string; emojiTitle: string };

/**
 * Converts list of emoji image tags into an array of objects containing the URL and name of each emoji image.
 * Example:
 * Input: "<img src="https://kflounge-staging.kfox.io/images/emoji/twitter/smile.png?v=12" title=":smile:" class="emoji only-emoji" alt=":smile:" loading="lazy" width="20" height="20">"
 * Output: [{emojiUrl: "https://kflounge-staging.kfox.io/images/emoji/twitter/smile.png",emojiTitle: ":smile:"}]
 *
 * In some cases, such as live chat messages, emoji image URLs may not include a host.
 * Example:
 * **Input:**
 * `<img src="/images/emoji/twitter/grinning.png?v=12" title=":grinning:" class="emoji only-emoji" alt=":grinning:" loading="lazy" width="20" height="20">`
 *
 * @param {string} content - The input string containing img tags for emoji images.
 * @returns {Array<{emojiUrl: string, emojiTitle: string}>} - An array of objects, each with properties for the URL and name of an emoji.
 */

export function getEmojiImageUrls(
  content: string,
): Array<EmojiResult | undefined> {
  let emojiTags = content.match(emojiImageTagRegex);

  let maybeEmojiResults =
    emojiTags?.map((item) => {
      let emojiUrl =
        item.match(imageUrlRegex)?.[0] || item.match(emojiUrlWithoutHttps)?.[1];

      // condition if show emoji from live chat without host
      if (emojiUrl && !emojiUrl.startsWith('http')) {
        emojiUrl = `${discourseHost}${emojiUrl}`;
      }
      const emojiTitle = item.match(emojiTitleRegex)?.[0];
      if (!emojiUrl || !emojiTitle) {
        return undefined;
      }
      let valueEmojiTitle = emojiTitle.split('=')[1];
      const replaceValueEmojiTitle = valueEmojiTitle
        ? valueEmojiTitle.replace(/"/g, '')
        : undefined;
      return {
        emojiUrl,
        emojiTitle: replaceValueEmojiTitle || '',
      };
    }) ?? [];

  let emojiResults = maybeEmojiResults?.filter(Boolean);

  return emojiResults;
}

export function generateMarkdownContent(raw: string, cooked: string) {
  const imageUrls = getCompleteImageVideoUrls(cooked) ?? [];

  const emojiBBcode = raw.match(emojiBBCodeRegex);

  if (emojiBBcode?.length) {
    const emojiUrls = getEmojiImageUrls(cooked);
    raw = raw.replace(emojiBBCodeRegex, (name: string) => {
      let url = emojiUrls.find((value) => value?.emojiTitle.includes(name));
      return url?.emojiUrl ? `![emoji-${name}](${url.emojiUrl})` : name;
    });
  }

  const validImageUrls = imageUrls.filter((item) => item);
  if (!validImageUrls.length) {
    return raw;
  }

  let imageCount = 0;
  const markdown = raw.replace(
    imageMarkdownRegex,
    (
      _: string,
      imageName: string,
      shortUrl: string,
      closeParenthesis: string,
    ) => {
      const modifiedImageMarkdown = `${imageName}${
        validImageUrls?.[imageCount] ?? shortUrl
      }${closeParenthesis}`;
      imageCount += 1;

      return modifiedImageMarkdown;
    },
  );

  return markdown;
}

export function getMention(
  content: string,
  host: string = discourseHost,
): Array<string> | undefined {
  let result = content.match(mentionRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, mentionRegex);
  }
}

export function userActivityMarkdownContent(content: string) {
  const markdown = content.replace(
    userActivityContentRegex,
    (
      _,
      imgSrc: string,
      imgTitle: string,
      imgClass: string,
      aHref: string,
      _https,
      _dataHref,
      aTitle: string,
      _emptyMention,
      _urlName,
      nameMention,
      linkHref,
      linkText,
    ) => {
      let modifiedImageMarkdown = ``;

      if (imgSrc) {
        modifiedImageMarkdown = `![${
          imgClass === 'emoji' || imgClass === 'emoji only-emoji'
            ? 'emoji-'
            : ''
        }${imgTitle}](${imgSrc})`;
      } else if (aHref) {
        modifiedImageMarkdown = `![${aTitle}](${aHref})`;
      } else if (nameMention) {
        modifiedImageMarkdown = `@${nameMention}`;
      } else if (linkHref && linkText) {
        modifiedImageMarkdown = `[${linkText}](${linkHref})`;
      }

      return modifiedImageMarkdown;
    },
  );
  return markdown;
}
