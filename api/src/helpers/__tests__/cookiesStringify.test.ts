import { cookiesStringify, mergeCookies } from '..';

const inputCookies = [
  '_t=token; path=/; expires=Sun, 08 Nov 2020 06:16:42 GMT; HttpOnly; SameSite=Lax',
  '_forum_session=session; path=/; HttpOnly; SameSite=Lax',
];
describe('cookiesStringify', () => {
  it('Stringify array of cookies to string', () => {
    const expectedOutput = '_t=token;_forum_session=session;';
    let stringCookies = cookiesStringify(inputCookies);
    expect(stringCookies).toEqual(expectedOutput);
  });
  it('Stringify string cookie to string', () => {
    const expectedOutput = '_t=token;';
    let stringCookies = cookiesStringify(inputCookies[0]);
    expect(stringCookies).toEqual(expectedOutput);
  });
});

describe('mergeCookies', () => {
  it('should return empty string if there are no cookies or _t cookies at old cookies', () => {
    const oldCookies = '';
    const oldCookiesWithoutT =
      '_forum_session=oldSessionValue;_other_value=randomValue';

    const result = mergeCookies({ oldCookies, newCookies: inputCookies });
    const result2 = mergeCookies({
      oldCookies: oldCookiesWithoutT,
      newCookies: inputCookies,
    });
    const result3 = mergeCookies({});
    const result4 = mergeCookies({ oldCookies });

    const expectedOutput = '';

    expect(result).toBe(expectedOutput);
    expect(result2).toBe(expectedOutput);
    expect(result3).toBe(expectedOutput);
    expect(result4).toBe(expectedOutput);
  });
  it('should replace all value of old cookie', () => {
    const oldCookies = '_t=oldTokenValue;_forum_session=oldSessionValue;';

    let result = mergeCookies({ oldCookies, newCookies: inputCookies });
    const expectedOutput = '_t=token;_forum_session=session;';

    expect(result).toBe(expectedOutput);
  });
  it('should replace old cookie with only provided value', () => {
    const oldCookies = '_t=oldTokenValue;_forum_session=oldSessionValue;';
    const newCookies = [
      '_forum_session=newSession; path=/; HttpOnly; SameSite=Lax',
      '_other_cookie=otherCookieValue; path=/; HttpOnly;',
    ];
    let result = mergeCookies({ oldCookies, newCookies });
    const expectedOutput =
      '_t=oldTokenValue;_forum_session=newSession;_other_cookie=otherCookieValue;';
    expect(result).toBe(expectedOutput);
  });
});
