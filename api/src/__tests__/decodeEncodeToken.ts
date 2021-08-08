import { decodeToken, generateToken } from '../helpers';

it('The input and output should same', () => {
  const inputCoookies =
    '_t=token; path=/; expires=Sun, 08 Nov 2020 06:16:42 GMT; HttpOnly; SameSite=Lax; _forum_session=session; path=/; HttpOnly; SameSite=Lax';
  let token = generateToken(inputCoookies);
  let output = decodeToken(token);
  expect(output).toEqual(inputCoookies);
});
