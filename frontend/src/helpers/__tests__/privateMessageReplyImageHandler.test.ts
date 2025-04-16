// Import the function to be tested
import {
  convertResultUploadIntoImageFormContext,
  combineImageMarkdownWithContent,
} from '../privateMessageReplyImageHandler';
import { formatImageLink } from '../imageUploadHandler';

jest.mock('../imageUploadHandler', () => ({
  formatImageLink: jest.fn(),
}));

describe('convertResultUploadIntoImageFormContext', () => {
  it('should correctly transform the UploadOutput object', () => {
    const result = {
      extension: 'png',
      filesize: 1024,
      height: 600,
      humanFilesize: '12 KB',
      id: 1,
      originalFilename: 'testImage.png',
      shortPath: '/uploads/short-url/randomId.png',
      shortUrl: 'upload://randomId.png',
      thumbnailHeight: 600,
      thumbnailWidth: 800,
      url: 'http://test.com/uploads/default/original/1X/testImage.png',
      width: 800,
    };

    const formattedLink = '![testImage.png|800 x 600](upload://randomId.png)';

    (formatImageLink as jest.Mock).mockReturnValue(formattedLink);

    const transformedResult = convertResultUploadIntoImageFormContext(result);

    const expectedResult = {
      url: 'http://test.com/uploads/default/original/1X/testImage.png',
      shortUrl: 'upload://randomId.png',
      imageMarkdown: formattedLink,
    };

    expect(transformedResult).toEqual(expectedResult);

    expect(formatImageLink).toHaveBeenCalledWith(
      'testImage.png',
      800,
      600,
      'upload://randomId.png',
    );
  });
});

describe('combineImageMarkdownWithContent', () => {
  it('should combine markdown from image and content', () => {
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

    const content = 'testing send multiple images';

    const combineResult = combineImageMarkdownWithContent({
      imageList,
      content,
    });
    const expectResult = `![testImage.png|800 x 600](upload://randomIdTestImage.png)\n![testImage2.png|800 x 600](upload://randomIdTestImage2.png)\n${content}`;
    expect(combineResult).toEqual(expectResult);
  });

  it('should return original content if imageList empty', () => {
    const content = 'should send empty image';

    const combineResult = combineImageMarkdownWithContent({
      imageList: [],
      content,
    });
    const expectResult = `${content}`;
    expect(combineResult).toEqual(expectResult);
  });
});
