import { getFormat } from '../getFormat';

it('should return format for image', () => {
  expect(
    getFormat(
      'https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551.jpg',
    ),
  ).toEqual('jpg');
});

it('should not return format for image', () => {
  expect(
    getFormat(
      'https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551',
    ),
  ).toEqual('');
});
