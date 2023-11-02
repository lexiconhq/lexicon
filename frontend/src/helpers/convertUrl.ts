export function isProtocolRelativeUrl(url: string) {
  const regex = /^\/\/[^/].*$/;
  return regex.test(url);
}

/**
 * This function is used to convert protocolRelativeUrl into absolute url
 * ex: //example.com
 * into: https://example.com
 *
 * @param url string
 * @returns string of url
 */

export function convertUrl(url: string) {
  return isProtocolRelativeUrl(url) ? `https:${url}` : url;
}
