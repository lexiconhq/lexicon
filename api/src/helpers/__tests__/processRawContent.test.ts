import {
  generateMarkdownContent,
  getCompleteImageVideoUrls,
  getEmojiImageUrls,
  userActivityMarkdownContent,
} from '..';

describe('getCompleteImageUrls return image urls from html tags', () => {
  it('should return the last url from srcset in img tag if any', () => {
    expect(
      getCompleteImageVideoUrls(
        `
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/example.jpeg\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\">
          <img src=\"https://wiki.kfox.io/example.jpeg\" alt=\"capacitor-example.jpg\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\" srcset=\"https://wiki.kfox.io/uploads/default/optimized/example_2_333x500.jpeg, https://wiki.kfox.io/uploads/default/optimized/example_2_499x750.jpeg 1.5x, https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpeg 2x\" data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/example_2_10x10.png\" />
        </a>
        `,
      ),
    ).toEqual([
      'https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpeg',
    ]);
  });
  it('should return image url in anchor tag if no srcset found', () => {
    expect(
      getCompleteImageVideoUrls(
        `
        <a href=\"https://wiki.kfox.io/example.jpeg\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\">
          <img src=\"https://wiki.kfox.io/example.jpeg\" alt=\"capacitor-example.jpg\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\" data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/example_2_10x10.png\>
        </a>
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/example.gif\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        <a href=\"https://wiki.kfox.io/example.jpg\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/example.heic\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        <a href=\"https://wiki.kfox.io/example.heif\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/example.png\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/images/transparent.png\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\"></a>
        https://example.io/example.png`,
        'https://wiki.kfox.io',
      ),
    ).toEqual([
      'https://wiki.kfox.io/example.jpeg',
      'https://wiki.kfox.io/example.gif',
      'https://wiki.kfox.io/example.jpg',
      'https://wiki.kfox.io/example.heic',
      'https://wiki.kfox.io/example.heif',
      'https://wiki.kfox.io/example.png',
      '',
    ]);
  });
  it('should return image url in img tag if no anchor tag found', () => {
    expect(
      getCompleteImageVideoUrls(
        `
        <p>
          <img src=\"https://wiki.kfox.io/example.jpeg\" alt="capacitor-example.jpg\" data-base62-sha1=\"eV63RAGvspfzY3TZPqWeOk0bBBr\" width=\"590\" height=\"393\">
          <br>
          Sample Text
        </p>
        <img src=\"https://wiki.kfox.io/example.gif\" alt=\"capacitor-example.gif\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\">
        <img src=\"https://wiki.kfox.io/example.png\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\">
        `,
      ),
    ).toEqual([
      'https://wiki.kfox.io/example.jpeg',
      'https://wiki.kfox.io/example.gif',
      'https://wiki.kfox.io/example.png',
    ]);
  });
  it('should return one image url for each image tag. The url will be from srcset if any, or from href tag if any, or from img src', () => {
    expect(
      getCompleteImageVideoUrls(
        `
        <p>
          <img src=\"https://wiki.kfox.io/uploads/default/original.jpeg\" alt=\"download\" width=\"276\" height=\"183\">
          <div class=\"lightbox-wrapper\">
            <a class=\"lightbox\" href=\"https://wiki.kfox.io/uploads/default/original/test.jpeg\" title=\"sky\">
              <img src=\"https://wiki.kfox.io/uploads/default/optimized/1X/test.jpeg\" alt=\"sky\" 
              data-base62-sha1=\"iHxPWI0MCekBqtf7L6NIvZfPQN6\" width=\"690\" height=\"414\"
              srcset=\"https://wiki.kfox.io/uploads/default/optimized/1X/test_2_690x414.jpeg, https://wiki.kfox.io/uploads/default/optimized/1X/test_2_1035x621.jpeg 1.5x, https://wiki.kfox.io/uploads/default/optimized/1X/test_2_1380x828.jpeg 2x\"
              data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/1X/test_2_10x10.png\">
            </a>
          </div>
          <div class=\"lightbox-wrapper\">
            <a class=\"lightbox\" href=\"https://wiki.kfox.io/uploads/default/original/test2.jpeg\" title=\"sky\">
              <img src=\"https://wiki.kfox.io/uploads/default/optimized/1X/test2.jpeg\" alt=\"sky\" 
              data-base62-sha1=\"iHxPWI0MCekBqtf7L6NIvZfPQN6\" width=\"690\" height=\"414\"
              data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/1X/test2_2_10x10.png\">
            </a>
          </div>
        </p>
        `,
      ),
    ).toEqual([
      'https://wiki.kfox.io/uploads/default/original.jpeg',
      'https://wiki.kfox.io/uploads/default/optimized/1X/test_2_1380x828.jpeg',
      'https://wiki.kfox.io/uploads/default/original/test2.jpeg',
    ]);
  });
});

describe('generateMarkdownContent returns markdown content with complete urls, obtained from cooked content', () => {
  const rawContent = 'Hello Lexicon! ![image](upload://shortUrl.com)';
  const shortImageUrl = '![image](upload://shortUrl.com)';
  const cookedContent =
    '<p>Hello Lexicon!</p><img src="https://wiki.kfox.io/example.png" width="333" height="500">';
  const markdownContent =
    'Hello Lexicon! ![image](https://wiki.kfox.io/example.png)';

  it('should return raw content when there are no image urls in cooked content', () => {
    expect(generateMarkdownContent(rawContent, '<p>Hello Lexicon!</p>')).toBe(
      rawContent,
    );
  });
  it('should return raw content when there is no short url in raw content', () => {
    const rawContentWithNoImage = 'Hello Lexicon!';
    expect(generateMarkdownContent(rawContentWithNoImage, cookedContent)).toBe(
      rawContentWithNoImage,
    );
  });

  it('should return raw content with short urls and complete urls when the total number of short urls is more than the complete urls in the cooked data', () => {
    expect(
      generateMarkdownContent(`${rawContent} ${shortImageUrl}`, cookedContent),
    ).toBe(`${markdownContent} ${shortImageUrl}`);
  });
  it('should return raw content with no short url when the total number of short urls is less than the complete urls in cooked data', () => {
    const completeImageUrl =
      '<img src="https://wiki.kfox.io/example.png" width="333" height="500">';
    expect(
      generateMarkdownContent(
        rawContent,
        `${cookedContent} ${completeImageUrl}`,
      ),
    ).toBe(markdownContent);
  });

  it('should return raw content with no short url when the total number of short urls is the same as the complete urls in the cooked data', () => {
    expect(generateMarkdownContent(rawContent, cookedContent)).toBe(
      markdownContent,
    );
  });
  it('should only replace short urls and return raw content with complete urls when there are short and complete urls in raw data', () => {
    const completeImageUrl =
      '![second image](https://wiki.kfox.io/secondExample.png)';
    const secondCompleteUrlInCooked =
      '<img src="https://wiki.kfox.io/example3.png" width="333" height="500">';
    const secondCompleteUrlInMarkdown =
      '![image](https://wiki.kfox.io/example3.png)';
    expect(
      generateMarkdownContent(
        `${rawContent} ${completeImageUrl} ${shortImageUrl}`,
        `${cookedContent} ${secondCompleteUrlInCooked}`,
      ),
    ).toBe(
      `${markdownContent} ${completeImageUrl} ${secondCompleteUrlInMarkdown}`,
    );
  });
});

describe('generate emoji url from image tag', () => {
  it('it should return image url from image tags', () => {
    const content =
      '<img src="https://kflounge-staging.kfox.io/images/emoji/twitter/smile.png?v=12" title=":smile:" class="emoji only-emoji" alt=":smile:" loading="lazy" width="20" height="20">';
    const content2 =
      '<p>Test. <img src="https://kflounge-staging.kfox.io/images/emoji/twitter/high_heel.png?v=12" title=":high_heel:" class="emoji only-emoji" alt=":high_heel:" loading="lazy" width="20" height="20"> <img src="https://kflounge-staging.kfox.io/images/emoji/twitter/man/5.png?v=12" title=":man:t5:" class="emoji" alt=":man:t5:" loading="lazy" width="20" height="20"></p>';

    const content3 =
      '<img src="https://kflounge-staging.kfox.io/images/emoji/twitter/high_heel.png?v=12" class="emoji only-emoji" alt=":high_heel:" loading="lazy" width="20" height="20">';

    expect(getEmojiImageUrls(content)).toEqual([
      {
        emojiTitle: ':smile:',
        emojiUrl:
          'https://kflounge-staging.kfox.io/images/emoji/twitter/smile.png',
      },
    ]);
    expect(getEmojiImageUrls(content2)).toEqual([
      {
        emojiTitle: ':high_heel:',
        emojiUrl:
          'https://kflounge-staging.kfox.io/images/emoji/twitter/high_heel.png',
      },
      {
        emojiTitle: ':man:t5:',
        emojiUrl:
          'https://kflounge-staging.kfox.io/images/emoji/twitter/man/5.png',
      },
    ]);
    expect(getEmojiImageUrls(content3)).toEqual([]);
  });
});

describe('generate new content for user activity', () => {
  it('it should return Content based input', () => {
    const content = 'Hello\n who is this';
    const content1 = 'Just want to test\n\n something';

    expect(userActivityMarkdownContent(content)).toEqual(content);
    expect(userActivityMarkdownContent(content1)).toEqual(content1);
  });
  it('it should replace content image', () => {
    const contentImage =
      'Hello\n <a class="lightbox" href="https://image.jpeg" data-download-href="https://image" title="exampleImage1">[exampleImage1]</a>';
    const contentImageSrc =
      '<img src="https://wiki.kfox.io/uploads/default/original.jpeg" alt="download" width="276" height="183">';

    expect(userActivityMarkdownContent(contentImage)).toEqual(
      'Hello\n ![exampleImage1](https://image.jpeg)',
    );
    expect(userActivityMarkdownContent(contentImageSrc)).toEqual(
      '![undefined](https://wiki.kfox.io/uploads/default/original.jpeg)',
    );
  });
  it('it should convert emoji', () => {
    const emojiContent =
      'Hello\n <img src="https://image/heart.png?v=12" title=":heart:" class="emoji" alt=":heart:" loading="lazy" width="20" height="20">';

    expect(userActivityMarkdownContent(emojiContent)).toEqual(
      'Hello\n ![emoji-:heart:](https://image/heart.png?v=12)',
    );
  });
  it('it should convert mention', () => {
    const mentionContent =
      'Is this true? <a class="mention" href="/u/marcello">@marcello</a>';

    expect(userActivityMarkdownContent(mentionContent)).toEqual(
      'Is this true? @marcello',
    );
  });
  it('it should convert Link', () => {
    const mentionContent =
      '<a href="https://www.google.com" rel="noopener nofollow ugc">Hello</a>';

    expect(userActivityMarkdownContent(mentionContent)).toEqual(
      '[Hello](https://www.google.com)',
    );
  });
});
