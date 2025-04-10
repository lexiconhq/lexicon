/* eslint-disable no-useless-escape */

import { NO_EXCERPT_WORDING } from '../../constants';
import { PollType } from '../../generatedAPI/server';
import {
  anchorToMarkdown,
  combineDataMarkdownPollAndImageList,
  filterMarkdownContentPoll,
  generateMarkdownContent,
  getPostShortUrl,
  processDraftPollAndImageForPrivateMessageReply,
  replaceImageMarkdownWithPlaceholder,
  sortImageUrl,
} from '../processRawContent';

jest.mock('expo-linking');

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

describe('generateMarkdownContent returns markdown content with complete urls', () => {
  const rawContent = 'Hello Lexicon! ![image](upload://shortUrl.com)';
  const resultRawContent = 'Hello Lexicon! ![image](1)';
  const shortImageUrl = '![image](upload://shortUrl.com)';
  const defaultImageUrl = '![image](1)';
  const imageUrls = ['https://wiki.kfox.io/example.png'];
  const markdownContent =
    'Hello Lexicon! ![image](https://wiki.kfox.io/example.png)';

  it('should return raw content when image urls are empty', () => {
    expect(generateMarkdownContent(rawContent, [])).toBe(resultRawContent);
  });
  it('should return raw content when there are no short urls in raw content', () => {
    const rawContentWithNoImage = 'Hello Lexicon!';
    expect(generateMarkdownContent(rawContentWithNoImage, imageUrls)).toBe(
      rawContentWithNoImage,
    );
  });

  it('should return raw content with short urls and complete urls when the total number of short urls is more than the complete image urls', () => {
    expect(
      generateMarkdownContent(`${rawContent} ${shortImageUrl}`, imageUrls),
    ).toBe(`${markdownContent} ${defaultImageUrl}`);
  });
  it('should return raw content with no short url when the total number of short urls is less than the complete image urls', () => {
    expect(
      generateMarkdownContent(rawContent, [...imageUrls, ...imageUrls]),
    ).toBe(markdownContent);
  });

  it('should return raw content with no short url when the total number of short urls is the same as the complete image urls', () => {
    expect(generateMarkdownContent(rawContent, imageUrls)).toBe(
      markdownContent,
    );
  });
  it('should only replace short urls and return raw content with complete urls when there are short and complete urls in raw data', () => {
    const completeImageUrl =
      '![second image](https://wiki.kfox.io/secondExample.png)';
    const secondCompleteUrlInMarkdown =
      '![image](https://wiki.kfox.io/example3.png)';

    expect(
      generateMarkdownContent(
        `${rawContent} ${completeImageUrl} ${shortImageUrl}`,
        [...imageUrls, 'https://wiki.kfox.io/example3.png'],
      ),
    ).toBe(
      `${markdownContent} ${completeImageUrl} ${secondCompleteUrlInMarkdown}`,
    );
  });
});

describe('filterMarkdownContentPoll returns filtered markdown content', () => {
  it('should return the content without the poll markdown', () => {
    const pollMarkdown =
      'This is a poll![poll type=number results=always chartType=bar min=1 max=10 step=2][/poll]';
    const result = 'This is a poll!';
    const filterResult = filterMarkdownContentPoll(pollMarkdown);
    expect(filterResult.filteredMarkdown).toBe(result);
    expect(filterResult.pollMarkdowns.length).toBe(1);
    expect(filterResult.pollMarkdowns).toEqual([
      '[poll type=number results=always chartType=bar min=1 max=10 step=2][/poll]',
    ]);
  });

  it('should filter out multiple poll markdown', () => {
    const pollMarkdown =
      '[poll type=number results=always chartType=bar min=1 max=10 step=2][/poll]There is two poll![poll type=regular results=always chartType=bar]\n- Banana\n- Apple\n[/poll]';
    const result = 'There is two poll!';
    const filterResult = filterMarkdownContentPoll(pollMarkdown);
    expect(filterResult.filteredMarkdown).toBe(result);
    expect(filterResult.pollMarkdowns.length).toBe(2);
    expect(filterResult.pollMarkdowns).toEqual([
      '[poll type=number results=always chartType=bar min=1 max=10 step=2][/poll]',
      '[poll type=regular results=always chartType=bar]\n- Banana\n- Apple\n[/poll]',
    ]);
  });

  it('should return empty with empty markdown', () => {
    const filterResult = filterMarkdownContentPoll('');
    expect(filterResult.filteredMarkdown).toBe('');
    expect(filterResult.pollMarkdowns).toEqual([]);
  });
});

describe('replaceImageMarkdownWithPlaceholder', () => {
  const placeholder = '[image]';
  it('should return empty string and empty array when content is undefined', () => {
    const result = replaceImageMarkdownWithPlaceholder({});
    expect(result.filterMarkdown).toBe('');
    expect(result.imageMarkdowns).toEqual([]);
  });

  it('should return empty string and empty array when content is empty string', () => {
    const result = replaceImageMarkdownWithPlaceholder({ content: '' });
    expect(result.filterMarkdown).toBe('');
    expect(result.imageMarkdowns).toEqual([]);
  });

  it('should replace image markdown with [image] placeholder and return array of image markdowns', () => {
    const content =
      'Here is an image ![undefined-1684143577983.jpg|3000 x 2002](upload://9WdaMOPqn99avHbcfhVV5ZbG91e.jpeg) in the text.';
    const result = replaceImageMarkdownWithPlaceholder({
      content,
      placeholder,
    });
    expect(result.filterMarkdown).toBe('Here is an image [image] in the text.');
    expect(result.imageMarkdowns).toEqual([
      '![undefined-1684143577983.jpg|3000 x 2002](upload://9WdaMOPqn99avHbcfhVV5ZbG91e.jpeg)',
    ]);
  });

  it('should handle multiple image markdown patterns and return array of image markdowns', () => {
    const content =
      'Image one ![img1.jpg|800 x 600](upload://img1.jpg) and image two ![img2.jpg|1024 x 768](upload://img2.jpg).';
    const result = replaceImageMarkdownWithPlaceholder({
      content,
      placeholder,
    });
    expect(result.filterMarkdown).toBe(
      'Image one [image] and image two [image].',
    );
    expect(result.imageMarkdowns).toEqual([
      '![img1.jpg|800 x 600](upload://img1.jpg)',
      '![img2.jpg|1024 x 768](upload://img2.jpg)',
    ]);
  });

  it('should not alter content without image markdown patterns and return empty array', () => {
    const content = 'This is a text without any image markdown.';
    const result = replaceImageMarkdownWithPlaceholder({
      content,
      placeholder,
    });
    expect(result.filterMarkdown).toBe(
      'This is a text without any image markdown.',
    );
    expect(result.imageMarkdowns).toEqual([]);
  });
});

describe('combineDataMarkdownPollAndImageList', () => {
  const imageList = [
    {
      url: 'http://test.com/uploads/default/original/1X/testImage.png',
      shortUrl: 'upload://randomIdTestImage.png',
      imageMarkdown:
        '![testImage.png|800 x 600](upload://randomIdTestImage.png)',
    },
    {
      url: 'http://test.com/uploads/default/original/1X/testImage2.png',
      shortUrl: 'upload://randomIdTestImage2.png',
      imageMarkdown:
        '![testImage2.png|800 x 600](upload://randomIdTestImage2.png)',
    },
  ];
  const polls = [
    {
      title: 'Sample Poll 1',
      minChoice: 1,
      maxChoice: 2,
      step: 1,
      pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
      results: 0,
      chartType: 1,
      groups: ['Group A'],
      closeDate: undefined,
      isPublic: true,
      pollChoiceType: PollType.Multiple,
      pollContent:
        '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]',
    },
  ];
  it('should return the original content when there are no images or polls', () => {
    const content = 'This is some content';

    const result = combineDataMarkdownPollAndImageList({
      content,
      imageList: [],
      polls: [],
    });
    const result1 = combineDataMarkdownPollAndImageList({
      content,
    });

    expect(result).toBe(content);
    expect(result1).toBe(content);
  });

  it('should combine content with image markdown when images are present', () => {
    const content = 'This is some content with image';

    const result = combineDataMarkdownPollAndImageList({ content, imageList });

    expect(result).toBe(
      `![testImage.png|800 x 600](upload://randomIdTestImage.png)\n![testImage2.png|800 x 600](upload://randomIdTestImage2.png)\n${content}`,
    );
  });

  it('should combine content with poll content when polls are present', () => {
    const content = 'This is some content with poll';

    const result = combineDataMarkdownPollAndImageList({ content, polls });

    expect(result).toBe(
      `[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]\n${content}`,
    );
  });

  it('should combine content with poll and image content', () => {
    const content = 'This is some content with poll and images';

    const result = combineDataMarkdownPollAndImageList({
      content,
      polls,
      imageList,
    });

    expect(result).toBe(
      `[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]\n![testImage.png|800 x 600](upload://randomIdTestImage.png)\n![testImage2.png|800 x 600](upload://randomIdTestImage2.png)\n${content}`,
    );
  });
});

describe('processDraftPollAndImageForPrivateMessageReply', () => {
  it('should return empty polls and image message list if content is an empty string', () => {
    expect(
      processDraftPollAndImageForPrivateMessageReply({ content: '' }),
    ).toEqual({
      polls: [],
      imageMessageReplyList: [],
      newContentFilterRaw: '',
    });
  });

  it('should process draft content correctly', () => {
    const content = `This is a poll and image[poll type=regular results=always chartType=bar]\n* Option 1\n* Option 2\n[/poll]\n![testImage.png|800 x 600](upload://randomIdTestImage.png)`;
    const result = processDraftPollAndImageForPrivateMessageReply({ content });

    const polls = [
      {
        title: undefined,
        minChoice: 0,
        maxChoice: 0,
        step: 1,
        pollOptions: ['Option 1', 'Option 2'],
        results: 0,
        chartType: 0,
        groups: [],
        closeDate: undefined,
        isPublic: false,
        pollChoiceType: PollType.Regular,
        pollContent:
          '[poll type=regular results=always chartType=bar]\n* Option 1\n* Option 2\n[/poll]',
      },
    ];
    const imageList = [
      {
        url: '',
        shortUrl: 'upload://randomIdTestImage.png',
        imageMarkdown:
          '![testImage.png|800 x 600](upload://randomIdTestImage.png)',
      },
    ];
    expect(result).toEqual({
      polls,
      newContentFilterRaw: 'This is a poll and image\n',
      imageMessageReplyList: imageList,
    });
  });
});
