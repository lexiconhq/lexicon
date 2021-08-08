import { cookiesStringify } from '../helpers';

it('Stringify array of cookies to string', () => {
  const inputCoookies = [
    '_t=token; path=/; expires=Sun, 08 Nov 2020 06:16:42 GMT; HttpOnly; SameSite=Lax',
    '_forum_session=session; path=/; HttpOnly; SameSite=Lax',
  ];
  const expectedOutput =
    '_t=token; path=/; expires=Sun, 08 Nov 2020 06:16:42 GMT; HttpOnly; SameSite=Lax;_forum_session=session; path=/; HttpOnly; SameSite=Lax;';
  let stringCookies = cookiesStringify(inputCoookies);
  expect(stringCookies).toEqual(expectedOutput);
});
