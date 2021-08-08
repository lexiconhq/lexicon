import { automaticFontColor, hexToRgb } from '../automaticFontColor';

it('should return the right output', () => {
  expect(hexToRgb('#EDEDED')).toEqual({
    isSuccess: true,
    rgb: [237, 237, 237],
  });

  expect(hexToRgb('#FFF')).toEqual({
    isSuccess: true,
    rgb: [255, 255, 255],
  });

  expect(hexToRgb('#ED')).toEqual({
    isSuccess: false,
    rgb: [-1],
  });

  expect(hexToRgb('EDEDED')).toEqual({
    isSuccess: false,
    rgb: [-1],
  });
});

it('should color based on background color', () => {
  expect(automaticFontColor('#FFF')).toEqual('black');
  expect(automaticFontColor('#779ced')).toEqual('black');
  expect(automaticFontColor('#2b2b2b')).toEqual('white');
  expect(automaticFontColor('lexicon')).toEqual('white');
});
