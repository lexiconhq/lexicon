import { isImageValidUrl } from '../checkImageFile';

it('should check is image uri or not', () => {
  const url1 = 'https://google.com';
  const url2 = 'https://upload/x/imahe.png';
  const url3 = 'video.webm';

  expect(isImageValidUrl(url1)).toBeFalsy();

  expect(isImageValidUrl(url2)).toBeTruthy();

  expect(isImageValidUrl(url3)).toBeFalsy();
});
