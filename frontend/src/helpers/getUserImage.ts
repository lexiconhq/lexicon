import { AVATAR_IMAGE_SIZES, AVATAR_IMAGE_VARIANTS } from '../constants';

export function getImage(url: string, sizeOptions?: AVATAR_IMAGE_VARIANTS) {
  if (sizeOptions) {
    url = url.replace('{size}', `${AVATAR_IMAGE_SIZES[sizeOptions]}`);
  } else {
    url = url.replace('{size}', `${AVATAR_IMAGE_SIZES.s}`);
  }

  return url;
}
