import { PROSE_DISCOURSE_UPLOAD_HOST } from '../constants';

const imageRegex = /<img.*? src="(\S+(?:jpe?g|png|gif|heic|heif))".*?>/g;
const anchoredImageRegex = /<a.*? href="(https?:\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif))".*?>/g;
const srcSetRegex = /srcset="(.+?)"/g;
const imageUrlRegex = /(https?:\/\/[^ ]*\.(?:jpe?g|png|gif|heic|heif))/g;
const mentionRegex = /<a class=\"mention\".*?>@(.*?)<\/a>/g;

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
    regex === anchoredImageRegex ||
    regex === imageRegex ||
    regex === mentionRegex
  ) {
    result = result.map((item) => item.replace(regex, '$1'));
    return result.map((item) => item.replace(transparantRegex, ''));
  }
}

export function getPostImageUrl(
  content: string,
  host: string = PROSE_DISCOURSE_UPLOAD_HOST,
): Array<string> | undefined {
  let result = content.match(srcSetRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, srcSetRegex);
  }

  result = content.match(anchoredImageRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, anchoredImageRegex);
  }

  result = content.match(imageRegex) ?? undefined;
  if (result) {
    return handleRegexResult(result, host, imageRegex);
  }
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
