import { generateSlug } from '../generateSlug';

it('should return correct slug', () => {
  const text1 = 'beard man';
  const text2 = 'smiley face 1 ';
  const text3 = 'Warning !!';
  expect(generateSlug(text1)).toEqual('beard_man');
  expect(generateSlug(text2)).toEqual('smiley_face_1');
  expect(generateSlug(text3)).toEqual('warning_!!');
});
