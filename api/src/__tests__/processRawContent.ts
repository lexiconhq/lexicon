import { getPostImageUrl } from '../helpers';

describe('getPostImageUrl return image urls from html tags', () => {
  it('should return last url from srcset in img tag', () => {
    expect(
      getPostImageUrl(
        `
        <a class=\"lightbox\" href=\"https://wiki.kfox.io/example.jpeg\" data-download-href=\"https://wiki.kfox.io/uploads/default/example\" title=\"capacitor-example.jpg|1500 x 1001\">
          <img src=\"https://wiki.kfox.io/example.jpeg\" alt=\"capacitor-example.jpg\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\" srcset=\"https://wiki.kfox.io/uploads/default/optimized/example_2_333x500.jpeg, https://wiki.kfox.io/uploads/default/optimized/example_2_499x750.jpeg 1.5x, https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpeg 2x\" data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/example_2_10x10.png\" />
          <img src=\"https://wiki.kfox.io/example.jpeg\" alt=\"capacitor-example.jpg\" data-base62-sha1=\"fqX6HX7jqEIaBaQX3hc5oZMlxWs\" width=\"333\" height=\"500\" srcset=\"https://wiki.kfox.io/uploads/default/optimized/example_2_333x500.jpg, https://wiki.kfox.io/uploads/default/optimized/example_2_499x750.jpg 1.5x, https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpg 2x\" data-small-upload=\"https://wiki.kfox.io/uploads/default/optimized/example_2_10x10.png\" />
        </a>
        `,
      ),
    ).toEqual([
      'https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpeg',
      'https://wiki.kfox.io/uploads/default/optimized/example_2_666x1000.jpg',
    ]);
  });
  it('should return image url in anchor tag if no srcset found', () => {
    expect(
      getPostImageUrl(
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
      getPostImageUrl(
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
});
