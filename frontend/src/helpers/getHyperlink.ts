export function getHyperlink(url: string, title: string) {
  const newTitle = title || url;

  let protocol = 'https://';
  let subDomain = 'www.';

  if (url.match(/^http:\/\//)) {
    protocol = 'http://';
    url = url.slice(protocol.length);
  } else if (url.match(/^https:\/\//)) {
    url = url.slice(protocol.length);
  }

  if (url.match(/^www\.\w/)) {
    url = url.slice(4);
  }

  const newUrl = protocol + subDomain + url;

  return { newUrl, newTitle };
}
