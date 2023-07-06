import setCookie from 'set-cookie-parser';

export function cookiesStringify(cookies: Array<string>) {
  let cookieString = '';
  if (Array.isArray(cookies)) {
    for (let cookie of cookies) {
      cookieString = cookieString + joinCookieString(cookie) + ';';
    }
  }
  if (typeof cookies === 'string') {
    cookieString = joinCookieString(cookies);
  }
  return cookieString;
}

function joinCookieString(cookie: string): string {
  return setCookie.splitCookiesString(cookie).join(';');
}
