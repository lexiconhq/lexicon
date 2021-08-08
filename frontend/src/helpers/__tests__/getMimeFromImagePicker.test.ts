import getMimeFromImagePicker from '../getMimeFromImagePicker';

it('should return format for image', () => {
  expect(
    getMimeFromImagePicker(
      'https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551.jpg',
    ),
  ).toEqual('image/jpg');
});

it('should return format for image', () => {
  expect(
    getMimeFromImagePicker('/Users/Me/Desktop/logo-lexicon-512.png'),
  ).toEqual('image/png');
});
