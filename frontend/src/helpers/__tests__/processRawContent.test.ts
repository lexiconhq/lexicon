import { NO_EXCERPT_WORDING } from '../../constants';
import {
  anchorToMarkdown,
  getPostShortUrl,
  sortImageUrl,
} from '../processRawContent';

describe('getPostShortUrl return short urls from raw content', () => {
  it('should return short url from image markdown', () => {
    expect(
      getPostShortUrl(`
      upload://()
      upload://example.png)
      (upload://example.jpeeg)
      (upload://example.jpeg)
      (upload://example.gif)
      (upload://example.jpg)
      (upload://example.heic)
      (upload://example.heif)
      (upload://example.png)`),
    ).toEqual([
      'upload://example.jpeg',
      'upload://example.gif',
      'upload://example.jpg',
      'upload://example.heic',
      'upload://example.heif',
      'upload://example.png',
    ]);
  });
});

describe('sortImageUrl return array of image urls and sort it according to short url', () => {
  let shortUrls = [
    'upload://example1.jpg',
    'upload://example2.jpg',
    'upload://example3.jpg',
  ];

  let originalUrls = [
    'uploaded/path/picexample1.jpg',
    'uploaded/path/picexample2.jpg',
    'uploaded/path/picexample3.jpg',
  ];

  let lookUpUrls = [
    { shortUrl: shortUrls[1], url: originalUrls[1] },
    { shortUrl: shortUrls[2], url: originalUrls[2] },
    { shortUrl: shortUrls[0], url: originalUrls[0] },
  ];

  it('should return sortedOriginalUrl', () => {
    expect(sortImageUrl(shortUrls, lookUpUrls)).toEqual(
      originalUrls.map((item) => item),
    );
  });

  it('should return sortedOriginalUrl with empty string if not found', () => {
    shortUrls.push('upload://example4.jpg');
    originalUrls.push('');
    expect(sortImageUrl(shortUrls, lookUpUrls)).toEqual(
      originalUrls.map((item) => (item !== '' ? item : item)),
    );
  });
});

describe('anchorToMarkdown change anchor tag to markdown', () => {
  it('should return content in markdown format', () => {
    expect(
      anchorToMarkdown(
        `<a href=\"link\" rel=\"nofollow noopener\">this</a> <img src=\"link2.png?v=9" class=\"emoji\" alt=\":thinking:\"> <a href=\"link3.png\">[elmo-and-bert]</a> <img src=\"example.jpg\" alt=\"elmo\" data-base62-sha1=\"wZCxbwaHDJABLOidcLoYG2jnoDV\" width=\"250\" height=\"355\"> https://example.io/example.png <a class="mention" href="/u/joanne">@Joanne</a>`,
      ),
    ).toEqual({
      content: `[this](link) :thinking:   https://example.io/example.png @Joanne`,
      imageUrl: 'link3.png',
      mentionedUsers: ['Joanne'],
    });

    expect(anchorToMarkdown('<a >this</a>')).toEqual({
      content: 'this',
      imageUrl: undefined,
      mentionedUsers: [],
    });

    expect(
      anchorToMarkdown(
        '<a class="mention" href="/u/joanne">@Joanne</a> <a class="mention" href="/u/jonathan">@jonathan</a> <a class="mention" href="/u/miichael">@Miichael</a>',
      ),
    ).toEqual({
      content: '@Joanne @jonathan @Miichael',
      imageUrl: undefined,
      mentionedUsers: ['Joanne', 'jonathan', 'Miichael'],
    });

    expect(anchorToMarkdown('<a ></a>')).toEqual({
      content: NO_EXCERPT_WORDING,
      imageUrl: undefined,
      mentionedUsers: [],
    });
  });
});
