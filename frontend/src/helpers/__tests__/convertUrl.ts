import { convertUrl, isProtocolRelativeUrl } from '../convertUrl';

it('should check is protocol relative url or not', () => {
  const url1 = 'https://googleImage.Jpeg';
  const url2 = '//googleImage.Jpeg';
  const url3 = 'video.webm';

  expect(isProtocolRelativeUrl(url1)).toBeFalsy();

  expect(isProtocolRelativeUrl(url2)).toBeTruthy();

  expect(isProtocolRelativeUrl(url3)).toBeFalsy();
});

it('should convert url', () => {
  const url1 = 'https://image-avatar.png';
  const url2 = '//avatar-image.png';
  const url3 = 'video.webm';

  expect(convertUrl(url1)).toBe('https://image-avatar.png');

  expect(convertUrl(url2)).toBe('https://avatar-image.png');

  expect(convertUrl(url3)).toBe('video.webm');
});
