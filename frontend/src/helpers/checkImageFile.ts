export function isImageValidUrl(imageUri: string) {
  let imageRegex = /([^\s]+(\.(jpe?g|png|gif|heic|heif))$)/g;
  return imageRegex.test(imageUri);
}
