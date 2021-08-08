export function cookiesStringify(cookies: Array<string>) {
  let cookieString = '';
  if (Array.isArray(cookies)) {
    for (let cookie of cookies) {
      cookieString = cookieString + cookie + ';';
    }
  }
  if (typeof cookies === 'string') {
    cookieString = cookies;
  }
  return cookieString;
}
