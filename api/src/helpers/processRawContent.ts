import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

const imageRegex = /<img.*? src="(\S+(?:jpe?g|png|gif|heic|heif))"/g;
const anchoredImageVideoRegex =
  /<a.*? href="(https?:\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif|mov|mp4|webm|avi|wmv|flv|webp))".*?>/g;
const srcSetRegex = /srcset="(.+?)"/g;
const imageUrlRegex = /(https?:\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif))/g;
const mentionRegex = /<a class=\"mention\".*?>@(.*?)<\/a>/g;
const imageMarkdownRegex = /(!\[.*?\]\()(upload:\/\/\S*)(\))/g;
const imageVideoTagRegex =
  /(?:<img[^>]*src(?:set)?=")(.+?)"|(?:<a[^>]* href="(https?:\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif|mov|mp4|webm|avi|wmv|flv|webp))")([^$]+?)<\/a>/g;

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
    return optimizedUrl.map((item) => item.replace(transparantRegex, ''));
  } else if (
    regex === anchoredImageVideoRegex ||
    regex === imageRegex ||
    regex === mentionRegex
  ) {
    result = result.map((item) => item.replace(regex, '$1'));
    return result.map((item) => item.replace(transparantRegex, ''));
  }
}

export function getCompleteImageVideoUrls(
  content: string,
  host: string = PROSE_DISCOURSE_UPLOAD_HOST,
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
  host: string = PROSE_DISCOURSE_UPLOAD_HOST,
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

export function generateMarkdownContent(raw: string, cooked: string) {
  const imageUrls = getCompleteImageVideoUrls(cooked) ?? [];

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
  host: string = PROSE_DISCOURSE_UPLOAD_HOST,
): Array<string> | undefined {
  let result = content.match(mentionRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, mentionRegex);
  }
}
